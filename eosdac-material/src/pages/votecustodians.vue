<template>
<q-page class="text-white q-pa-md">
<Transaction ref="Transaction"/>

<div class="row gutter-md">
  <!-- first column  -->
  <div class="col-sm-12 col-md-8" >
    <div>
      <span class="q-display-1 q-mt-none ">{{ $t('vote_custodians.candidate_list') }} <span class="text-dimwhite">- {{custodians.length}}</span></span>
      <p class="text-dimwhite">{{ $t('vote_custodians.description_main') }}</p>

      <div class="row bg-dark2 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="!loading" >
        <q-search dark color="primary"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div class="row inline items-center" style="font-size:12px;">
          <span >Rows Per Page:</span>
           <q-select
              class="q-ml-md"
              style="width:40px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'2', value:2}, {label:'4', value:4}, {label:'6', value:6}, {label:'8', value:8}, {label:'10', value:10}]"
            />
            <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
        </div>
      </div>

      <Candidate 
        v-for="candidate in paginate" 
        :key="candidate.candidate_name" 
        :data="candidate" 
        @profile ="addProfile" 
        @clickvotefor="addToVoteList(candidate.candidate_name)"  
      /> 

      <div class="row bg-dark2 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="!loading" >
        <q-search dark color="primary"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div class="row inline items-center" style="font-size:12px;">
          <span >Rows Per Page:</span>
           <q-select
              class="q-ml-md"
              style="width:40px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'2', value:2}, {label:'4', value:4}, {label:'6', value:6}, {label:'8', value:8}, {label:'10', value:10}]"
            />
            <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
        </div>
      </div>


    </div>
  </div>
  <!-- second column -->
  <div class="col-sm-12 col-md-4" >
    <div>
      <span class="q-display-1">{{ $t('vote_custodians.my_votes') }} <span class="text-dimwhite">- {{getSelectedCand.length}}</span></span>
      <p class="text-dimwhite">{{ $t('vote_custodians.description_side') }}</p>
      <q-card class="q-pa-lg q-mt-md" style="background:#32363F;">
        <q-btn style="font-weight: 300;" class="full-width items-baseline" color="primary" size="xl" @click="voteForCandidates">
          <div style="width:55px;display:inlineblock">
            <q-icon size="50px" class="float-left" name="icon-ui-3"></q-icon>
          </div>
          <div style="display:inline-block" >
            {{ $t('vote_custodians.submit_my_votes') }}
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
        <!-- <pre>{{getSelectedCand}}</pre> -->
      </q-card>
    </div>
  </div>
</div><!-- end row -->
<LoadingSpinner :visible="loading" :text="$t('vote_custodians.loading_candidates')" />
</q-page>
</template>

<script>
import Candidate from 'components/candidate'
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Votecustodians',
  components: {
    Transaction,
    Candidate,
    LoadingSpinner
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      custodians: [],
      page_content:[],
      pagination :{
        page:1,
        max:1,
        items_per_page: 6
      },
      filter : ''
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
      let filtered;

      if(this.filter != ''){
        filtered = this.custodians.filter(cand => {
            return cand.candidate_name.indexOf(this.filter) !== -1;
        });
      }
      else{
        filtered = this.custodians;
      }
      this.pagination.max = Math.ceil(filtered.length/this.pagination.items_per_page)

      return filtered.slice((this.pagination.page-1) * this.pagination.items_per_page, this.pagination.page * this.pagination.items_per_page);
    }
  },

  created() {
    // this.getCustodians()
    this.getAllCandidates()
  },

  methods: {
    async getAllCandidates(){
      this.loading = true;
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
      this.custodians = temp;
      this.loading = false;
    },

    async getCustodians(lb='') {
      let custodians = await this.$store.dispatch('api/getCustodians', {lb: lb})
      console.log(custodians)
      this.custodians = custodians
    },

    addToVoteList(name){
      let selected = this.custodians.filter(x => x.selected == true);
      if(selected.length < 8){
        this.custodians.find(x => x.candidate_name === name).selected =true;
      }
      else{
        console.log('reached max number of votes.')
      }
      
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
      }, false)
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
