<template>
<q-page class="relative-position" style="overflow-x: hidden; ">
  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px">
    <div class="row">
      <div class="col-12">
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("profile.profile") }}</h4>
      </div>
    </div>
    <div class="row  q-mt-md profile_header_top_row">
      <div class="col-xs-12">
        <div class="text-dimwhite text-weight-light q-caption">User Name</div>
        <div class="q-display-1 text-weight-thin uppercase">kasperfish</div>
      </div>
    </div>

    <div class="animate-pop profile_image_outer_wrap" style="">
      <q-btn v-if="edit" round size="md" class="animate-pop" color="primary" icon="icon-plus" style="position:absolute;bottom:0;right:7px;z-index:2" @click="visible=true" />
      <div class="fit profile_image_inner_wrap">
        <transition name="fade">
          <img  :class="fitcontainer" class="hack_center" v-bind:src="setImgSrc" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
        </transition> 
        <q-spinner-oval color="white" class="hack_center" v-if="!loaded" size="80px" />
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="row profile_header_bottom_row">
        <div class="col-md-2 col-xs-6 q-pr-sm" >
          <div class="text-dimwhite text-weight-light q-caption">{{ $t('profile.givenName') }}</div>
          <q-input color="white" dark :readonly="!edit" :hide-underline="!edit" v-model="form.givenName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-dimwhite text-weight-light q-caption">{{ $t('profile.familyName') }}</div>
          <q-input color="white" dark :readonly="!edit" :hide-underline="!edit"  v-model="form.familyName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-dimwhite text-weight-light q-caption">{{ $t('profile.gender') }}</div>
           <q-select
              class=""
              color="white"
              :readonly="!edit" 
              :hide-underline="!edit"
              v-model="form.gender"
              dark
             :options="[{label:$t('profile.female'), value:'female'}, {label:$t('profile.male'), value:'male'}, {label:$t('profile.other'), value:'other'}]"
            />
        </div>
        <div class="col-md-2 col-xs-6">
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
              :float-label="`${$t('profile.social_link')} ${i+1}`"
              @input="deleteEmptyLinks"
              :placeholder="$t('profile.social_profile_link')"
            />
            <q-btn  round  color="primary" @click="addSocial" icon="icon-plus" />
          </div>
          <div class="row gutter-sm justify-end q-mt-md">
            <div>
              <q-btn size="md" class="animate-pop" color="primary" @click="edit = !edit" :label="$t('profile.edit')" />
            </div>
            <div>
              <q-btn size="md" class="animate-pop" color="dark" @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')" :label="$t('profile.download')" />
            </div>
          </div>
        </div>
      </div>
      
    </div>

<!--     <div class="q-pa-md q-mt-md shadow-5 bg-dark2">
      <q-input color="white" dark v-model="dev_profile_url" placeholder="profile url"/>
    </div> -->

  </div>





  <q-modal v-model="visible"  minimized @hide="handleModalClose" :content-css="{width: '80vw'}" >
    <div style="padding: 20px;" class="bg-dark round-borders">
      <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md " :float-label="$t('profile_picture_url')" placeholder="http://example.site/mypic.jpg" />
      <q-btn round color="primary" class="absolute" style="top:5px;right:5px" @click="visible=false" icon="icon-plus" />

    </div>
  </q-modal>
</q-page>
</template>



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
      dev_profile_url: '',
      ipfslink:'',
      edit:false,

      visible:false,
      fitcontainer:'full-height',
      loaded:false,
      isuploading: false,
      form:{
          "givenName": "Kasper",
          "familyName": "Taeymans",
          "gender": "male",
          "description": "This is an example bio....",
          "email": "",
          "url": "",
          "image": "",
          "sameAs": [{link:'ddddd'}, {link:'ddddd'}, {link:'ddddd'}],
          "timezone": new Date().getTimezoneOffset() //time-zone offset see: https://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
        }


    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getAccount : 'account/getAccount',
      getScatter: 'api/getScatter',
    }),
    setImgSrc(){
      let image = 'https://i0.wp.com/www.hylandfishandchips.ca/wp-content/uploads/2015/11/Sad-Fish-300x243.png'; //default image
      if(this.form.image != ''){
        image = this.form.image;
      }
      return image;

    }
  },


  methods:{
     onLoaded() {
        let img = this.$refs.profile_pic;

        this.fitcontainer = img.width <= img.height ? 'full-width' : 'full-height';
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

    handleModalClose(){
      setTimeout(()=>{
        if(!this.loaded){
          this.form.image = '';
        }
      },300)
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

<style lang="stylus">
@import '~variables'

.gradient-bg-primary{
  background-image linear-gradient(to right, $primary, $p-light);
}
.blur-details{
  background rgba(255, 255, 255, 0.1);
}

.profile_header_bottom_row{
  margin-left:170px; 
  margin-right:16px; 
  background:none

}
.profile_header_top_row{
  margin-left:154px;
  background:none

}
.profile_image_inner_wrap{
  border-radius:50%; 
  border:4px solid white; 
  background: #7c41ba;
  overflow:hidden;
  position:relative;

}
.profile_image_outer_wrap{
  position:absolute; 
  z-index:1;
  height:140px;
  width:140px; 
  top:70px;
  transition: all .2s ease-in-out;
}
.profile_header_bottom_row .q-if-control{
    display:none !important;
}
.hack_center{
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
}
</style>