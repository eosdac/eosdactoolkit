
import configFile from '../statics/config.json';
import axios from 'axios';


class ProfileCache{

  constructor(){
    console.log('profile cache initiated');
    this.cache=[];
  }

  async getProfiles(accountnames){

    //reduce requested accountnames
    let profiles = accountnames.reduce((temp, accountname)=>{

      let t = this.inCache(accountname);
      t ? temp.cached.push(t) : temp.fetch.push(accountname);
      return temp;

    }, {cached:[], fetch:[]} );

    // console.log(profiles)

    //fetch profiles only when not in cache
    if(profiles.fetch.length){
      profiles.fetch = await this.fetchProfiles(profiles.fetch);
    }

    //return combined array of profiles
    return [...profiles.cached, ...profiles.fetch];
    
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

}

let profiles = new ProfileCache();


export default ({ Vue }) => {
  Vue.prototype.$profiles = profiles;
}