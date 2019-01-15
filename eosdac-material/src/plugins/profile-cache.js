
import configFile from '../statics/config.json';
import axios from 'axios';


class ProfileCache{

  constructor(){
    console.log('profile cache initiated');
    this.cache=[];
    this.default_avatar = '../statics/img/default-avatar.png';
    let cache_life = 1000*60*60;

    if(cache_life){
      setInterval(()=>{this.cache=[]; console.log('emptied cache')}, cache_life );
    }
    
  }

  async getProfiles(accountnames, force_reload=false){

    if(force_reload) this.removeFromCache(accountnames);
    //reduce requested accountnames
    let profiles = accountnames.reduce((temp, accountname)=>{

      let t = this.inCache(accountname);
      t ? temp.cached.push(t) : temp.fetch.push(accountname);
      return temp;

    }, {cached:[], fetch:[]} );

    //fetch profiles only when not in cache
    if(profiles.fetch.length){
      profiles.fetch = await this.fetchProfiles(profiles.fetch);
    }

    //return combined array of profiles
    return [...profiles.cached, ...profiles.fetch];
    
  }

  async getAvatars(accountnames, force_reload = false){
    let profiles = await this.getProfiles(accountnames, force_reload);
    let avatars = accountnames.map(accountname=>{
      let p = profiles.find(x=> x._id === accountname );
      let img = p && p.profile && p.profile.image ? p.profile.image : this.default_avatar;
      return {_id: accountname, image: img};
    });
    return avatars;
  }

  async fetchProfiles(accountnames){

    let url = configFile.api.profileApiUrl;
    if (url.substr(-1) != '/'){
      url += '/profiles';
    }
    else{
      url += 'profiles';
    }
    
    return axios.post(url, accountnames).then(r => {

        console.log('fetched new profiles', r.data.length)
        this.cache = this.cache.concat( r.data );
        return r.data;
      }).catch(e => {
        console.log('could not load profile file');
        return false;
      });
  }

  inCache(accountname){
    let profile = this.cache.find(p=>p._id==accountname);
    return profile || false;
  }

  removeFromCache(accountnames){
    this.cache = this.cache.filter(p=> !accountnames.includes(p._id) );
  }

}

let profilecache = new ProfileCache();

export default ({ Vue }) => {
  Vue.prototype.$profiles = profilecache;
}