<template>

<div class="q-mb-md bg-dark2 round-borders"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
  <q-collapsible  label="First"  icon-toggle header-class="candidate_header" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <div class="row">
          <q-btn v-if="!data.selected" class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickvotefor')" />
          <q-btn v-else class="q-mr-md" icon="icon-ui-6" round color="positive" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickunvotefor')"/>
          <q-item-tile avatar style="margin-top:-2px;">
            <img style="height:60px;width:60px;" class="q-mr-md" :src="image_profile" @click="getProfileData" :name="data.candidate_name+'_pic'">
          </q-item-tile>
          <!-- <q-item-tile style="margin-top:-2px">
            <ProfilePic :url="image_profile" size= "60px" />
          </q-item-tile> -->
        </div>
      </q-item-side>
      <q-item-main >
        <div class="q-ml-lg">
          <router-link class="q-headline" :to="{path: '/profile/' + data.candidate_name}" >
            <q-icon title="Nominated for next custodian board" style="margin-top:-5px" v-if="data.position < 13" name="star_border" color="yellow" />{{ data.candidate_name }}
          </router-link><br>
          <span><span class="text-dimwhite">votes:</span> {{data.total_votes}}</span>
        </div>
      </q-item-main>
    </template>
    <div class="q-pt-sm q-pt-none" style="border-top:1px solid grey">
      <span>BIO</span>
      <div class="text-dimwhite" v-if="data.profile !== undefined">{{data.profile.description}}</div>
    </div>
  </q-collapsible>
</div>

</template>

<script>
import ProfilePic from 'components/profile-pic'

export default {
  name: 'Candidate',
  components: {
    ProfilePic
  },

  props: {
    data: Object,
  },

  data () {
    return {
      image_profile:'https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg',
    }
  },
  
  methods: {
    getProfileData2(){
      if(this.data.profile !== undefined){
        if(this.isUrl(this.data.profile.image)){
          this.image_profile = this.data.profile.image;
        }
        console.log('profile already fetched');
        return false;
      }

      if(!this.isUrl(this.data.bio) ){
          console.log('no profile available');
          return false;
      }
      this.$axios.get(this.data.bio).then(r => {
        if( this.isUrl(r.data.image) ) {
          this.image_profile = r.data.image;
        }
        //emit profile event to parent component/page
        this.$emit('profile', {candidate_name:this.data.candidate_name, profile: r.data});
      })
      .catch(e => console.log('could not load profile file from '+this.data.candidate_name))
    },
    async getProfileData(){
      
      if(this.data.profile === undefined){
        // console.log(this.data.candidate_name)
        let p = await this.$store.dispatch('api/getProfileData2', {accountname: [this.data.candidate_name] } );
        // console.log(p);
        if(p && p.length){
          if( this.isUrl(p[0].profile.image) ) {
            // console.log(p[0].profile.image);
            this.image_profile = p[0].profile.image;
          }
          this.$emit('profile', {candidate_name:this.data.candidate_name, profile: p[0].profile});
        }
      }
      else{
        this.image_profile = this.data.profile.image;
      }
    },

    isUrl(url){
      const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      return re.test(url);
    }

  },

  mounted:function(){
    this.getProfileData()
  }

}
</script>

<style lang ="stylus">
@import '~variables'

.candidate_header{
  height:80px;
  border-radius:2px;
}

.selected_candidate{
  border:2px solid $positive;
  transition : border 400ms ease;
}

.unselected_candidate{
  border:2px solid transparent;
  transition : border 400ms ease;
}
</style>
