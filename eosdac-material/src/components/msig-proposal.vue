<template>
<div v-if="!isCancelled" class="q-mb-md bg-dark2 round-borders shadow-5" v-bind:class="{ 'proposal_approved': !isApproved, 'proposal_unapproved':!isApproved,}" >
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11" @show="handleIsSeenCache(true)">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center relative-position">
            <q-chip  v-if="msig.trx.actions.length > 1" floating dense color="dark">{{msig.trx.actions.length}}</q-chip>
            <q-chip  v-if="!is_seen_computed" class="animate-fade" floating dense color="negative">new</q-chip>
            <q-icon size="48px" count="5" :name="'icon-'+matchIcon" class="q-mr-xs" :color="getStatusColor" />
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <div class="q-title q-mb-xs">{{msig.proposal_name}}: {{msig.title}}</div>
            <div class="q-caption">
              <span class="text-dimwhite">Submitted by: </span>
              <router-link :to="{path: '/profile/' + msig.proposer}" >
                {{ msig.proposer }}
              </router-link>
            </div>
          </div>
        </q-item-main>
        <q-item-side right>

          <div class="q-caption text-dimwhite" >Received Approvals:</div>
          <div class="text-white q-display-1">
            <q-spinner v-if="provided_approvals==null" color="primary" size="30px" style="margin-top:-4px" />
            <span v-if="provided_approvals" class="text-p-light cursor-pointer"  @click="approvals_modal = true">{{provided_approvals.length}}</span>
            <span class="">/{{msig.threshold}}</span>
          </div>
        </q-item-side>
      </template>

      <div class="q-px-md q-pb-md">
        <div style="border-top: 1px solid grey" >
          <div class="q-mt-md">Description</div>
          <div class="text-dimwhite q-mb-md">{{msig.description}}</div>
          <div class="q-mt-md">Expiration</div>
          <div class="text-dimwhite q-mb-md">{{new Date(msig.trx.expiration).toString()}}</div>
          <div class="q-mt-md">Actions <span class="text-dimwhite">({{msig.trx.actions.length}})</span></div>
          <div class="text-dimwhite q-mb-md">{{msig.trx.actions.map(a=>a.name).join(', ')}}</div>
          <div style="text-align:right">
            <span>trx: </span>
            <a target="_blank" :href="$configFile.external.mainCurrencyExplorerUrl+`/transaction/${msig.trxid}`" class="q-body-1">{{msig.trxid.substring(0, 8)}}</a>
          </div>
          <div class="bg-dark q-mb-md">
            
            <Actionparser @seenAllActions="disable_approve = false" :actions="msig.trx.actions" />

          </div>

          <div v-if="msig.status == 1" class="row justify-between">
            <span>
              <q-btn v-if="!isApproved" class="on-left" :disabled="disable_approve" color="positive" label="Approve" @click="approveProposal(msig.proposer, msig.proposal_name)"  />
              <q-btn v-if="isApproved" class="on-left" color="warning" label="Unapprove" @click="unapproveProposal(msig.proposer, msig.proposal_name)"  />
              <q-btn v-if="isCreator" class="on-left" color="red" label="cancel" @click="cancelProposal(msig.proposer, msig.proposal_name)" />
              <q-btn v-if="isExecutable" color="blue" label="execute" />
            </span>
            <span>
              <q-checkbox dark left-label :label="isSeen ?'Unmark as seen':'Mark as seen' " v-model="isSeen" @input="handleIsSeenCache" />
            </span>
          </div>

        </div>
      </div>
    </q-collapsible>

    <q-modal minimized v-model="approvals_modal" >
      <div class="bg-dark">
        <!-- header -->
        <div style="height:50px" class="bg-dark2 row items-center justify-between q-px-md">
          <span>Approvals <span v-if="provided_approvals" class="q-caption text-weight-thin">needs {{msig.threshold-provided_approvals.length}} more</span></span>
          <q-icon class=" cursor-pointer" name="icon-ui-8" @click.native="approvals_modal = false" />
        </div>
        <!-- content -->
        <div class="q-pa-md">
          <div class="row justify-start q-mt-sm">
            <!-- <pre>{{provided_approvals}}</pre> -->
            <q-chip class="animate-fade q-mb-sm on-left relative-position" color="dark2" v-for="(c,i) in provided_approvals" :avatar="c.avatar.image" :key="i+'p'">
              <q-icon class="absolute" style="top:-3px; right:-5px" color="positive" name="icon-ui-6" size="18px" />
              <router-link class=" a2" :to="{path: '/profile/' + c.actor}" >
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">{{c.actor}}</div>
              </router-link>
            </q-chip>
            <q-chip class="animate-fade q-mb-sm on-left relative-position" color="dark2" v-for="(c,i) in requested_approvals" :avatar="c.avatar.image" :key="i+'r'">
              <!-- <div class="center_background_image" style="border-radius:50%; width:50px;height:50px" v-bind:style="{ 'background-image': `url(${c.avatar.image})` }"></div> -->
              <router-link class=" a2" :to="{path: '/profile/' + c.actor}" >
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">{{c.actor}}</div>
              </router-link>
            </q-chip>
            <!-- <pre>{{getmsigIsSeenCache}}</pre> -->
          </div>
        </div>
      </div> 
    </q-modal>

    <Transaction ref="Transaction" v-on:done="transactionCallback($event)" />




  </div>
</template>

<script>
import Transaction from 'components/transaction'
import Actionparser from 'components/action-parser'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Msigproposal',
  components: {
    Transaction,
    Actionparser
  },

  props: {
    msig: Object,
  },

  data () {
    return {
      systemmsig: 'eosiomsigold',
      provided_approvals: null,
      requested_approvals: null,
      isApproved: false,
      isCreator: false,
      isCancelled: false,
      approvals_modal: false,

      isSeen: this.is_seen_computed,

      disable_approve: true

    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getmsigIsSeenCache: 'usersettings/getmsigIsSeenCache'
    }),

    isExecutable: function(){
      if(this.provided_approvals){
        return this.provided_approvals.length >= this.msig.threshold;
        // return this.provided_approvals.length > 0;
      }
      else{
        return false;
      }
    },

    parseActions: function(){
      if(this.msig){
        return this.msig.trx.actions
        // return this.provided_approvals.length > 0;
      }
      else{
        return false;
      }   
    },

    matchIcon: function(){
      const knownactions = ['updateconfig', 'transfer', 'newmemterms']
      let actions = this.msig.trx.actions.map(a=>a.name);
      if(actions.length > 1){
        return 'action-default';
      }
      else if(!knownactions.includes(actions[0]) ){
        return 'action-default';
      }
      else{
        return 'action-'+actions[0];
      }
    },

    getStatusColor: function(){
      let statuscolor='';
      if(this.msig.status === 1 && this.isApproved){
        statuscolor = 'positive';
      }
      if(this.msig.status === 0){
        statuscolor = 'negative';
      }
      if(this.isExecutable || this.msig.status === 2){
        statuscolor = 'info';
      }
      return statuscolor;
    },

    is_seen_computed: function(){
      return this.getmsigIsSeenCache.includes(this.msig._id);
    }


  },

  methods: {
    //get the requested and provided approvals for this msg proposal from chain
    async checkApprovals(){

      if(this.msig.status === 1){
        let approvals = await this.$store.dispatch('api/getApprovalsFromProposal', {proposer: this.msig.proposer, proposal_name: this.msig.proposal_name});
        let avatars = await this.$profiles.getAvatars([...approvals.provided_approvals.map(a=>a.actor), ...approvals.requested_approvals.map(a=>a.actor) ]);

        this.provided_approvals = approvals.provided_approvals.map(pa=>{
          pa.avatar = avatars.find(p=> p._id===pa.actor );
          // this.$set(pa, 'avatar', avatars.find(p=> p._id===pa.actor ))
          return pa;
        });
        
        this.requested_approvals = approvals.requested_approvals.map(ra=>{
          ra.avatar = avatars.find(p=>p._id===ra.actor);
          return ra;
        });
        //check if user has already approved the proposal
        this.isApproved = this.provided_approvals.find(a => a.actor == this.getAccountName) ? true : false;
        //check if the proposal is created by current user
        this.isCreator = this.getAccountName == this.msig.proposer
      }

    },

    //approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    approveProposal(proposer, proposal_name, permission="active"){
        let actions = [
        {
          contract: this.systemmsig, 
          action: 'approve', 
          fields: {
            proposer: proposer,
            proposal_name: proposal_name,
            level: { "actor": this.getAccountName, "permission": permission }
          }
          
        },
        {
          contract: 'dacmultisigs', 
          action: 'approved',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          fields: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            approver: this.getAccountName }
        }

      ];
        this.$refs.Transaction.newTransaction(actions, false, false, 'e_approval');
    },
  
    //unapprove a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    unapproveProposal(proposer, proposal_name, permission="active"){
        let actions = [
        {
          contract: this.systemmsig, 
          action: 'unapprove', 
          fields: {
            proposer: proposer,
            proposal_name: proposal_name,
            level: { "actor": this.getAccountName, "permission": permission }
          }
          
        },
        {
          contract: 'dacmultisigs', 
          action: 'unapproved',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          fields: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            unapprover: this.getAccountName }
        }

      ];
      this.$refs.Transaction.newTransaction(actions, false, false, 'e_unapproval');
    },
    //execute a proposal via msig relay {"proposer":0,"proposal_name":0,"executer":0}
    executeProposal(){

    },
    
    //cancel a proposal via msig relay {"proposer":0,"proposal_name":0,"canceler":0}
    cancelProposal(proposer, proposal_name){
        let actions = [
        {
          contract: this.systemmsig, 
          action: 'cancel', 
          fields: {
            proposer: proposer,
            proposal_name: proposal_name,
            canceler: this.getAccountName
          }
          
        },
        {
          contract: 'dacmultisigs', 
          action: 'cancelled',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          fields: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            canceler: this.getAccountName }
        }

      ];
      this.$refs.Transaction.newTransaction(actions, false, false, 'e_cancel');

    },

    transactionCallback(e_t){
      
      if(e_t === 'e_unapproval' || e_t === 'e_approval'){
        this.provided_approvals = null;//temporary show spinner by setting to null
        this.checkApprovals();
      }

      if(e_t === 'e_cancel'){
        //hide the proposal
        this.isCancelled = true;
      }

    },

    handleIsSeenCache(isSeen_toggle_bool){
      console.log(isSeen_toggle_bool, this.msig._id);
      
      if(isSeen_toggle_bool){
        this.isSeen = true;
        this.$store.commit('usersettings/SET_MSIGISSEENCACHE', {mode: 'add', msig_id: this.msig._id} );

      }
      else{
        this.isSeen = false;
        this.$store.commit('usersettings/SET_MSIGISSEENCACHE', {mode: 'remove', msig_id: this.msig._id} );
      }
      
    },

    enableApprove(){
      console.log('enabled...')
    }



  },


  mounted:function(){
   this.checkApprovals();
  }

}
</script>

<style lang ="stylus">
@import '~variables'

.proposal_approved{
  border:2px solid $positive;
  transition : border 400ms ease;
}

.proposal_unapproved{
  border:2px solid transparent;
  transition : border 400ms ease;
}

</style>
