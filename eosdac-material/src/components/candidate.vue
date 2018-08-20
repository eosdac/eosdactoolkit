<template>
<div>

<q-item class="bg-dark2 q-px-lg cursor-pointer q-mb-md shadow-5 round-borders" v-bind:class="{ selected_candidate: data.selected }" style="height:80px;">
  <q-item-side>
    <div class="row">
      <q-btn class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="$emit('clickvotefor')" />
      <img style="height:60px;width:60px;border-radius:50%;" class="q-mr-md" :src="image_profile" @click="getProfileData">
    </div>
  </q-item-side>
  <q-item-main @click.native="">
    {{data.candidate_name}}
  </q-item-main>

</q-item>




<!--             <q-item class="bg-dark2 q-px-lg cursor-pointer" style="height:80px;">
              <q-item-side>
                <q-item-tile>
                  <div class="row">
                    <q-btn class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="addToVoteList(index)" />
                    <img style="height:60px;width:60px;border-radius:50%;" class="q-mr-md" src="https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg">
                  </div>
                </q-item-tile>
              </q-item-side>
              <q-item-main @click.native="toggleBio(index)">
                <div class="row">
                  <div class="col-xs-4">
                    <h5 style="line-height:18px;" class="q-ma-none"><b>{{candidate.candidate_name}}</b></h5>
                    <h6 class="q-ma-none"><b>{{candidate.total_votes}}</b> Votes</h6>
                  </div>
                  <div class="col-xs-8">
                    <span class="text-grey">Current status: </span><span class="text-positive">ELECTED</span><br>
                    <span class="text-grey">Role: </span>
                  </div>
                </div>
              </q-item-main>
              <q-item-side right>
                <q-item-tile @click.native="toggleBio(index)" :icon="(candidateIndex !== index)? 'icon-ui-1': 'icon-ui-11'" color="white" />
                <span v-if="candidate.selected">test selected</span>
              </q-item-side>
            </q-item>
            <q-slide-transition>
              <div v-show="candidateIndex === index">
              <q-card class="bg-dark2 q-px-lg q-mb-lg" style="min-height:80px;">
                <q-card  v-show="candidateIndex === index" class="q-py-md q-mb-lg no-shadow" style="min-height:80px; border-top:1px solid grey;">
                  BIO
                  sdsdsdsdsdsdsd
                </q-card>
              </q-card>
            </div>
            </q-slide-transition> -->


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

<style lang ="stylus">
@import '~variables'

.selected_candidate{
  border:2px solid $positive;
  transition : border 400ms ease;
}
</style>
