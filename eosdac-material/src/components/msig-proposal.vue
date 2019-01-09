<template>
<div v-if="!isCancelled" class="q-mb-md bg-dark2 round-borders shadow-5"  v-bind:class="{ 'proposal_approved': isApproved, 'proposal_unapproved':!isApproved,}" >
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-icon size="24px" name="icon-transfers" class="q-mr-xs" /><span> type</span>
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
        <q-item-side right >
          <div class="q-caption text-dimwhite" >Received Approvals:</div>
          <div class="text-white q-display-1">
            <q-spinner v-if="provided_approvals==null" color="primary" size="30px" style="margin-top:-4px" />
            <span v-if="provided_approvals" class="text-p-light cursor-pointer"  @click="approvals_modal = true">{{provided_approvals.length}}</span>
            <span>/ {{msig.threshold}}</span>
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

          <div class="bg-dark q-mb-md">
            
            <Actionparser :actions="msig.trx.actions" />

          </div>

          <div class="row justify-end">
            <q-btn v-if="!isApproved" color="positive" label="Approve" @click="approveProposal(msig.proposer, msig.proposal_name)"  />
            <q-btn v-if="isApproved" class="on-right" color="warning" label="Unapprove" @click="unapproveProposal(msig.proposer, msig.proposal_name)"  />
            <q-btn v-if="isCreator" class="on-right" color="red" label="cancel" @click="cancelProposal(msig.proposer, msig.proposal_name)" />
            <q-btn v-if="isExecutable" class="on-right" color="blue" label="execute" />
          </div>

        </div>
      </div>
    </q-collapsible>

    <q-modal minimized v-model="approvals_modal" >
      <div class="bg-dark">
        <!-- header -->
        <div style="height:50px" class="bg-dark2 row items-center justify-between q-px-md">
          <span>Approvals</span>
          <q-icon class=" cursor-pointer" name="icon-ui-8" @click.native="approvals_modal = false" />
        </div>
        <!-- content -->
        <div class="q-pa-md">
          <div class="row justify-start q-mt-sm">
            <q-chip class="animate-fade" color="positive" v-for="(c,i) in provided_approvals" :key="i+'p'"> {{c.actor}}</q-chip>
            <q-chip class="animate-fade" color="dark" v-for="(c,i) in requested_approvals" :key="i+'r'"> {{c.actor}}</q-chip>
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
      requested_approvals:null,
      isApproved: false,
      isCreator: false,
      isCancelled: false,
      approvals_modal: false

    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName'
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
    }

  },

  methods: {
    //get the requested and provided approvals for this msg proposal from chain
    async checkApprovals(){

      let approvals = await this.$store.dispatch('api/getApprovalsFromProposal', {proposer: this.msig.proposer, proposal_name: this.msig.proposal_name});
      this.provided_approvals = approvals.provided_approvals;
      this.requested_approvals = approvals.requested_approvals;
      //check if user has already approved the proposal
      this.isApproved = this.provided_approvals.find(a => a.actor == this.getAccountName) ? true : false;
      //check if the proposal is created by current user
      this.isCreator = this.getAccountName == this.msig.proposer

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
