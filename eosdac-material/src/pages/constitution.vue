<template>
<q-page class="text-white q-pa-md">
  <q-toggle  v-model="white_constitution" label="" />
  <div class="row justify-center q-mt-sm">
    <div class="col-auto">
      <div v-if="!isloading" class="q-pt-md round-borders shadow-5 bg-dark2">
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
}
.overwrite h1, .overwrite h2{
  color: #fff;
}
.overwrite td, .overwrite th {
  background: $dark !important;
}


</style>

<script>
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'

export default {
  components:{
    LoadingSpinner

  },
  data () {
    return {

      isloading:false,
      constitution:'',
      white_constitution: false

    }
  },


  methods:{

    async getConstitution(){
      let md = new MarkdownIt();
      this.isloading = true;
      try{
          let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
          let getCt = await this.loadConstitutionFromGithub(latestMemberTerms.terms);
          this.constitution = md.render(getCt);
          this.isloading = false;

      }catch(e){
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

  mounted: function(){
    this.getConstitution();
   }

}
</script>
