<template>
<q-page class="text-white q-pa-md">





  <Transaction ref="Transaction" v-on:done="" />
  <div class="row">
    <div class="col-sm-12 col-md-8">
      <div class="row gutter-md">
        <div class="col-xs-12">
          <h4 class="q-display-1 q-mt-none q-mb-md">Candidate List</h4>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam libero urna, efficitur at laoreet fermentum, facilisis in ex. Proin luctus erat sem, ut mollis dui laoreet id. Curabitur eleifend ante in lacus rutrum dapibus. Nulla sit amet maximus metus, ac interdum dui. Aliquam placerat nisl eu bibendum dictum. Integer pharetra diam pretium felis venenatis, in aliquam ex imperdiet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

        </div>
        <div class="col-xs-12 q-mb-md">
          <div v-for="(candidate, index) in paginate" :key="candidate.candidate_name">
            <Candidate :data="candidate" @profile ="addProfile" @clickvotefor="addToVoteList(candidate.candidate_name)"  /> 
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
          <q-pagination
          v-show="pagination.max > 1"
  v-model="pagination.page"
  :min="1"
  :max="pagination.max"
/>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-4 q-pl-md">
      <h4 class="q-display-1 q-mt-none q-mb-md">My Votes - 0</h4>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam libero urna, efficitur at laoreet fermentum, facilisis in ex. Proin luctus erat sem, ut mollis dui laoreet id.
      <q-card class="q-pa-lg q-mt-md" style="background:#32363F;">
        <q-btn style="font-weight: 300;" class="full-width items-baseline" color="primary" size="xl">
          <div class="col-sm-3 col-md-12 col-lg-5 col-xl-4">
            <q-icon size="50px" class="float-left" name="icon-ui-3"></q-icon>
          </div>
          <div class="col-sm-9 col-md-12 col-lg-7 col-xl-8 text-left" @click="voteForCandidates">
            Submit my Votes
          </div>
        </q-btn>
        <q-list class="q-mt-md">

<transition-group name="list" tag="p">
          <q-item class="bg-dark2" style="height:66px;margin-bottom:1px;" v-for="(cand, i) in getSelectedCand" :key="i">
            <q-item-side>
              <q-item-tile style="height:36px;width:36px;" class="q-mr-sm">
                <img style="height:36px;width:36px;border-radius:50%;" class="q-mr-md responsive" src="https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg">
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <h6 class="q-ma-none">{{cand.candidate_name}}</h6>
            </q-item-main>
            <q-item-side right>
              <q-btn dense round color="primary" icon="icon-ui-8" @click="deleteFromVoteList(cand.candidate_name)" />
            </q-item-side>
          </q-item>
</transition-group>


        </q-list>
        <pre>{{getSelectedCand}}</pre>
      </q-card>

    </div>
  </div>
  </div>
</q-page>
</template>

<script>
import Candidate from 'components/candidate'
import Transaction from 'components/transaction'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Custodians',
  components: {
    Transaction,
    Candidate
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      custodians: [],
      candidateIndex: -1,
      page_content:[],
      pagination :{
        page:1,
        max:1,
        items_per_page: 2
      }
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
    }),
    getSelectedCand(){
      let selected = this.custodians.filter(x => x.selected == true);
      return selected;
    },
    paginate(){

      return this.custodians.slice((this.pagination.page-1) * this.pagination.items_per_page, this.pagination.page * this.pagination.items_per_page);

      // return this.custodians.slice(0,1)
    }
  },

  created() {
    // this.getCustodians()
    this.getAllCandidates()
  },
  mounted(){



  },

  methods: {
    toggleBio(index) {
      if (index === this.candidateIndex) {
        this.candidateIndex = -1
      } else {
        this.candidateIndex = index
      }
    },
    async getAllCandidates(){
      let lb='';
      let temp = [];

      while(lb !== null){
        let c = await this.$store.dispatch('api/getCustodians', {lb: lb});
        if(c){

            if(lb === c[c.length-1].candidate_name){
              //if last received is same as start last requested
              // end loop!
              lb = null;
            }
            else{
              if(lb != ''){
                //remove first entry except for the first run
                c.shift(); 
              }
              //set lower_bound to the last received candidate_name
              lb = c[c.length-1].candidate_name; 
              temp.push(...c);
            }
        }
      }
      //sort by votes desc + add selected boolean to all candidates
      //this is less expensive compared to looping through it again.
      temp = temp.sort(function(a, b) {
          if(a.selected == undefined){
            a.selected = false;
          }
          if(b.selected == undefined){
            b.selected = false;
          }
          let t = b.total_votes - a.total_votes;
          return t;
      });
      //add selected key to all custodians
      // temp = temp.map(c => {
      //   c.selected = false;
      //   return c;
      // })
      console.log(temp)
      this.pagination.max = Math.ceil(temp.length/this.pagination.items_per_page);
      this.custodians = temp;
    },

    async getCustodians(lb='') {
      let custodians = await this.$store.dispatch('api/getCustodians', {lb: lb})
      console.log(custodians)
      this.custodians = custodians
    },
    addToVoteList(name){
      this.custodians.find(x => x.candidate_name === name).selected =true;
    },
    deleteFromVoteList(name){
      this.custodians.find(x => x.candidate_name === name).selected =false;
    },

    voteForCandidates() {
      let votes = this.custodians.filter(x => x.selected == true).map(c => c.candidate_name);
      if(!votes.length){
        console.log('Votelist can\'t be empty');
        return false;
      }
      this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name, 'votecust', {
        voter: this.getAccountName,
        newvotes: votes
      }, false, false)
    },
    addProfile(eventdata){
      this.custodians.find(x => x.candidate_name === eventdata.candidate_name).profile =eventdata.profile;
    }

  }
}
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
