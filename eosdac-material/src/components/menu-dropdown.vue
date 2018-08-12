<template>
<q-btn size="xl" class="menu-dropdown" flat>
  <q-icon :color="iconColor" class="q-mr-sm" style="font-size:24px;" :name="icon" />
  <p class="q-caption text-left no-margin text-grey" style="font-size:10px;text-transform:none;">{{label}}<br><span v-if="sublabel" class="q-subheading text-bold" v-bind:class="statusObject">{{sublabel}}</span>
    <q-icon v-if="iconRight" class="on-right text-white" style="font-size:13px;" name="icon-ui-11" />
  </p>
  <q-popover fit>
    <slot></slot>
  </q-popover>
</q-btn>
</template>

<script>
export default {
  name: 'MenuDopdown',
  props: {
    icon: String,
    iconColor: String,
    label: String,
    sublabel: String,
    iconRight: Boolean,
    statusLabel: Number
  },
  computed: {
    statusObject: function() {
      if (this.statusLabel === 1) {
        return {active:true, 'text-positive': true}
      } else if (this.statusLabel === 2) {
        return {active:true, 'text-negative': true}
      } else {
        return {active:true, 'text-white': true}
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>
