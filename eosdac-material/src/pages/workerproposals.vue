<template>
<q-page class="q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Worker Proposals</h4>
  <q-tabs >
    <q-tab default slot="title" name="tab-1" :label="$t('OPEN')" />
    <q-tab slot="title" name="tab-2" :label="$t('APPROVED')" />
    <wp_member_view v-for="(wp, index) in wps" :key="index" :data="wp"/>
<!--     <q-tab-pane class="" name="tab-1">

    </q-tab-pane> -->
    <!--<q-tab-pane name="tab-2">

    </q-tab-pane>-->
  </q-tabs>

</q-page>
</template>

<script>
import wp_member_view from 'components/wp_member_view'

export default {
  name: 'workerproposals',
  components: {
    wp_member_view
  },
  data() {
    return {
      wps:[
      {
        id: '# 001',
        title:'This is the title of a very nice worker proposal vote for it',
        member:{
          name:'Kasper',
          account:'kas'
        },
        submit_date:'Friday, July 27, 2018 20:46:00 UTC',
        type:'Community support',
        description:'Lorem Ipsum adalah text contoh digunakan didalam industri pencetakan dan typesetting. Lorem Ipsum telah menjadi text contoh semenjak tahun ke 1500an, apabil',
        reqpay: '250 EOS',
        time_left:{
            string: '3 Days 4 Hours 23 Min 50 Sec',
            percentage: 25
        },
        deadline:'Thursday 29.08.2018 14:30 UTC',
        votes:{
          yes:12,
          no:88
        }
      },


      {
        id: '# 002',
        title:'This is an other great worker proposal title',
        member:{
          name:'Nano',
          account:'nanonanonano'
        },
        submit_date:'Friday, July 27, 2018 20:46:00 UTC',
        type:'Community support, Management',
        description:'Lorem Ipsum adalah text contoh digunakan didalam industri pencetakan dan typesetting. Lorem Ipsum telah menjadi text contoh semenjak tahun ke 1500an, apabil',
        reqpay: '1000 EOS',
        time_left:{
            string: '8 Days 2 Hours 42 Min 40 Sec',
            percentage: 80
        },
        deadline:'Monday 01.09.2018 12:30 UTC',
        votes:{
          yes:76,
          no:24
        }
      }
      ]

    }
  },
}
</script>

<style>
</style>
