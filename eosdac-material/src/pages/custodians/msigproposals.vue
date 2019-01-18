<template>
<q-page class="text-white q-pa-md">
  <pre>{{pagination}}</pre>
  <div class="row relative-position justify-between">
    <h4 class="q-display-1 q-mt-none q-mb-md">Review Msig Transactions</h4>
    <span><q-btn color="primary" label="create new"  @click="createmsig_modal = true" /></span>
  </div>
  <q-tabs class="q-mb-md" @select="setActiveTab">
    <!-- Tabs - notice slot="title" -->
    <q-tab default slot="title" name="open" label="open" />
    <q-tab slot="title" name="executed" label="executed"  />
    <q-tab slot="title" name="cancelled" label="cancelled"  />
  </q-tabs>

  <div class="row bg-dark2 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="true" >
    <q-search dark color="primary" v-model="filter" :placeholder="$t('vote_custodians.search')" />
    <div class="row inline items-center" style="font-size:12px;">
      <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
        <q-select
          class="q-ml-sm"
          style="width:45px;"
          hide-underline
          v-model="pagination.items_per_page"
          dark
          :options="[{label:'1', value:1},{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
        />
        <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
    </div>
  </div>

  <div style="min-height:200px">
    <Msigproposal v-for="(msig, index) in proposals" :key="index" :msig="msig" />
  </div>
  
  <div class="row">
    <q-btn color="primary" label="create new" @click="createmsig_modal = true" />
  </div>
 

  <q-modal maximized v-model="createmsig_modal" >
    <div class="bg-dark">
      <!-- header -->
      <div style="height:50px" class="bg-dark2 row items-center justify-between q-px-md">
        <span>Create Msig Proposal</span>
        <q-icon class=" cursor-pointer" name="icon-ui-8" @click.native="createmsig_modal = false" />
      </div>
      <!-- content -->
      <div class="q-mb-lg"><MsigCreator /></div>
    </div> 
  </q-modal>


  <Transaction ref="Transaction"  />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import MsigCreator from 'components/msigcreator'
import Msigproposal from 'components/msig-proposal'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'MsigProposals',
  components: {
      Transaction,
      MsigCreator,
      Msigproposal
  },

  data() {
    return {
      systemmsig: 'eosiomsigold',
      proposals: [],
      createmsig_modal: false,
      active_tab : '',
      pagination :{
        page:1,
        max:1,
        items_per_page: 8
      },
      filter: '',
    }
  },

  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
    })

  },

  created(){
    this.$root.$on("reloadproposals", this.getProposalsWithDelay);
  },

  methods:{
    setActiveTab(tab){
      //setting the active tab will trigger a watcher
      this.active_tab = tab;
    },

    managePagination(){
      //map tab to number for making the request 
      const map = {open:1, executed:2, cancelled:0};
      //calculate skip
      let skip = (this.pagination.page-1) * this.pagination.items_per_page;
      //make request
      this.getProposals({find:{ status: map[this.active_tab] }, skip: skip, limit: this.pagination.items_per_page});
    },

    async getProposals(query){
      //todo: loading animation
      this.proposals = [];
      let p =  await this.$store.dispatch('api/getMsigProposals', query );
      this.pagination.max = Math.ceil(p.total/this.pagination.items_per_page);
      this.proposals = p.data;
    },

    getProposalsWithDelay(){
      console.log('executed getproposalswithdelay')
      // setTimeout(this.getProposals, 6000)
    }


  },
  
  watch:{

      active_tab: function(newVal, oldVal){
        if(newVal !== oldVal){ //double check the tab has been changed

          if(this.pagination.page == 1){
            this.managePagination();
          }
          else{
            this.pagination.page = 1; //this will trigger the watcher below
          };

        }
      },

      'pagination.items_per_page': function (newVal, oldVal){
          this.managePagination();
      },

      'pagination.page': function(newVal, oldVal){
          this.managePagination();
      }
  }


}
</script>

<style>
.msigproposal_header{
  height:80px
}
</style>
