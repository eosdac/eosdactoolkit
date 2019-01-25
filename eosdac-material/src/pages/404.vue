<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/eosdac_logo.png"
        style="width:30vw;max-width:98px;"
      >
    </p>
    <p class="text-faded">{{ $t('four_zero_four.sorry_nothing_here') }}<strong>(404)</strong></p>
    <q-btn
      color="primary"
      style="width:200px;"
      @click="$router.push('/')"
    >{{ $t('four_zero_four.go_back') }}</q-btn>
  </div>
</template>
