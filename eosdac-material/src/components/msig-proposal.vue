<template>
<div class="q-mb-md bg-dark2 round-borders shadow-5" >
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-icon size="24px" name="icon-transfers" class="q-mr-xs" /><span> type</span>
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <div class="q-title q-mb-xs">{{msig.title}}</div>
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
            <span v-if="provided_approvals" class="text-p-light">{{provided_approvals.length}}</span>
            <span>/ {{msig.threshold}}</span>
          </div>
        </q-item-side>
      </template>

      <div class="q-px-md q-pb-md" >
        <div style="border-top:1px solid grey;">
          <div class="row gutter-md q-pt-md">
            <div class="col-md-4 col-xs-12" >
              <div style="background:none">
                <!-- <div class="row justify-between q-py-md" v-for="(key, i) in Object.keys(msig.data)" :key="i" style="border-bottom: 1px solid grey">
                  <span class="text-dimwhite ">{{key}}:</span><span class=""> {{msig.data[key]}}</span>
                </div> -->
              </div>
            </div>
            <div class="col-md-8 col-xs-12" >
              <div class="column justify-between full-height" style="background:none">
                <pre>{{msig.provided_approvals}}</pre>
                <div class="text-dimwhite">{{msig.description}}</div>
                <div style="height:35px">
                  <q-btn class="float-right" color="positive" label="Approve" @click="approveProposal(msig.proposer, msig.proposal_name)"  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </q-collapsible>
  </div>
</template>

<script>

export default {
  name: 'Msigproposal',
  components: {
  },

  props: {
    msig: Object,
  },

  data () {
    return {
      provided_approvals: null,
      requested_approvals:null

    }
  },

  methods: {
    async getApprovals(){
      let approvals = await this.$store.dispatch('api/getApprovalsFromProposal', {proposer: this.msig.proposer, proposal_name: this.msig.proposal_name});
      this.provided_approvals = approvals.provided_approvals;
      this.requested_approvals = approvals.requested_approvals;
    }



  },


  mounted:function(){
   this. getApprovals()
  }

}
</script>

<style lang ="stylus">
@import '~variables'



</style>
