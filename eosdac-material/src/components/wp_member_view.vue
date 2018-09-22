<template>
  <div class="wp_row row q-mt-md bg-dark2 q-pa-sm shadow-5" style="min-height:190px" >

    <!-- first column XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="wp_col col-md-4 col-sm-12 q-pl-sm q-pr-sm">

        <div class="row q-title" style="color:#B999DB">
          <div class="col-2"> {{data.id}}</div>
          <div class="col-10"> {{data.title}}</div>
        </div>

        <div class="row q-mt-md q-caption">
<!--           <div class="col-2 text-left white_text q-caption">
              <div>WP by:</div>
              <div>Submitted:</div>
              <div>Type:</div>
          </div>
          <div class="col-10 whiter_tex">
              <div>{{data.member.name}} - {{data.member.account}}</div>
              <div>{{data.submit_date}}</div>
              <div>{{data.type}}</div>
          </div> -->
          <div class=" white_text q-body-1">
              <div style="margin-bottom:3px">
                <span style="display:inline-block;min-width:65px">{{ $t('wp_member_view.worker_proposal_by') }}:</span>
                <span class="whiter_text" style="display:inline-block;min-width:65px">{{data.member.name}} - {{data.member.account}}</span></div>
              <div style="margin-bottom:3px">
                <span style="display:inline-block;min-width:65px">{{ $t('wp_member_view.submitted') }}:</span>
                <span class="whiter_text" style="display:inline-block;min-width:65px">{{data.submit_date}}</span></div>
              <div>
                <span style="display:inline-block;min-width:65px">{{ $t('wp_member_view.type') }}:</span>
                <span class="whiter_text" style="display:inline-block;min-width:65px">{{data.type}}</span>
              </div>
          </div>
        </div>

        <div class="row q-mt-md q-mb-md text-dimwhite q-body-1">
          {{data.description.slice(0,160)+'...'}}
        </div>

    </div>

    <!-- second colum XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="wp_col col-md-4 col-sm-12 q-pl-sm q-pr-sm ">

      <div class="row">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:24px" name="icon-type-2" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">{{ $t('wp_member_view.requested_payment') }}</div>
          <div> {{data.reqpay}} {{ $t('wp_member_view.approx_USD') }}</div>
        </div>
      </div>

      <div class="row q-mt-lg">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:24px" name="icon-ui-16" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">{{ $t('wp_member_view.time_left') }}</div>
          <div>{{data.time_left.string}}</div>
          <q-progress :percentage="data.time_left.percentage" color="blue" style="height:3px; margin-top:3px"/>
        </div>
      </div>

      <div class="row q-mt-lg ">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:24px" name="icon-ui-12" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">{{ $t('wp_member_view.deadline') }}</div>
          <div>{{data.deadline}}</div>
        </div>
      </div>

    </div>

    <!-- third column XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="wp_col col-xl-4 col-lg-4 col-md-4 col-sm-12 q-pl-sm q-pr-sm">

      <div class="row">
        <div class="col-1">
          <q-icon  class="text-positive" style="font-size:24px;" name="icon-ui-6" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">{{ $t('wp_member_view.votes') }}</div>
          <div class="text-positive">{{data.votes.yes}}% {{ $t('wp_member_view.yes') }}</div>
          <q-progress :percentage="data.votes.yes" color="positive" style="height:3px; margin-top:3px"/>
        </div>
      </div>

      <div class="row q-mt-lg">
        <div class="col-1">
          <q-icon  class="text-negative" style="font-size:24px;" name="icon-ui-6" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">{{ $t('wp_member_view.votes') }}</div>
          <div class="text-negative">{{data.votes.no}}% {{ $t('wp_member_view.no') }}</div>
          <q-progress :percentage="data.votes.no" color="negative" style="height:3px; margin-top:3px"/>
        </div>
      </div>

      <div class="row q-mt-lg justify-end">
          <q-btn size="small" class="q-mr-md" color="primary" :label="$t('wp_member_view.view_proposal')"  />
          <q-btn size="small" color="primary" :label="$t('wp_member_view.view_votes')" />
      </div>
<!--       <div class="row gutter-sm justify-end">
        <div>
          <q-btn size="md" class="" color="primary" :label="$t('wp_member_view.view_proposal')"  />
        </div>
        <div>
          <q-btn size="md" color="primary" :label="$t('wp_member_view.view_votes')" />
        </div>
      </div> -->

    </div>

  </div>
</template>



<style >
  .wp_row > .wp_col:first-of-type{
      border:0;
  }
  .wp_col{
    border-left:1px solid rgba(255,255,255,0.5);
    /*background:blue;*/
  }
  .white_text{
    color:rgba(255,255,255,0.6);
  }
  .whiter_text{
    color:rgba(255,255,255,0.9);
  }
</style>



<script>

export default {
  name: 'wp_member_view',
  props: {
    data: Object,

  },
  data () {
    return {}
  },
  methods: {

  }
}
</script>

<style>
</style>
