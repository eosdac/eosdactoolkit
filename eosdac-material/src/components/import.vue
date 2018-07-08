<template>
  <q-stepper color="primary" ref="importstepper">
    <q-step default title="Account" name="import1">
      <q-field label-width="12" label="Account name" :error="errorAccount" :error-label="errorAccountText" dark>
        <q-input dark v-model="account" />
      </q-field>
      <q-stepper-navigation class="justify-center">
        <q-btn :disabled="badAccount" class="q-ma-sm" color="primary" @click="checkAccount()" label="Connect" />
      </q-stepper-navigation>
    </q-step>
    <q-step title="Permissions" name="import2">
      <q-alert message="Below you see all the permission need for your account." class="text-truncate" icon="info" color="grey" />
    <q-list dark class="no-border">
      <q-list-header>Permission Threshold: {{permissionThreshold}}</q-list-header>
      <q-item v-for="(perm, index) in permissions" :key="index">
        <q-item-side>
          <p>Name: <b>{{perm.perm_name}}</b></p>
          <p class="text-truncate">Key: <b><small>{{perm.key}}</small></b></p>
          <p>Weight: <b>{{perm.weight}}</b></p>
          <q-field :error="perm.error" :error-label="perm.errorLabel" label="Private key" :label-width="12">
            <q-input dark @input="validatePermission(index)" type="password" v-model="permissions[index].privateKey"/>
          </q-field>
        </q-item-side>
      </q-item>
    </q-list>
    <q-stepper-navigation>
      <q-btn :disable="badPermissions" color="primary" @click="$refs.importstepper.next()">Continue</q-btn>
    </q-stepper-navigation>
  </q-step>
  <q-step title="Password" name="import3">
    <q-field :error="errorPassword" :error-label="errorPasswordText" label="Password" :label-width="12">
      <q-input dark v-model="password"  type="password" />
    </q-field>
    <q-field :error="errorPassword2" :error-label="errorPassword2Text" label="Confirm Password" :label-width="12">
      <q-input dark v-model="password2"  type="password" />
    </q-field>
    <q-stepper-navigation>
      <q-btn :disable="badImport" color="primary" @click="importAccount()">Finish Import</q-btn>
    </q-stepper-navigation>
  </q-step>
    <LoadingSpinner :visible="loading" :text="loadingText" />
  </q-stepper>
</template>

<script>
import ecc from 'eosjs-ecc'
import LoadingSpinner from 'components/loading-spinner'
export default {
  name: 'Import',
  components: {
    LoadingSpinner
  },
  data () {
    return   {
      loading: false,
      loadingText: '',
      account: '',
      errorAccount: false,
      errorAccountText: '',
      badAccount: true,
      permissionThreshold: 0,
      permissions: [],
      accountObj: {},
      badPermissions: true,
      password: '',
      errorPassword: false,
      errorPasswordText: '',
      password2: '',
      errorPassword2: false,
      errorPassword2Text: '',
      badImport: true
    }
  },
  methods: {
    importAccount () {
      this.loading = true
      this.loadingText = 'Encrypting keys...'
      this.$store.dispatch('account/importAccount', {info: this.accountObj, keys: this.permissions, password: this.password}).then(() => {
        this.$emit('hide', true)
        this.$parent.$emit('hide', true)
        Object.assign(this.$data, this.$options.data())
      })
      this.loading = false
    },
    checkAccount () {
      this.loading = true
      this.loadingText = 'Looking up account...'
      this.$store.dispatch('api/getAccount', {
        account_name: this.account
      }).then((res) => {
        this.loading = false
        if (!res.permissions.length) {
          this.loading = false
          this.badAccount = true
          this.errorAccount = true
          this.errorAccountText = 'Could not find account on network'
        } else {
          this.accountObj = res
          // this.gatherPermissions(res.permissions)
          // use get_required_keys on transfer action
          // https://developers.eos.io/eosio-nodeos/reference
          this.gatherPermissions(res.permissions)
        }
      }, (err) => {
        this.loading = false
        if (err === 'Error: notFound') {
          this.errorAccount = true
          this.errorAccountText = 'Could not find account.'
        } else {
          this.errorAccount = true
          this.errorAccountText = err
        }
      })
    },
    validatePermission (i) {
      if (!this.permissions[i].privateKey.length) {
        this.permissions[i].error = false
        this.permissions[i].errorLabel = ''
      } else if (ecc.isValidPrivate(this.permissions[i].privateKey)) {
        if (ecc.privateToPublic(this.permissions[i].privateKey) === this.permissions[i].key) {
          this.permissions[i].error = false
          this.permissions[i].errorLabel = ''
        } else {
          this.permissions[i].error = true
          this.permissions[i].errorLabel = 'The provided private key does not match the public key'
        }
      } else {
        this.permissions[i].error = true
        this.permissions[i].errorLabel = 'The provided value is not a valid private key'
      }
      this.compareThreshold()
    },
    compareThreshold () {
      let threshold = 0
      for (let i = 0; i < this.permissions.length; i++) {
        if (!this.permissions[i].error && this.permissions[i].privateKey.length) {
          threshold++
        }
      }
      if (threshold >= this.permissionThreshold) {
        this.badPermissions = false
      } else {
        this.badPermissions = true
      }
    },
    gatherPermissions (perms) {
      for (let perm in perms) {
        if (perms[perm].perm_name === 'active') {
          let keys = perms[perm].required_auth.keys
          this.permissionThreshold = perms[perm].required_auth.threshold
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i].key
            let weight = keys[i].weight
            this.permissions.push({
              perm_name: 'active',
              key,
              weight,
              privateKey: '',
              error: false,
              errorLabel: ''
            })
          }
        }
      }
      this.$refs.importstepper.next()
      this.loading = false
    },
    checkPasswords () {
      if (this.password.length > 7) {
        if (this.password !== this.password2) {
          this.errorPassword = true
          this.errorPassword2 = true
          this.errorPasswordText = 'Passwords do not match'
          this.errorPassword2Text = 'Passwords do not match'
          this.badImport = true
        } else {
          this.errorPassword = false
          this.errorPassword2 = false
          this.errorPasswordText = ''
          this.errorPassword2Text = ''
          this.badImport = false
        }
      } else {
        this.badImport = true
        this.errorPassword = true
        this.errorPasswordText = 'Password has to be at least eight characters long'
      }
    }
  },
  watch: {
    password () {
      this.checkPasswords()
    },
    password2 () {
      this.checkPasswords()
    },
    account (val) {
      if (!val) {
        this.errorAccount = false
        this.errorAccountText = ''
        this.badAccount = true
      } else if (!/(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(val)) {
        this.errorAccount = true
        this.errorAccountText = 'Invalid account name'
        this.badAccount = true
      } else {
        this.errorAccount = false
        this.errorAccountText = ''
        this.badAccount = false
      }
    }
  }
}
</script>

<style>
</style>
