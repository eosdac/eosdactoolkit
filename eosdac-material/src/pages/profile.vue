<template>
<q-page padding>

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
        <q-input dark type="text" v-model="form.givenName"  class="q-mt-md" float-label="Name" placeholder="Jhon" />
        <q-input dark type="text" v-model="form.familyName"  class="q-mt-md" float-label="Family Name" placeholder="Jhon" />
      </div>

    </div> <!-- end row -->

    <q-input dark type="email" v-model="form.email"  class="q-mt-md" float-label="Email Address" placeholder="my.email@example.site" />

    <div class="q-mt-md" style="color:#979797;margin-bottom:3px">Gender</div>
    <q-radio dark v-model="form.gender" val="female" label="Female" class="q-mr-sm" />
    <q-radio dark v-model="form.gender" val="male" label="Male" class="q-mr-sm" />
    <q-radio dark v-model="form.gender" val="opt3" label="Other" />

    <q-input dark type="url" v-model="form.url"  class="" float-label="Website" placeholder="http://example.com" />
    <q-input dark type="textarea" v-model="form.description"  class="q-mt-md" float-label="About Me" placeholder="This is my short bio..." />

    <q-input dark type="url"
      class="q-mt-md q-mb-md"
      v-model="social.link"
      v-for="(social, i) in form.sameAs"
      :key = i
      :float-label="`Social Link ${i+1}`"
      @input="deleteEmptyLinks"
      placeholder="Social profile link"
    />
    <div class="relative-position" >
        <q-btn  color="primary" @click="addSocial" icon="icon-plus" />

        <q-btn class="absolute-right" :loading="isuploading" color="positive" @click="saveProfile" label="Save">
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
          <q-input dark type="url" v-model="form.image" @input="loaded=false" class="q-mt-md" float-label="Profile Picture Url" placeholder="http://example.site/mypic.jpg" />
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
    saveProfile(){
      this.ipfsAdd(this.form);
    },

    async ipfsAdd(data){
      var self =this;
      this.isuploading = true;
      console.log('Upload to ipfs started!')
      if(data !== null && typeof data === 'object'){
          data = JSON.stringify(data);
      }
      const buffer = await Buffer.from(data);
      ipfs.add(buffer, function(err, hash) {
        if (err) {
          //retry with different node...
          self.isuploading = false;
          throw err;
        }
        self.isuploading = false;
        self.ipfslink='https://ipfs.io/ipfs/'+hash[0].hash;
        console.log(hash);
      });

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
