<template>

  <q-btn size="xl" class="menu-dropdown" flat>
    <q-icon :color="iconColor" class="q-mr-sm" style="font-size:24px;" :name="icon" />
    <p class="q-caption text-left no-margin text-grey" style="font-size:10px;text-transform:none;">{{label}}<br><span v-if="sublabel" class="q-subheading text-bold text-white">{{sublabel}}</span>
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
    iconRight: Boolean
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
