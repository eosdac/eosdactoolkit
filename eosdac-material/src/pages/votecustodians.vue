<template>
<q-page class="text-white">
<Transaction ref="Transaction" v-on:done="getMemberVotes(); $refs.votebar.initProgressbar();" />

  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px; overflow:hidden">
    <div class="row">
      <div class="col-12">
        <q-btn v-if="!getMemberRoles.candidate" class="float-right" color="dark" to="/managecandidateship" :label="$t('vote_custodians.candidate_registration')" />
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("default.custodians") }}</h4>
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="column  justify-center q-px-md full-height">
        <VotingProgress height="30px" ref="votebar"/>
      </div>
    </div>
  </div>

<div class="q-pa-md"> <!-- padding wrapper -->
<div class="row gutter-md reverse-wrap">
  <!-- first column  -->
  <div class="col-xs-12 col-xl-8" >
     <!-- <pre>{{getSelectedCand}}</pre> -->
    <div >
      <div class="q-display-1 q-mb-md ">{{ $t('vote_custodians.candidate_list') }} <span class="text-dimwhite">- {{custodians.length}}</span></div>
      <p class="text-dimwhite q-body-1">{{ $t('vote_custodians.description_main') }}</p>
      <div  class="row bg-dark2 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="!loading" >
        <q-search dark color="p-light"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div class="row inline items-center" style="font-size:12px;">
          <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
           <q-select
              class="q-ml-md"
              style="width:45px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
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
        @clickunvotefor="deleteFromVoteList(candidate.candidate_name)"
      />
 
      <div class="row bg-dark2 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="!loading" >
        <q-search dark color="primary"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div class="row inline items-center" style="font-size:12px;">
          <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
           <q-select
              class="q-ml-md"
              style="width:45px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
            />
            <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
        </div>
      </div>
    </div>
  </div>
  <!-- second column -->
  <div class="col-xs-12 col-xl-4" >
    <div>
      <div class="q-display-1 q-mb-md">{{ $t('vote_custodians.my_votes') }} <span class="text-dimwhite">- {{getSelectedCand.length}}/{{maxvotes}}</span></div>
      <p class="text-dimwhite q-body-1">{{ $t('vote_custodians.description_side') }}</p>
      <q-card id="votebox" class="q-pa-lg q-mt-md" style="">
        <q-btn style="font-weight: 300;" v-bind:class="{'pulse': votesdidchange}" class="full-width items-baseline" color="primary" size="xl" @click="voteForCandidates();">
          <div style="width:55px;display:inlineblock">
            <q-icon size="40px" class="float-left" name="icon-ui-3"></q-icon>
          </div>
          <div style="display:inline-block" >
            <span v-if="votesdidchange">{{ $t('vote_custodians.submit_my_votes') }}</span>
            <span v-if="!votesdidchange">{{ $t('vote_custodians.my_votes') }}</span>
          </div>
        </q-btn>
        <q-list class="q-mt-md">
          <transition-group name="list" tag="p">
            <q-item class="bg-dark2" style="height:66px;margin-bottom:1px;" v-for="(cand, i) in getSelectedCand" :key="i">
              <q-item-side>
                <q-item-tile style="height:36px;width:36px;" class="q-mr-sm">
                  <div v-if="cand.profile != undefined && $helper.isUrl(cand.profile.image)" class="center_background_image" style="width: 36px; height:36px" v-bind:style="{ 'background-image': 'url(' + cand.profile.image + ')' }"></div>
                  <div v-else class="center_background_image" style="width: 36px; height:36px" v-bind:style="{ 'background-image': 'url(../statics/img/default-avatar.png)' }"></div>
                  <!-- <img v-if="!cand.profile" style="height:36px;width:36px;border-radius:50%;" class="q-mr-md responsive" src="https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg">
                  <img v-if="cand.profile" style="height:36px;width:36px;border-radius:50%;" class="q-mr-md responsive" :src="cand.profile.image"> -->
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <router-link class="q-headline a2" :to="{path: '/profile/' + cand.candidate_name}" >
                  <h6 class="q-ma-none">{{cand.candidate_name}}</h6>
                </router-link>
              </q-item-main>
              <q-item-side right>
                <q-btn dense round color="primary" icon="icon-ui-8" @click="deleteFromVoteList(cand.candidate_name)" />
              </q-item-side>
            </q-item>
          </transition-group>
        </q-list>
        <!-- <pre>{{getSelectedCand}}</pre> -->
        
        <!-- <pre>{{getTokenBalance}}</pre> -->
        <!-- <pre>{{votesdidchange}}</pre> -->
      </q-card>
    </div>
  </div>
</div><!-- end row -->
<LoadingSpinner :visible="loading" :text="$t('vote_custodians.loading_candidates')" />
<q-scroll-observable @scroll="userHasScrolled" />
</div><!-- end wrapper -->
</q-page>
</template>

<script>
	function offset(el) {
	    var rect = el.getBoundingClientRect(),
	    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}



import Candidate from 'components/candidate'
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import VotingProgress from 'components/voting-progress'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Votecustodians',
  components: {
    Transaction,
    Candidate,
    LoadingSpinner,
    VotingProgress
  },
  data() {
    return {
      loading: false,
      voting_progress: 14,
      custodians: [],
      contractstate: [],
      pagination :{
        page:1,
        max:1,
        items_per_page: 24
      },
      filter : '',
      maxvotes : 5,
      oldvotes : [],
      votesdidchange : false
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getTokenBalance: 'account/getTokenBalance',
      getMemberRoles: 'account/getMemberRoles'
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
      this.pagination.max = Math.ceil(filtered.length/this.pagination.items_per_page);

      filtered = filtered.slice((this.pagination.page-1) * this.pagination.items_per_page, this.pagination.page * this.pagination.items_per_page);

      // let candidates_on_page = filtered.map(c => c.candidate_name);
      // this.addProfiles(filtered, candidates_on_page); 

      return filtered;
    }

  },
  // watch:{
  //   async paginate(val){
  //     let candidates_on_page = val.map(c => c.candidate_name);
  //     await this.addProfiles(this.custodians, candidates_on_page);
  //   }

  // },

  mounted() {
    
    this.getAllCandidates();
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
        else{
          lb = null;
        }
      }
      //filter only active candidates
      temp = temp.filter(c => c.is_active == true);

      if(!temp.length){
        this.loading = false;
        return false;
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
      temp = temp.map( (c, index) => { c.position = index+1; return c} );

      let candidates_names = temp.map(c => c.candidate_name);
      await this.addProfiles(temp, candidates_names); 
      
      this.custodians = temp;
      await this.getMemberVotes();
      // await setContractState();

      this.loading = false;
    },

    // async setContractState(){
    //   let state = await this.$store.dispatch('api/getContractState', {contract: this.$configFile.network.custodianContract.name});
    //   console.log(state)
    //   if(state){
    //     this.contractstate = state;
    //   }
      
    // },

    addToVoteList(name, init=false){
      let selected = this.custodians.filter(x => x.selected == true);
      if(selected.length < 5){//todo get this var out of contract config
        let cand = this.custodians.find(x => x.candidate_name === name);
        if(cand){
          cand.selected = true;
          if(!init){
            cand.total_votes = (cand.total_votes*1)+(this.getTokenBalance*10000);
          }
        }
        this.checkVotesChanged();
      }
      else{
        console.log('reached max number of votes.')
      }
    },

    deleteFromVoteList(name){
      let cand = this.custodians.find(x => x.candidate_name === name);
      cand.selected =false;
      cand.total_votes = (cand.total_votes*1)-(this.getTokenBalance*10000);
      this.checkVotesChanged();
    },

    //cast votes
    voteForCandidates() {
      //only when votes changed
      if(!this.votesdidchange){
        return false;
      }

      let votes = this.custodians.filter(x => x.selected == true).map(c => c.candidate_name);
      this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name, 'votecust', {
        voter: this.getAccountName,
        newvotes: votes
      }, false)
    },

    //add profile data to candidate
    addProfile(eventdata){
      // let cand = this.custodians.find(x => x.candidate_name === eventdata.candidate_name);
      // if(cand.profile === undefined){
      //   cand.profile =eventdata.profile;
      // }
    },

    async addProfiles(to, candlist){
      if(!Array.isArray(candlist) ){
        console.log('This method needs an array of candidate names');
        return false;
      }
      let p = await this.$store.dispatch('api/getProfileData2', {accountname: candlist} );
      
      if(p.length){
        p.forEach(pdb =>{
          let cand = to.find(x => x.candidate_name === pdb._id);
          if(cand.profile === undefined){
            cand.profile =pdb.profile;
          }
        })
      }
      else{
        console.log('Unable to fetch profiles')
        
      }

    },

    checkVotesChanged(){
      let newvotes = this.custodians.filter(x => x.selected == true);

      if(newvotes.length != this.oldvotes.length){
        this.votesdidchange = true;
      }
      else if(newvotes.every(v => this.oldvotes.includes(v.candidate_name)) ){
        this.votesdidchange =  false;
      }
      else{
        this.votesdidchange =  true;
      }
    },

    //get current votes from member from chain
    async getMemberVotes(){
      let votes = await this.$store.dispatch('api/getMemberVotes', {member: this.getAccountName});
      if(votes){
        this.votesdidchange = false;
        this.oldvotes = votes[0].candidates;
        this.oldvotes.forEach((vote) =>{
          this.addToVoteList(vote,true);
        })
      }
      else{
        this.oldvotes = [];
        this.votesdidchange = false;
        console.log(`${this.getAccountName} has not voted.`);
      }
    },

    userHasScrolled(scroll){
      const votebox = document.getElementById('votebox');
      if(scroll.position < 477 || window.innerWidth < 1200){
        votebox.style.top = '0px';
        return false;
      }
      // console.log(`votebox: ${offset(votebox).top} scroll: ${scroll.position}`);
      votebox.style.top = (scroll.position-375)+'px';
    }

  }
}
</script>

<style lang="stylus">
@import '~variables'

.gradient-bg-primary{
  background-image linear-gradient(to right, $primary, $p-light);
}
.blur-details{
  background rgba(255, 255, 255, 0.1);
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}

.list-enter, .list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}

.pulse{
  background-color:$p-light !important;
  transition: background-color 1000ms linear;
  -webkit-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  -ms-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

#votebox{
  background:#32363F;
  position:relative;
  transition: all 1s ease 0s;
  top: 0;
}

</style>
