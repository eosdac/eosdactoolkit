<template>


<!-- <q-item class="bg-dark2 q-px-lg cursor-pointer q-mb-md shadow-5 round-borders" v-bind:class="{ selected_candidate: data.selected }" style="height:80px;" >
  <q-item-side>
    <div class="row">
      <q-btn class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="$emit('clickvotefor')" />
      <q-item-tile avatar>
        <img style="height:60px;width:60px;" class="q-mr-md" :src="image_profile" @click="getProfileData" :name="data.candidate_name+'_pic'">
      </q-item-tile>
    </div>
  </q-item-side>
  <q-item-main @click.native="">
    {{data.candidate_name}}
  </q-item-main>

</q-item> -->

<div class="q-mb-md round-borders" style="background:#2F333D; box-sizing:border-box;" v-bind:class="{ 'selected_candidate': data.selected, 'shadow-5':!data.selected}">
  <q-collapsible  label="First"  icon-toggle header-class="bg-dark2 candidate_header" collapse-icon="icon-ui-11">
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
    <div>
      <span>BIO</span>
      <div v-if="data.profile !== undefined">{{data.profile.description}}</div>
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
        if(this.data.profile.image.substring(0,4) == 'http'){
          this.image_profile = this.data.profile.image;
        }
        console.log('profile already fetched');
        return false;
      }

      if(this.data.bio.substring(0,4) != 'http' ){
          console.log('no profile available')
          return false;
      }
      this.$axios.get(this.data.bio).then(r => {
        if(r.data.image.substring(0,4) == 'http'){
          this.image_profile = r.data.image;
        }
        this.$emit('profile', {candidate_name:this.data.candidate_name, profile: r.data});
      })
      .catch(e => console.log('could not load profile file from'+this.data.candidate_name))
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
}
.selected_candidate{
  border:2px solid $positive;
  transition : border 400ms ease;
  
}
</style>
