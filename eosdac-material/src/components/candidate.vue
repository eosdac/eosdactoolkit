<template>
  <div class="q-mb-md bg-dark2 round-borders"  v-bind:class="{ 'selected_candidate': data.selected, 'unselected_candidate':!data.selected, 'shadow-5':!data.selected}">
    <q-collapsible  label="First" group="candidates" icon-toggle header-class="candidate_header" collapse-icon="icon-ui-11">
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
        <q-scroll-area
          style="width: 100%; height: 300px;"
          :thumb-style="{
            right: '-13px',
            borderRadius: '2px',
            background: '#7c41ba',
            width: '10px',
            opacity: 0.8
          }"
        >
        <div class="q-my-md">BIO</div>
        <!--<div class="text-dimwhite q-body-1" style="overflow:hidden; white-space: pre-wrap;" v-if="data.profile !== undefined">{{data.profile.description}}</div>-->
        <MarkdownViewer v-if="data.profile !== undefined" :tags="['h1', 'h2', 'h3', 'italic', 'bold', 'underline', 'strikethrough', 'subscript',
          'superscript', 'anchor', 'orderedlist', 'unorderedlist']" class="bg-dark2" dark :text="data.profile.description" />
        </q-scroll-area>
        <div class="row justify-between items-center full-height q-pb-sm">
          <div class="q-mb-md" style="border-bottom:1px solid grey; width:100%;height:5px"></div>
          <SocialLinks :links="sociallinks" />
          <a target="_blank" :href="website" class="a2" >{{website}}</a>
        </div>
      </div>
    </q-collapsible>
  </div>
</template>

<script>
import SocialLinks from 'components/social-links'
import MarkdownViewer from 'components/markdown-viewer'
export default {
  name: 'Candidate',
  components: {
    SocialLinks,
    MarkdownViewer
  },

  props: {
    data: Object,
  },

  data () {
    return {
      image_profile:'../statics/img/default-avatar.png',
      sociallinks : [],
      website : false
    }
  },

  methods: {

    setProfileData(){

      if(this.data.profile !== undefined){
        // console.log(this.data.candidate_name)
        this.image_profile = this.$helper.isUrl(this.data.profile.image) ? this.data.profile.image : this.image_profile;
        this.sociallinks = this.data.profile.sameAs.map(x => x.link);
        this.website = this.data.profile.url
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
