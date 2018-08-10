<template>
  <div class="wp_row row q-mt-md bg-dark2 q-pa-sm shadow-5" style="min-height:190px" >

    <!-- first column XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="mycol col-xl-4 col-lg-4 col-md-4 col-sm-12 q-pl-sm q-pr-sm">
        <div class="row" style="color:#9077AB">
          <div class="col-2"> {{data.id}}</div>
          <div class="col-10"> {{data.title}}</div>
        </div>
        <div class="row q-mt-md q-caption">
          <div class="col-2 text-left white_text"> 
              <div>WP by:</div>
              <div>Submitted:</div>
              <div>Type:</div>
          </div>
          <div class="col-10 whiter_tex">
              <div>{{data.member.name}} - {{data.member.account}}</div>
              <div>{{data.submit_date}}</div>
              <div>{{data.type}}</div>
              
          </div>
        </div>
        <div class="row q-mt-md q-mb-md q-caption white_text">
          {{data.description}}
        </div>
    </div>

    <!-- second colum XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="mycol col-xl-4 col-lg-4 col-md-4 col-sm-12 q-pl-sm q-pr-sm "> 
      <div class="row">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:22px" name="icon-type-2" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">Requested Payment</div>
          <div> {{data.reqpay}} (Aprox. xxxx USD)</div> 
        </div> 
      </div>

      <div class="row q-mt-lg">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:22px" name="icon-type-11" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">Time Left</div>
          <div>{{data.time_left.string}}</div>
          <q-progress :percentage="data.time_left.percentage" color="blue" style="height:3px; margin-top:3px"/>
        </div> 
      </div>

      <div class="row q-mt-lg ">
        <div class="col-1">
          <q-icon class="white_text" style="font-size:22px" name="icon-menu-1" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">Deadline</div>
          <div>{{data.deadline}}</div>
        </div> 
      </div>

    </div>

    <!-- third column XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-->
    <div class="mycol col-xl-4 col-lg-4 col-md-4 col-sm-12 q-pl-sm q-pr-sm">

      <div class="row">
        <div class="col-1">
          <q-icon  class="green" style="font-size:22px;" name="icon-ui-6" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">Votes</div>
          <div class="green">{{data.votes.yes}}% Yes</div>
          <q-progress :percentage="data.votes.yes" color="positive" style="height:3px; margin-top:3px"/>
        </div> 
      </div>

      <div class="row q-mt-lg">
        <div class="col-1">
          <q-icon  class="red" style="font-size:22px;" name="icon-ui-6" />
        </div>
        <div class="col-11">
          <div class="q-caption white_text">Votes</div>
          <div class="red">{{data.votes.no}}% No</div>
          <q-progress :percentage="data.votes.no" color="negative" style="height:3px; margin-top:3px"/>
        </div> 
      </div>

      <div class="row q-mt-lg justify-end">
          <q-btn size="12px" class="q-mr-md" color="primary" label="View Proposal"  />
          <q-btn size="12px" color="primary" label="View Votes" />
      </div>

    </div>

  </div>
</template>



<style >
  .wp_row > .mycol:first-of-type{
      border:0;
  }
  .mycol{
    border-left:1px solid rgba(255,255,255,0.7);
    /*background:blue;*/
  }
  .white_text{
    color:rgba(255,255,255,0.6);
  }
  .whiter_text{
    color:rgba(255,255,255,0.8);
  }
  .small_font{
    font-size:12px;
  }
  .red{
    color:red;
  }
  .green{
    color:#06B200;
  }
</style>



<script>

export default {
  name: 'wp_member_view',
  props: {
    data: {},

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
