<template>
<q-btn size="xl" class="menu-dropdown" flat>
  <q-icon :color="iconColor" class="q-mr-sm" style="font-size:24px;" :name="icon" />
  <p class="q-caption text-left no-margin text-grey" style="font-size:10px;text-transform:none;">{{label}}<br><span v-if="sublabel" class="q-subheading text-bold" v-bind:class="statusObject">{{sublabel}}</span>
    <q-icon v-if="iconRight" class="on-right text-white" style="font-size:13px;" name="icon-ui-11" />
  </p>
  <q-popover class="xs-hide sm-hide md-hide bg-transparent" ref="pop" fit>
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

      switch (this.statusLabel) {
        case 1: //registered
          return {
            active: true,
            'text-positive': true
          }
          break;
        case 2: //unregistered
          return {
            active: true,
            'text-negative': true
          }
          break;
        case 3: //pending
          return {
            active: true,
            'text-warning': true
          }
          break;
        default:
          return {
            active: true,
            'text-white': true
          }
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
