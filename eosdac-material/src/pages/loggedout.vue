<template>
<q-page class="gradient-bg-primary q-pa-xl" style="overflow:hidden">
  <div class="relative-position">
    <div class="bg-dark2 round-borders loggedout_big_container shadow-14" style="min-height:600px; padding-bottom: 120px; overflow:hidden">
      <div class="row q-px-lg" style="margin-bottom:-40px"><div class="col-xs-12 col-lg-6 q-display-3">Welcome <span class="text-weight-thin">to the <br>eos</span>DAC Member Client</div></div>
      <div class="row" >
        <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12  index_border_right_col q-px-lg" style="min-height:300px">
          <div class="column justify-between full-height">
            <div class="q-title text-dimwhite" style="padding-top:50px">
              <p>{{$t('index.description_p1')}}</p>
              <p>{{$t('index.description_p2')}}</p>
            </div>
            <div class="q-mb-lg">
              <q-btn class="float-left q-px-xl" size="lg" color="primary" :label="$t('index.signin')" />
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12 q-px-lg" >
          <div class=" full-height" >
            <div class="q-headline q-mb-lg">Key Features</div>
            <div class="row">
              <div class="col-lg-6 col-sm-12">
                <div class="q-pb-lg"><q-icon name="icon-role-3" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.reg_as_member')}}</span></div>
                <div class="q-pb-lg"><q-icon name="icon-menu-8" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.submit_wp')}}</span></div>
                <div class="q-pb-lg"><q-icon name="icon-register-3" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.read_constitution')}}</span></div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <div class="q-pb-lg"><q-icon name="icon-menu-6" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.wallet')}}</span></div>
                <div class="q-pb-lg"><q-icon name="icon-menu-12" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.reg_as_cust_cand')}}</span></div>
                <div class="q-pb-lg"><q-icon name="icon-ui-3" size="48px" class="q-mr-sm" /><span class="q-title text-dimwhite">{{$t('index.vote_cust')}}</span></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    <div class="row gutter-md relative-position justify-center q-px-lg row_boxes_index_page" style="min-height:240px;">
      <div class="col-xl-4 col-md-12 col-sm-12 col-xs-12" style="min-width:200px">
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.join_discord')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-social-instagram-com" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px">{{$t('index.discord_description')}}</div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn class="float-right" color="dark" :label="$t('index.open_discord')" />
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-12 col-sm-12 col-xs-12" style="min-width:200px">
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.visit_eosdac')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-menu-3" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px">{{$t('index.discord_description')}}</div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn class="float-right" color="dark" :label="$t('index.eosdac')" />
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-12 col-sm-12 col-xs-12" style="min-width:200px" >
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.subscribe_newsletter')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-register-3" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px">
                <q-input dark class="q-mb-xs" color="white" v-model="email_address" stack-label="Your Email" />
                <q-input dark color="white" v-model="language" stack-label="Your Language" />
              </div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn class="float-right" color="dark" :label="$t('index.subscribe')" />
          </div>
        </div>
      </div>
    </div>
  </div>

</q-page>
</template>



<script>

import {
  openURL
} from 'quasar'
import {
  mapGetters
} from 'vuex'
export default {
  components:{

  },
  data () {
    return {
      email_address:'',
      language: ''


    }
  },
  
  computed: {

  },

  methods:{
    openURL,

  },

  mounted: function(){

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

.loggedout_big_container{
  background-image: url('../assets/background-logo-alpha-3-white.svg');
  background-repeat: no-repeat;
  background-size: 200%;
  background-position: -20% 30%
}
.index_border_right_col{
  border-right:1px solid grey;
}
.row_boxes_index_page{
  top:-100px;
  transition: all .2s ease-in-out;
}


@media screen and (max-width: 1200px) {
  .row_boxes_index_page{
    top:20px !important;
  }
}

</style>
