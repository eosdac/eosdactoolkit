<template>
<q-page class="text-white q-pa-md">
  <div class="row justify-center">
    <div class="col-auto">
  <div v-if="!isloading" class="q-pt-md round-borders shadow-5 bg-dark2">
    <div class="markdown-body overwrite" v-html="constitution" />
    </div>
  </div>
  </div>
  <LoadingSpinner :visible="isloading" :text="$t('constitution.loading_constitution')" />
</q-page>
</template>

<style lang="stylus">
@import '~variables'

.overwrite{
  background: none !important;
  color: white !important;
}
tbody, td, th{
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
      constitution:''

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
