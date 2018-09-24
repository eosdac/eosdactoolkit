<template>
  <div class="q-mb-md bg-dark2 round-borders"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
    <q-collapsible  label="First"  icon-toggle header-class="candidate_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-btn v-if="!data.selected" class="q-mr-md float-left" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickvotefor')" />
            <q-btn v-else class="q-mr-md" icon="icon-ui-6" round color="positive" style="height:55px;width:55px;margin-top:0px;" @click="$emit('clickunvotefor')"/>
            <div class="center_background_image float-left"  style="width: 60px; height:60px" v-bind:style="{ 'background-image': 'url(' + image_profile + ')' }" ></div>
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <router-link class="q-headline" :to="{path: '/profile/' + data.candidate_name}" >
              <q-icon title="Nominated for next custodian board" style="margin-top:-5px" v-if="data.position < 13" name="star_border" color="yellow" />{{ data.candidate_name }}
            </router-link><br>
            <span><span class="text-dimwhite">votes:</span> {{data.total_votes/10000}}</span>
          </div>
        </q-item-main>
      </template>
      <div class="q-pt-sm q-pt-none" style="border-top:1px solid grey">
        <span>BIO</span>
        <div class="text-dimwhite q-body-1" style="overflow:hidden; white-space: pre-wrap;" v-if="data.profile !== undefined">{{data.profile.description}}</div>
        <SocialLinks class="q-mt-md" :links="sociallinks" />
      </div>
    </q-collapsible>
  </div>
</template>

<script>
import SocialLinks from 'components/social-links'

export default {
  name: 'Candidate',
  components: {
    SocialLinks
  },

  props: {
    data: Object,
  },

  data () {
    return {
      image_profile:'../statics/img/default-avatar.png',
      sociallinks : []
    }
  },
  
  methods: {

    setProfileData(){
      
      if(this.data.profile !== undefined){
        // console.log(this.data.candidate_name)
        this.image_profile = this.data.profile.image;
        this.sociallinks = this.data.profile.sameAs.map(x => x.link);
      }
    }

  },

  // watch: {
  //   data: {
  //     // immediate: true,
  //     deep: true,
  //     handler(newValue, oldValue) {
  //       this.image_profile = newValue.profile.image;
  //       this.sociallinks = newValue.profile.sameAs.map(x => x.link);
  //     }
  //   }
  // },

  mounted:function(){
    this.setProfileData()
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
