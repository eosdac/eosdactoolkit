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
        <div class="text-dimwhite q-caption uppercase">{{ $t('profile.account_name') }}</div>
        <div class="q-display-1 text-weight-thin uppercase">{{ account_name }}</div>
      </div>
    </div>

    <div class="animate-pop profile_image_outer_wrap" style="">
      <q-btn v-if="is_edit" round size="md" class="animate-pop" color="primary" icon="icon-plus" style="position:absolute;bottom:0;right:7px;z-index:2" @click="visible=true" />
      <div class="fit profile_image_inner_wrap">
        <transition name="fade">
          <img  :class="{ 'hack_center': centerimage, 'full-width': setwidth, 'full-height': !setwidth }" v-bind:src="setImgSrc" v-on:load="onLoaded" v-show="loaded" ref="profile_pic">
        </transition> 
        <q-spinner-oval color="white" class="hack_center" v-if="!loaded" size="139px" />
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="row profile_header_bottom_row">
        <div class="col-md-2 col-xs-6 q-pr-sm" >
          <div class="text-dimwhite q-caption uppercase">{{ $t('profile.givenName') }}</div>
          <q-input color="white" dark :readonly="!is_edit" :hide-underline="!is_edit" v-model="form.givenName"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-dimwhite q-caption uppercase">{{ $t('profile.familyName') }}</div>
          <q-input color="white"  dark :readonly="!is_edit" :hide-underline="!is_edit"  v-model="form.familyName" class="q-title"/>
        </div>
        <div class="col-md-2 col-xs-6 q-pr-sm">
          <div class="text-dimwhite q-caption uppercase">{{ $t('profile.gender') }}</div>
           <q-select
              class=""
              color="white"
              :readonly="!is_edit" 
              :hide-underline="!is_edit"
              v-model="form.gender"
              dark
             :options="[{label:$t('profile.female'), value:'female'}, {label:$t('profile.male'), value:'male'}, {label:$t('profile.other'), value:'other'}]"
            />
        </div>
        <div class="col-md-2 col-xs-6">
          <div class="text-dimwhite q-caption uppercase">Type</div>
          <div>Member</div>
        </div>
      </div>

    </div>
  </div> <!-- end header gradient -->

  <div class="q-px-md" >
    <div class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">
      <div class="col-md-8 col-xs-12 q-pa-md">
        <div class="" style="height:100%">
          <div class="q-title q-mb-md">{{ $t('profile.bio') }}</div>
          <q-input v-if="is_edit" inverted rows="8" color="dark" type="textarea" v-model="form.description" dark />
          <div class="text-dimwhite q-body-1" v-if="!is_edit">{{form.description}}</div>
        </div>
      </div>
      <div class="col-md-4 col-xs-12 q-pa-md">
        <div class="column justify-between" style="height:100%">
          
          <!-- on display -->
          <div v-if="!is_edit">
            <div class="q-title q-mb-md">{{ $t('profile.website') }}</div>
            <div class="text-dimwhite q-body-1">{{form.url}}</div>
            <div class="q-mt-md">
              <q-btn v-for="(social, i) in parseSocialLinks()"  class="on-left" :key ="i" round color="dark" @click.native="openURL(social.link)" >
                <q-icon  :name="'icon-'+social.icon" />
              </q-btn>
            </div>
          </div>
          <!-- on is_edit -->
          <div v-if="is_edit">
            <div class="q-title q-mb-md">{{ $t('profile.website') }}</div>
            <q-input dark type="url" v-model="form.url"  placeholder="http://example.com" />
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

          <div v-if="allow_edit" class="row gutter-sm justify-end q-mt-md">
            <div >
              <q-btn v-if="!is_edit" size="md" class="animate-pop" color="primary" @click="is_edit =! is_edit" :label="$t('profile.edit')" />
              <q-btn v-else size="md" class="animate-pop" color="positive" @click="is_edit =! is_edit" :label="$t('profile.save')" />
            </div>
            <div>
              <q-btn v-if="is_edit" size="md" class="animate-pop" color="red" @click="is_edit =! is_edit" :label="$t('profile.cancel')" />
              <!-- <q-btn size="md" class="animate-pop" color="dark" @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')" :label="$t('profile.download')" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>

<!--     <div class="q-pa-md q-mt-md shadow-5 bg-dark2">
      <q-input color="white" dark v-model="dev_profile_url" placeholder="profile url"/>
    </div> -->

  </div>

  <q-modal v-model="visible"  minimized @hide="handleModalClose"  :content-css="{width: '80vw'}" >
    <div  class="bg-dark round-borders q-pa-md">
      <div style="overflow: auto;">
        <q-btn round color="primary" class="float-right" @click="visible=false" icon="icon-plus" />
      </div>
      <div>
        <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md " :float-label="$t('profile.profile_picture_url')" placeholder="http://example.site/mypic.jpg" />
      </div>
    </div>
  </q-modal>

</q-page>
</template>



<script>
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
import {
  openURL
} from 'quasar'
import {
  mapGetters
} from 'vuex'
export default {
  components:{

  },
  data () {
    return {
      account_name:'',
      dev_profile_url: '',
      ipfslink:'',
      is_edit:false,
      allow_edit: false,
  

      visible:false,
      centerimage:true,
      setwidth: true,
      loaded:false,
      isuploading: false,
      form:{
          "givenName": "unknown",
          "familyName": "unknown",
          "gender": "other",
          "description": "no bio available",
          "email": "",
          "url": "http://google.com",
          "image": "",
          "sameAs": [{link:'https://www.twitter.com/neonexchange'},{link:'https://www.facebook.com/DonaldTrump/'}, {link: 'https://plus.google.com/+LukeStokes'}, {link:'https://steemit.com/@suesa'} ],
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
    openURL,
     onLoaded() {
        let img = this.$refs.profile_pic;
        this.$consoleMsg('Profile image size: '+img.width +' x '+ img.height);
        this.setwidth = img.width <= img.height ? true : false;
        this.centerimage = img.width == img.height ? false : true;
        this.visible = false;
        this.loaded = true;
    },
    //init profile page
    initProfile(){
      this.account_name = this.$route.params.accountname;
      this.allow_edit = this.account_name === this.getAccountName ? true : false;
      //load profile

    },

    parseSocialLinks(){
      //supported social networks
      const icons = ['social-youtube-com', 'social-linkedin-com', 'social-ask-fm', 'social-tumblr-com', 
                    'social-weibo-com', 'social-qzoneqq-com', 'social-flickr-com', 'social-instagram-com',
                    'social-facebook-com', 'social-plusgoogle-com', 'social-meetup-com', 'social-ok-ru',
                    'social-reddit-com', 'social-twitter-com', 'social-vk-com', 'social-pinterest-com',
                    'social-behance-net', 'social-dribble-com', 'social-github-com', 'social-medium-com',
                    'social-steemit-com', 'social-general'];
      
      let lookup = icons.map(icon=> { return icon.split('-')[1] } );

      let links = JSON.parse(JSON.stringify(this.form.sameAs));
      links.forEach((obj, index) => {
        
        
        let urlparts = new URL(obj.link);//does not work in IE
        let hostparts = urlparts.hostname.split('.');

        if(hostparts[0] ==='www'){
          delete hostparts[0];
        }
        hostparts.pop();//remove TLD
        let host = hostparts.join('');
        let i = lookup.indexOf(host);
        if(i > -1){
          links[index]['icon'] = icons[i];
        }
        else{
          links[index]['icon'] = 'social-general'
        }
      });
      return links;
    },

    addSocial(){

      this.deleteEmptyLinks();
      this.form.sameAs.push({link:''});
    },

    deleteEmptyLinks(){
      if(this.form.sameAs.length > 1 ){
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
      this.initProfile();
  },
  watch: {
  '$route': function(){
              this.initProfile();
            }
  },

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
