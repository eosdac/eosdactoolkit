<template>

<div class="q-mb-md bg-dark2 round-borders"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
  <q-collapsible  label="First"  icon-toggle header-class="candidate_header" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <div class="row">
          <q-btn v-if="!data.selected" class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="$emit('clickvotefor')" />
          <q-btn v-else class="q-mr-md" icon="icon-ui-6" round color="positive" style="height:55px;width:55px;margin-top:3px;" />
          <q-item-tile avatar>
            <img style="height:60px;width:60px;" class="q-mr-md" :src="image_profile" @click="getProfileData" :name="data.candidate_name+'_pic'">
          </q-item-tile>
        </div>
      </q-item-side>
      <q-item-main >
        <div class="q-ml-lg">{{data.candidate_name}}<br>xxxxxx</div>
      </q-item-main>
      <span style=""></span>
    </template>
    <div class="q-pt-sm" style="border-top:1px solid grey">
      <span>BIO</span>
      <div class="text-dimwhite" v-if="data.profile !== undefined">{{data.profile.description}}</div>
    </div>
  </q-collapsible>
</div>

</template>

<script>

export default {
  name: 'Candidate',
  props: {
    data: Object,

  },
  data () {
    return {
      image_profile:'https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg',
    }
  },
  methods: {
    getProfileData(){
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
        this.$emit('profile', {candidate_name:this.data.candidate_name, profile: r.data});
      })
      .catch(e => console.log('could not load profile file from'+this.data.candidate_name))
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
}
</style>
