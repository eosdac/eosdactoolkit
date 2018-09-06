<template>
<q-page class="text-white q-pa-md">
  <div class="row justify-center q-mt-sm">
    <div class="col-lg-12 col-xl-auto shadow-5">
      <div class="bg-dark2 q-pa-md">
        <q-toggle class="float-right" color="p-light" v-model="white_constitution" left-label :label="$t('constitution.switch_contrast')" /></div>
      <div v-if="!isloading" class="q-pt-md round-borders  bg-dark2">
        <div v-bind:class="{ overwrite: !white_constitution }" class="markdown-body" v-html="constitution"></div>
      </div>
    </div>
  </div>
  <LoadingSpinner :visible="isloading" :text="$t('constitution.loading_constitution')" />
</q-page>
</template>

<style lang="stylus">
@import '~variables'

.overwrite {
  background: none !important;
  color: rgba(255,255,255,0.8) !important;
  // transition: all 0.1s linear;
}
.overwrite h1, .overwrite h2{
  color: #fff;
  // transition: all 0.1s linear;
}
.overwrite td, .overwrite th {
  background: $dark !important;
  // transition: all 0.1s linear;
}

</style>

<script>
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'

export default {
  components: {
    LoadingSpinner

  },
  data() {
    return {

      isloading: false,
      constitution: '',
      white_constitution: false

    }
  },


  methods: {

    async getConstitution() {
      let md = new MarkdownIt();
      this.isloading = true;
      try {
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
        let getCt = await this.loadConstitutionFromGithub(latestMemberTerms.terms);
        this.constitution = md.render(getCt);
        this.isloading = false;

      } catch (e) {
        console.log(e);
        this.isloading = false;
      }
    },

    async loadConstitutionFromGithub(url) {
      try {
        let constitution = await this.$axios.get(url)
        return constitution.data
      } catch (err) {
        throw err
      }
    }


  },

  mounted: function() {
    this.getConstitution();
  }

}
</script>
