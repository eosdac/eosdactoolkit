<template>
<q-page class="gradient-bg-primary q-pa-xl" style="overflow:hidden">
  <div class="relative-position">
    <div class="bg-dark2 round-borders loggedout_big_container shadow-14" style="min-height:600px; padding-bottom: 120px; overflow:hidden">
      <div class="row q-px-xl" style="margin-bottom:-40px; padding-top:40px"><div class="col-xs-12 col-lg-6 q-display-3">{{$t('index.welcome_to_esodac_member_client')}}</div></div>
      <div class="row" >
        <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12  index_border_right_col q-px-xl" style="min-height:300px">
          <div class="column justify-between full-height">
            <div class="q-title text-dimwhite regular" style="padding-top:50px">
              <p>{{$t('index.description_p1')}}</p>
              <p>{{$t('index.description_p2')}}</p>
            </div>
            <div class="q-mb-lg">
              <q-btn  v-if="!getAccountName" class="float-left q-px-xl" icon="icon-topmenu-3" size="lg" color="primary" :label="$t('index.signin')" @click="signin"/>
              <q-btn  v-else class="float-left q-px-xl" size="lg" color="primary" :label="$t('index.signout')" @click="logout"/>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12 q-px-xl" >
          <div class=" full-height" >
            <div class="q-headline q-mb-lg">{{$t('index.key_features')}}</div>
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
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md animate-pop">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.join_discord')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-social-discord-com" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px">{{$t('index.discord_description')}}</div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn class="float-right" color="dark" :label="$t('index.open_discord')" @click.native="openURL($configFile.external.discordUrl)"/>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-12 col-sm-12 col-xs-12" style="min-width:200px">
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md animate-pop">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.visit_eosdac')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-ui-21" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px">{{$t('index.website_description')}}</div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn class="float-right" color="dark" :label="$t('index.eosdac')" @click.native="openURL($configFile.external.homepage)" />
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-12 col-sm-12 col-xs-12" style="min-width:200px" >
        <div class="column justify-between bg-primary shadow-14 round-borders full-height q-pa-md animate-pop">
          <div>
            <div class="q-title q-mb-lg">{{$t('index.subscribe_newsletter')}}</div>
            <div class="q-body-1 text-dimwhite relative-position">
              <q-icon name="icon-ui-22" size="48px" class="absolute-top-left" />
              <div style="display:inline-block;margin-left:55px;margin-top:-3px;">
                <q-input dark class="q-mb-xs" color="white" v-model="email_address" :stack-label="$t('index.your_email')" @focus="onsubscribemsg=''" />
                <q-select
                color="white"
                :float-label="$t('index.your_language')"
                 @focus="onsubscribemsg=''"
                dark
                  :options="[
                    { label: $t('lang_selector.languages.chinese') + ' - 中文',    value: 'Chinese' },
                    { label: $t('lang_selector.languages.english_us') + ' - English', value: 'English' },
                    { label: $t('lang_selector.languages.french') + ' - Français',     value: 'French' },
                    { label: $t('lang_selector.languages.german') + ' - Deutsch',     value: 'Dutch' },
                    { label: $t('lang_selector.languages.italian') + ' - Italiano',    value: 'Italian' },
                    { label: $t('lang_selector.languages.japanese') + ' - 日本語',   value: 'Japanese' },
                    { label: $t('lang_selector.languages.korean') + ' - 한국어',     value: 'Korean' },
                    { label: $t('lang_selector.languages.russian') + ' - Pусский',    value: 'Russian' },
                    { label: $t('lang_selector.languages.spanish') + ' - Español',    value: 'Spanish (Mexico)' },
                  ]"
                  v-model="language"
                />
              </div>
            </div>
          </div>
          <div class="q-mt-sm row justify-between items-center" style="min-height:50px">
            <span class=" q-caption q-my-md"><q-spinner v-if="loading" /> {{onsubscribemsg}}</span>
            <q-btn class="" color="dark" :label="$t('index.subscribe')" @click="subscribeNewsletter" />
          </div>
        </div>
      </div>
    </div>
  </div>
<MultiModal ref="Multi" />
</q-page>
</template>



<script>
import MultiModal from 'components/multi-modal'
import {
  openURL
} from 'quasar'
import {
  mapGetters
} from 'vuex'
export default {
  components:{
    MultiModal
  },
  data () {
    return {
      email_address:'',
      language: '',
      onsubscribemsg:'',
      loading : false


    }
  },
  
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getScatter: 'api/getScatter',
    })
    


  },

  methods:{
    openURL,
    signin(){
      this.$refs.Multi.init('signin')
    },
    async logout() {
      this.getScatter.forgetIdentity()
      this.$store.commit('account/LOCK_ACCOUNT')

    },

    async subscribeNewsletter(){
      this.onsubscribemsg ='';
      let data = {email: this.email_address, language: this.language};

      if(!this.$helper.isEmail(this.email_address) || this.language == ''){
        this.onsubscribemsg = 'Valid input required!';
        return false;
      }
      let url = this.$configFile.api.profileApiUrl;

      if (url.substr(-1) != '/'){
        url += '/subscribe';
      }
      else{
        url += 'subscribe';
      }
      this.loading =true;
      try{
        let result = await this.$axios.post(url, data);
        this.onsubscribemsg = result.data.message;
        // console.log(result);
      }catch(e){
        this.onsubscribemsg = 'Error';
        console.log(e);
      }
      this.clearForm();
    },

    clearForm(){
      this.loading =false;
      this.email_address ='';
      this.language = '';
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

.loggedout_big_container{
  background-image: url('../assets/background-logo-alpha-3-white.svg');
  background-repeat: no-repeat;
  background-size: 200%;
  background-position: -20% 30%;
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
  .index_border_right_col{
    border-right: none !important;
  } 

}


</style>
