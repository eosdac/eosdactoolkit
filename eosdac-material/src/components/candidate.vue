<template>
<div>
<pre>{{data}}</pre>
<q-btn class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="$emit('clickvotefor')" />
<img style="height:60px;width:60px;border-radius:50%;" class="q-mr-md" :src="image_profile" @click="getProfileData">


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

      if(this.data.bio.substring(0,4) != 'http' || this.data.profile !== undefined ){
          console.log('no profile link or already fetched')
          return false;
      }
      this.$axios.get(this.data.bio).then(r => {
        this.image_profile = r.data.image;
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

<style>
</style>
