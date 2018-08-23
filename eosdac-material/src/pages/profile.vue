<template>
<q-page class="relative-position" style="overflow-x: hidden; ">
  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px">
    <div class="row">
      <div class="col-12">
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("profile.profile") }}</h4>
      </div>
    </div>
    <div class="row  q-mt-md" style="margin-left:154px;background:none">
      <div class="col-xs-12">
        <div class="text-dimwhite text-weight-light q-caption">User Name</div>
        <div class="q-display-1 text-weight-thin">LUKESTOKES</div>
      </div>
    </div>

    <div style="position:absolute; z-index:1;height:140px;width:140px; top:70px;">
      <q-btn v-if="edit" round size="md" color="primary" icon="icon-plus" style="position:absolute; bottom:0px;right:7px; z-index:2" @click="visible=true" />
      <div class="fit" style="border-radius:50%; border:4px solid white; background:grey;overflow:hidden;" >
        <transition name="fade">
          <img  :class="fitcontainer"  v-bind:src="form.image" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
        </transition>
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="row  " style="margin-left:170px; margin-right:16px; background:none">

        <div class="col-md-2 col-xs-6 q-pl-sm" >
          <div class="text-dimwhite text-weight-light q-caption">Given Name</div>
          <q-input color="white" dark :readonly="!edit" :hide-underline="!edit" v-model="form.givenName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pl-sm">
          <div class="text-dimwhite text-weight-light q-caption">Family Name</div>
          <q-input color="white" dark :readonly="!edit" :hide-underline="!edit"  v-model="form.familyName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pl-sm">
          <div class="text-dimwhite text-weight-light q-caption">Gender</div>
           <q-select
              class=""
              color="white"
              :readonly="!edit" 
              :hide-underline="!edit"
              v-model="form.gender"
              dark
             :options="[{label:'Female', value:'female'}, {label:'Male', value:'male'}, {label:'Other', value:'other'}]"
            />
        </div>
        <div class="col-md-2 col-xs-6 q-pl-sm">
          <div class="text-dimwhite text-weight-light q-caption">Type</div>
          <div>Member</div>
        </div>
      </div>

    </div>
  </div> <!-- end header gradient -->

  <div class="q-px-md" >
    <div class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">
      <div class="col-md-8 col-sm-12 q-pa-md">
        <div class="" style="height:100%">
          <div class="q-mb-md">{{ $t('profile.bio') }}</div>
          <q-input v-if="edit" inverted rows="8" color="dark" type="textarea" v-model="form.description" dark />
          <div v-if="!edit">{{form.description}}</div>
        </div>
      </div>
      <div class="col-md-4 col-sm-12 q-pa-md">
        <div class="column justify-between" style="height:100%">
          <div class="q-mb-md">{{ $t('profile.website') }}</div>
          <q-input dark type="url" v-model="form.url"  :readonly="!edit" :hide-underline="!edit"  :float-label="$t('website')" placeholder="http://example.com" /> 
          <div v-if="edit"> 
            <q-input dark type="url"
              class="q-mt-md q-mb-md"
              v-model="social.link"
              v-for="(social, i) in form.sameAs"
              :key = i
              :float-label="`${$t('social_link')} ${i+1}`"
              @input="deleteEmptyLinks"
              :placeholder="$t('social_profile_link')"
            />
            <q-btn  round  color="primary" @click="addSocial" icon="icon-plus" />
          </div>
          <div >
            <q-btn size="md" class="float-right" color="primary" @click="edit = !edit" :label="$t('profile.edit')" />
            <q-btn size="md" class="float-right on-left" color="dark" @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')" :label="$t('profile.download')" />
          </div>
        </div>
      </div>
      
    </div>
  </div>



  <q-modal v-model="visible"  minimized :content-css="{width: '80vw'}" >
    <div style="padding: 20px;" class="bg-dark round-borders">
      <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md" :float-label="$t('profile_picture_url')" placeholder="http://example.site/mypic.jpg" />
      <q-btn round color="primary" class="absolute" style="top:5px;right:5px" @click="visible=false" icon="icon-plus" />

    </div>
  </q-modal>
</q-page>

<!-- <q-page class="q-pa-md">

  <div class="q-pa-md bg-dark2 round-borders shadow-5 animate-pop">
    <div class="row">

      <div style="width:150px">
        <div class="wrapper round-borders">
          <q-btn round size="sm" color="primary" icon="icon-plus" style="position:absolute; top:-15px;right:-15px; z-index:2" @click="visible=true" />
          <div class="pic_wrapper bg-dark" >
            <transition name="fade">
              <q-icon style="font-size:100px" class="text-primary absolute-center" name="icon-topmenu-2" v-if="!loaded" />
            </transition>
            <transition name="fade">
              <img  :class="fitcontainer"  v-bind:src="form.image" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
            </transition>
          </div>
        </div>
      </div>

      <div style="width:400px">
        <q-input dark type="text" v-model="form.givenName"  class="q-mt-md" :float-label="$t('givenName')" placeholder="Jhon" />
        <q-input dark type="text" v-model="form.familyName"  class="q-mt-md" :float-label="$t('familyName')" placeholder="Jhon" />
      </div>

    </div> 

    <q-input dark type="email" v-model="form.email"  class="q-mt-md" :float-label="$t('email_address')" placeholder="my.email@example.site" />

    <div class="q-mt-md" style="color:#979797;margin-bottom:3px">{{ $t('gender') }}</div>
    <q-radio dark v-model="form.gender" val="female" :label="$t('female')" class="q-mr-sm" />
    <q-radio dark v-model="form.gender" val="male" :label="$t('male')" class="q-mr-sm" />
    <q-radio dark v-model="form.gender" val="opt3" :label="$t('other')" />

    <q-input dark type="url" v-model="form.url"  class="" :float-label="$t('website')" placeholder="http://example.com" />
    <q-input dark type="textarea" v-model="form.description"  class="q-mt-md" :float-label="$t('about_me')" :placeholder="$t('placeholder_short_bio')" />

    <q-input dark type="url"
      class="q-mt-md q-mb-md"
      v-model="social.link"
      v-for="(social, i) in form.sameAs"
      :key = i
      :float-label="`${$t('social_link')} ${i+1}`"
      @input="deleteEmptyLinks"
      :placeholder="$t('social_profile_link')"
    />
    <div class="relative-position" style="height:50px">
        <q-btn  class="float-left" color="primary" @click="addSocial" icon="icon-plus" />

        <q-btn class="float-right" :loading="isuploading" color="positive" @click="saveProfile" :label="$t('save')">
            <q-spinner slot="loading" />
        </q-btn>
        <q-btn color="primary" class="float-right on-left"  @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')"  label="Download" />
    </div>
 
    <div v-if="ipfslink!='' "><a target="_blank" :href="ipfslink">{{ipfslink}}</a></div>
    <pre v-if="debug_view">{{ form }}</pre>
  


    <q-modal v-model="visible"  minimized :content-css="{width: '80vw'}" >
        <div style="padding: 20px; border:1px solid #491289" class="bg-dark round-borders">
          <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md" :float-label="$t('profile_picture_url')" placeholder="http://example.site/mypic.jpg" />
          <q-btn round color="primary" class="absolute" style="top:5px;right:5px" @click="visible=false" icon="icon-plus" />

        </div>
    </q-modal>

</div>

</q-page> -->
</template>

<style lang="stylus">
@import '~variables'

.gradient-bg-primary{
  background-image linear-gradient(to right, $primary, $p-light);
}

.blur-details{
  background rgba(255, 255, 255, 0.1);
}

.square {
  width: 50%;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.wrapper{
  width: 140px;
  height: 140px;
  border: 3px solid white;
  border-radius:50%;
  box-sizing: border-box;
  position:relative;
  overflow:hidden;


}
.pic_wrapper {
  width: 100%;
  height: 100%;
  overflow:hidden;
  box-sizing: border-box;

}


.fitheight{
  height:100%;
}
.fitwidth{
  width:100%;
}
</style>

<script>
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
import {
  mapGetters
} from 'vuex'
export default {
  components:{

  },
  data () {
    return {
      debug_view: false,
      ipfslink:'',
      edit:false,

      visible:false,
      fitcontainer:'fitheight',
      loaded:false,
      isuploading: false,
      form:{
          "givenName": "Kasper",
          "familyName": "Taeymans",
          "gender": "male",
          "description": "This is an example bio....",
          "email": "",
          "url": "",
          "image": "https://i.ytimg.com/vi/zjNHS3aIQJ0/maxresdefault.jpg",
          "sameAs": [{link:''}],
          "timezone": new Date().getTimezoneOffset() //time-zone offset see: https://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
        }


    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getAccount : 'account/getAccount',
      getScatter: 'api/getScatter',
    })
  },


  methods:{
     onLoaded() {
        let img = this.$refs.profile_pic;

        this.fitcontainer = img.width <= img.height ? 'fitwidth' : 'fitheight';
        console.log(img.width +' '+ img.height);
        this.visible = false;
        this.loaded = true;
    },
    addSocial(){

      this.deleteEmptyLinks();
      this.form.sameAs.push({link:''});


    },
    deleteEmptyLinks(){
      if(this.form.sameAs.length ){
        this.form.sameAs = this.form.sameAs.filter(function(item){
          return item.link !='';
        });
      }

    },

    async saveProfile(){
      this.isuploading = true;
      let form_string = JSON.stringify(this.form);
      const buffer = await Buffer.from(form_string); //try catch
      // let ipfshash = await this.ipfsAdd(buffer);
      // this.isuploading = false;

      // if(ipfshash[0].hash != undefined){
      //   this.ipfslink='https://ipfs.io/ipfs/'+ipfshash[0].hash;
      // }
      // else{
      //   console.log('error getting hash from ipfs');
      // }
      let signedmsg = await this.signMessage(form_string);
      let ipfshash = await this.ipfsAdd(buffer, false );
      console.log(ipfshash);

      this.isuploading = false;
    },
    signMessage(data){
      let publicKey = this.getAccount.permissions[0].required_auth.keys[0].key;
      let whatfor = 'Profile Upload';//do not translate

      return this.getScatter.getArbitrarySignature(publicKey, data, whatfor, false)
      .then(res => res).catch(e => {console.log(e); return false});
    },


    postToServer(data){
      console.log('Start upload to server!');
      return this.$axios.post(this.$configFile.api.profileStoreUrl, data)
      .then(res => {
         console.log(res);
      }).catch(e =>{
        console.log(e)
      });
    },

    ipfsAdd(buffer, dont_upload=false){
      return ipfs.add(buffer, {"onlyhash": dont_upload}).then(res => res).catch(e => {return false});
    },

    ipfsGet (hash) {
      ipfs.cat(hash, {buffer: false}).then(content => {
        console.log(content.toString() )
      })
      .catch(error => console.log(error) )
    },

    download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

  },

  mounted: function(){

   }

}
</script>
