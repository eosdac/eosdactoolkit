<template>
<q-page class="q-pa-md">
<q-table
    style="background:#1E2128"
    ref="table"
    color="primary"
    dark
    
    :rows-per-page-options=[3,5,7,10,20,50,100]
    :title="title"
    :data="serverData"
    :columns="columns"
    :filter="filter"
    row-key="name"
    :pagination.sync="serverPagination"
    :loading="loading"
    @request="request"
  >
    <q-td slot="body-cell-account" slot-scope="props" :props="props">
      <router-link :to="{path: '/profile/' + props.value}" >{{ props.value }}</router-link>
    </q-td>


    <template slot="top-right" slot-scope="props">
      <!-- <q-search dark hide-underline v-model.trim="filter" /> -->
      <q-btn
        flat round dense color="brand"
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template>

    <template slot="top-left" slot-scope="props">
      <div class="q-table-title" style="margin-right:20px">{{title}}</div>
      <!-- <q-btn color="positive" dense size="xs" @click="opened = true" :label="$t('top_100_chart')" /> -->
    </template>
</q-table>
</q-page>
</template>

<script>


export default {
  name: 'members',
  components: {
    
  },
  
  data () {
      
    return {
        cache:[],
      opened:false,
      filter: '',
      loading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 1,
      },
      serverData: [],
      title:'Members',
      columns: [
        // { name: 'rank', label: '', field: 'rank', align: 'center', ignoreapi:true},
        { name: 'account', label: 'account', field: 'account', align: 'left', searchable:false}
        // { name: 'balance', label: 'EOSDAC', field: 'balance' , align: 'left'}
      ],
      lb: 0
    }
  },

  methods: {
    async test(){
        
      let m = await this.$store.dispatch('api/getMembers');
      return m.rows[0].count;
    },
    async request (props) {
        
      this.loading = true;
      console.log(props);
      if(this.filter){
          this.lb = this.filter;
      }
      if(props.pagination.page == 1) this.cache = [];
      this.lb = this.cache.length ? this.cache[props.pagination.rowsPerPage * (props.pagination.page-1)] : 0
      
      let e = await this.$store.dispatch('api/readTable', {lb: this.lb, ub: '-1', limit: props.pagination.rowsPerPage+1});
    
      if(this.cache.length-1 <= props.pagination.rowsPerPage * (props.pagination.page-1)){
        let t = e.map(acc => acc.sender);
        if(props.pagination.page-1) t.shift();
        this.cache = this.cache.concat(t);
      }
      console.log('cache:', this.cache);
      
      if(e.length == props.pagination.rowsPerPage+1){
          let last = e.pop();
        //   this.lb = last.sender;
      }

      this.serverPagination = props.pagination;
      let table = this.$refs.table;
      let rows = e.map(acc => { return {account : acc.sender} });
      let { page, rowsPerPage, sortBy, descending } = props.pagination;
      if (props.filter) {
        rows = table.filterMethod(rows, props.filter);
      }
      if (sortBy) {
        rows = table.sortMethod(rows, sortBy, descending);
      }
      this.serverPagination.rowsNumber = await this.test();
      this.serverData = rows;
      this.loading = false;

    }
  },
  created(){
    this.request({
        pagination: this.serverPagination,
        filter: this.filter
    })
  }
}
</script>

<style>
</style>
