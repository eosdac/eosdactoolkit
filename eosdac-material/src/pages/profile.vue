<template>
<q-page class="q-pa-md">

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

    </div> <!-- end row -->

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
      :float-label="$t('social_link') + '`${i+1}`'"
      @input="deleteEmptyLinks"
      :placeholder="$t('social_profile_link')"
    />
    <div class="relative-position" >
        <q-btn  color="primary" @click="addSocial" icon="icon-plus" />

        <q-btn class="absolute-right" :loading="isuploading" color="positive" @click="saveProfile" :label="$t('save')">
            <q-spinner slot="loading" />
        </q-btn>


    </div>
    <!-- debug -->
    <div v-if="ipfslink!='' "><a target="_blank" :href="ipfslink">{{ipfslink}}</a></div>
    <pre v-if="debug_view">{{ form }}</pre>
    <!-- debug -->

<!--     profile pic modal -->
    <q-modal v-model="visible"  minimized :content-css="{width: '80vw'}" >
        <div style="padding: 20px; border:1px solid #491289" class="bg-dark round-borders">
          <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md" :float-label="$t('profile_picture_url')" placeholder="http://example.site/mypic.jpg" />
          <q-btn round color="primary" class="absolute" style="top:5px;right:5px" @click="visible=false" icon="icon-plus" />
        </div>
    </q-modal>

</div>

</q-page>
</template>

<style lang="stylus">
@import '~variables'

.wrapper{
  width: 120px;
  height: 120px;
  border: 3px solid $primary;
  box-sizing: border-box;
  position:relative;

}
.pic_wrapper {
  width: 100%;
  height: 100%;
  overflow:hidden;
  box-sizing: border-box;

}

.fade-enter-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
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

export default {
  components:{

  },
  data () {
    return {
      debug_view: false,
      ipfslink:'',

      visible:false,
      fitcontainer:'fitheight',
      loaded:false,
      isuploading: false,
      form:{
          "givenName": "",
          "familyName": "",
          "gender": "",
          "description": "",
          "email": "",
          "url": "",
          "image": "",
          "sameAs": [{link:''}],
          "timezone": new Date().getTimezoneOffset() //time-zone offset see: https://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
        }


    }
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
      const buffer = await Buffer.from(JSON.stringify(this.form)); //try catch
      let ipfshash = await this.ipfsAdd(buffer);
      this.isuploading = false;

      if(ipfshash[0].hash != undefined){
        this.ipfslink='https://ipfs.io/ipfs/'+ipfshash[0].hash;
      }
      else{
        console.log('error getting hash from ipfs');
      }

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

    ipfsAdd(buffer){
      console.log('Start upload to ipfs!');
      return ipfs.add(buffer).then(res => res).catch(e => {return false});
    },

    ipfsGet (hash) {
      ipfs.cat(hash, {buffer: false}).then(content => {
        console.log(content.toString() )
      })
      .catch(error => console.log(error) )
    }

  },

  mounted: function(){

   }

}
</script>
