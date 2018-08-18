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
          <div v-for="(candidate, index) in custodians" :key="index">
            <q-item class="bg-dark2 q-px-lg cursor-pointer" style="height:80px;">
              <q-item-side>
                <q-item-tile>
                  <div class="row">
                    <q-btn class="q-mr-md" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:3px;" @click="addToVoteList(candidate)" />
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
            </q-slide-transition>
          </div>
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
          <q-item class="bg-dark2" style="height:66px;margin-bottom:1px;" v-for="(cand, i) in newvotes" :key="i">
            <q-item-side>
              <q-item-tile style="height:36px;width:36px;" class="q-mr-sm">
                <img style="height:36px;width:36px;border-radius:50%;" class="q-mr-md responsive" src="https://eosdac.io/wp-content/uploads/elementor/thumbs/female1-nqk9ciy87u6os74yatkpw2xi7qbjzjq3r5sl9wy0mm.jpg">
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <h6 class="q-ma-none">{{cand.candidate_name}}</h6>
            </q-item-main>
            <q-item-side right>
              <q-btn dense round color="primary" icon="icon-ui-8" @click="newvotes.splice(i, 1)" />
            </q-item-side>
          </q-item>

        </q-list>
        <pre>{{newvotes}}</pre>
      </q-card>

    </div>
  </div>
  </div>
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Custodians',
  components: {
    Transaction
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      custodians: [],
      newvotes: [],
      candidateIndex: -1
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
    })
  },

  mounted() {
    this.getCustodians()
  },

  methods: {
    toggleBio(index) {
      if (index === this.candidateIndex) {
        this.candidateIndex = -1
      } else {
        this.candidateIndex = index
      }
    },

    async getCustodians() {
      let custodians = await this.$store.dispatch('api/getCustodians')
      console.log(custodians)
      this.custodians = custodians
    },
    addToVoteList(cand){
      this.newvotes.push(cand);
    },
    deleteFromVoteList(accountname){
      this.newvotes = this.newvotes.filter(x => x != acountname);
    },

    voteForCandidates() {
      let votes = this.newvotes.map(c => c.candidate_name);
      this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name, 'votecust', {
        voter: this.getAccountName,
        newvotes: votes
      }, false, false)
    }
  }
}
</script>

<style>
</style>
