<template>
<q-page class="relative-position" style="overflow-x: hidden;">
  <div class="gradient-bg-primary q-px-md q-pt-md">
    <div class="row">
      <div class="col-12">
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("wallet.wallet") }}</h4>
      </div>
    </div>
    <div class="row gutter-md">
      <div class="col-lg-12 col-xl-4 relative-position">
        <span class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total_eos_balance") }}</span>
        <h4 class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{(getMainCurrencyBalance + getMainCurrencyStaked).toFixed(transferMainAmountDecimals)}}</span> {{mainCurrencyName}}</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-6">
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyStaked}} {{mainCurrencyName}}</span></p>
            </div>
            <div class="col-lg-12 col-xl-6">
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.liquid") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 col-xl-4 relative-position">
        <span class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total") }} {{tokenName}}</span>
        <h4 class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{getTokenBalance}}</span> {{tokenName}}</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-12">
              <!--12 bc only one for now-->
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.liquid") }}</span><br><span class="uppercase q-title">{{getTokenBalance}} {{tokenName}}</span></p>
            </div>
            <div class="col-lg-12 col-xl-6 ">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 col-xl-4 relative-position lg-hide md-hide sm-hide xs-hide">
        <span v-if="showValue" class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total") }}</span>
        <span v-else class="q-subheading text-dimwhite uppercase">&zwnj;</span>
        <h4 v-if="showValue" class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{total}}</span> USD</h4>
        <h4 v-else class="q-my-sm text-no-wrap shrink_balance">&zwnj;</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-6">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
            <div class="col-lg-12 col-xl-6">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row q-px-md gutter-md lg-hide md-hide sm-hide xs-hide" style="max-height:78px;">
    <div class="col-lg-12 col-xl-4">
      <q-card class="bg-dark2 relative-position shadow-5" style="margin-top:-43px;z-index:3;">
        <q-btn dense @click="ramslider = !ramslider" flat class="float-right" icon="icon-topmenu-6 q-pa-sm">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_ram_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="positive" style="font-size:48px;" name="icon-ui-13" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.RAM') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.ram.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.ram.raw.used / 1024).toFixed(2)}} / {{(getAccountResources.ram.raw.available / 1024).toFixed(2)}} {{$t('wallet.KB')}}</span>
            <div v-if="ramslider">
              <q-slider v-if="buyRam" color="positive" v-model="buyRamVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="sellRamVal" :min="0" :max="Math.round(getAccountResources.ram.raw.available)" :step="1" />
            </div>
            <q-slider v-else color="positive" readonly v-model="getAccountResources.ram.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="ramslider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="buyRam" :toggle-color="(buyRam)? 'positive': 'negative'" :options="[{label: $t('wallet.buy'), value: true},{label: $t('wallet.sell'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="buyRam">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{getPercentageOf(((buyRamVal - (buyRamVal * 0.05)) / ramPrice), getAccountResources.ram.raw.available)}} % || ~{{(((buyRamVal - (buyRamVal * 0.05)) / ramPrice) / 1024).toFixed(2)}}
                    {{$t('wallet.KB')}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{getPercentageOf(sellRamVal, getAccountResources.ram.raw.available)}} % || ~{{(sellRamVal / 1024).toFixed(2)}} {{$t('wallet.KB')}}
                  </div>
                </div>
              </div>
              <q-item-separator />
              <div class="row">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1 text-no-wrap">{{$t('wallet.ram_price_per_kb')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{(ramPrice * 1024).toFixed(6)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="buyRam">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.total_cost')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{(buyRamVal).toFixed(transferMainAmountDecimals)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.total_refund')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{((ramPrice * sellRamVal) - ((ramPrice * sellRamVal) * 0.05)).toFixed(transferMainAmountDecimals)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(buyRam)?buyRamFunc():sellRam()" class="no-shadow q-ma-sm float-right" :label="(buyRam)? $t('wallet.buy'): $t('wallet.sell')" />
              <q-btn color="dark" @click="ramslider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
            <LoadingSpinner :visible="!ramPrice" :text="$t('wallet.loading')" />
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="col-lg-12 col-xl-4">
      <q-card class="bg-dark2 relative-position shadow-5" style="margin-top:-43px;z-index:3;">
        <q-btn dense @click="cpuSlider = !cpuSlider" flat class="float-right" icon="icon-topmenu-6 q-pa-sm">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_cpu_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="blue" style="font-size:48px;" name="icon-ui-9" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.CPU') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.cpu.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.cpu.raw.used).toFixed(2)}} / {{(getAccountResources.cpu.raw.available).toFixed(2)}} {{$t('wallet.cycles')}}</span>
            <div v-if="cpuSlider">
              <q-slider v-if="incCpu" color="positive" v-model="incCpuVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="decCpuVal" :min="0" :max="parseFloat(getAccount.self_delegated_bandwidth.cpu_weight)" :step="0.0001" />
            </div>
            <q-slider v-else color="blue" readonly v-model="getAccountResources.cpu.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="cpuSlider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="incCpu" :toggle-color="(incCpu)? 'positive': 'negative'" :options="[{label: $t('wallet.increase'), value: true},{label: $t('wallet.decrease'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="incCpu">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(incCpuVal, parseFloat(getAccount.self_delegated_bandwidth.cpu_weight))}} % || {{incCpuVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(decCpuVal, parseFloat(getAccount.self_delegated_bandwidth.cpu_weight))}} % || {{decCpuVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(incCpu)?increaseCpu():decreaseCpu()" class="no-shadow q-ma-sm float-right" :label="(incCpu)? $t('wallet.increase'): $t('wallet.decrease')" />
              <q-btn color="dark" @click="cpuSlider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="col-lg-12 col-xl-4">
      <q-card class="bg-dark2 relative-position shadow-5" style="margin-top:-43px;z-index:3;">
        <q-btn dense @click="netSlider = !netSlider" flat class="float-right" icon="icon-topmenu-6 q-pa-sm">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_net_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="red" style="font-size:48px;" name="icon-ui-14" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.network') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.net.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.net.raw.used).toFixed(2)}} / {{(getAccountResources.net.raw.available).toFixed(2)}} {{$t('wallet.bytes')}}</span>
            <div v-if="netSlider">
              <q-slider v-if="incNet" color="positive" v-model="incNetVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="decNetVal" :min="0" :max="parseFloat(getAccount.self_delegated_bandwidth.net_weight)" :step="0.0001" />
            </div>
            <q-slider v-else color="red" readonly v-model="getAccountResources.net.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="netSlider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="incNet" :toggle-color="(incNet)? 'positive': 'negative'" :options="[{label: $t('wallet.increase'), value: true},{label: $t('wallet.decrease'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="incNet">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(incNetVal, parseFloat(getAccount.self_delegated_bandwidth.net_weight))}} % || {{incNetVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(decNetVal, parseFloat(getAccount.self_delegated_bandwidth.net_weight))}} % || {{decNetVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(incNet)?increaseNet():decreaseNet()" class="no-shadow q-ma-sm float-right" :label="(incNet)? $t('wallet.increase'): $t('wallet.decrease')" />
              <q-btn color="dark" @click="netSlider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </div>
  <div class="row xl-hide">
    <div class="col-12">
      <q-card class="bg-dark2 relative-position shadow-5">
        <q-btn dense @click="ramslider = !ramslider" flat class="float-right" icon="icon-topmenu-6">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_ram_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="positive" style="font-size:48px;" name="icon-ui-13" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.RAM') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.ram.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.ram.raw.used / 1024).toFixed(2)}} / {{(getAccountResources.ram.raw.available / 1024).toFixed(2)}} {{$t('wallet.KB')}}</span>
            <div v-if="ramslider">
              <q-slider v-if="buyRam" color="positive" v-model="buyRamVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="sellRamVal" :min="0" :max="Math.round(getAccountResources.ram.raw.available)" :step="1" />
            </div>
            <q-slider v-else color="positive" readonly v-model="getAccountResources.ram.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="ramslider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="buyRam" :toggle-color="(buyRam)? 'positive': 'negative'" :options="[{label: $t('wallet.buy'), value: true},{label: $t('wallet.sell'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="buyRam">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{getPercentageOf(((buyRamVal - (buyRamVal * 0.05)) / ramPrice), getAccountResources.ram.raw.available)}} % || ~{{(((buyRamVal - (buyRamVal * 0.05)) / ramPrice) / 1024).toFixed(2)}}
                    {{$t('wallet.KB')}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{getPercentageOf(sellRamVal, getAccountResources.ram.raw.available)}} % || ~{{(sellRamVal / 1024).toFixed(2)}} {{$t('wallet.KB')}}
                  </div>
                </div>
              </div>
              <q-item-separator />
              <div class="row">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1 text-no-wrap">{{$t('wallet.ram_price_per_kb')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{(ramPrice * 1024).toFixed(6)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="buyRam">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.total_cost')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{(buyRamVal).toFixed(transferMainAmountDecimals)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.total_refund')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">~{{((ramPrice * sellRamVal) - ((ramPrice * sellRamVal) * 0.05)).toFixed(transferMainAmountDecimals)}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(buyRam)?buyRamFunc():sellRam()" class="no-shadow q-ma-sm float-right" :label="(buyRam)? $t('wallet.buy'): $t('wallet.sell')" />
              <q-btn color="dark" @click="ramslider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
            <LoadingSpinner :visible="!ramPrice" :text="$t('wallet.loading')" />
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="col-12">
      <q-card class="bg-dark2 relative-position shadow-5">
        <q-btn dense @click="cpuSlider = !cpuSlider" flat class="float-right" icon="icon-topmenu-6">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_cpu_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="blue" style="font-size:48px;" name="icon-ui-9" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.CPU') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.cpu.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.cpu.raw.used).toFixed(2)}} / {{(getAccountResources.cpu.raw.available).toFixed(2)}} {{$t('wallet.cycles')}}</span>
            <div v-if="cpuSlider">
              <q-slider v-if="incCpu" color="positive" v-model="incCpuVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="decCpuVal" :min="0" :max="parseFloat(getAccount.self_delegated_bandwidth.cpu_weight)" :step="0.0001" />
            </div>
            <q-slider v-else color="blue" readonly v-model="getAccountResources.cpu.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="cpuSlider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="incCpu" :toggle-color="(incCpu)? 'positive': 'negative'" :options="[{label: $t('wallet.increase'), value: true},{label: $t('wallet.decrease'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="incCpu">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(incCpuVal, parseFloat(getAccount.self_delegated_bandwidth.cpu_weight))}} % || {{incCpuVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(decCpuVal, parseFloat(getAccount.self_delegated_bandwidth.cpu_weight))}} % || {{decCpuVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(incCpu)?increaseCpu():decreaseCpu()" class="no-shadow q-ma-sm float-right" :label="(incCpu)? $t('wallet.increase'): $t('wallet.decrease')" />
              <q-btn color="dark" @click="cpuSlider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="col-12">
      <q-card class="bg-dark2 relative-position shadow-5">
        <q-btn dense @click="netSlider = !netSlider" flat class="float-right" icon="icon-topmenu-6">
          <q-tooltip>
            {{$t('wallet.toggle_adjust_net_allocation')}}
          </q-tooltip>
        </q-btn>
        <q-item class="q-pr-none q-py-none">
          <q-item-side>
            <q-item-tile icon>
              <q-icon color="red" style="font-size:48px;" name="icon-ui-14" />
            </q-item-tile>
          </q-item-side>
          <q-item-main class="q-pa-sm no-margin">
            <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t('wallet.network') }}</span>
            <p class="no-margin q-pl-sm">{{getAccountResources.net.available}} % {{ $t('wallet.remaining') }}</p>
            <span class="text-dimwhite q-pl-sm q-body-1">{{$t('wallet.used')}}: {{(getAccountResources.net.raw.used).toFixed(2)}} / {{(getAccountResources.net.raw.available).toFixed(2)}} {{$t('wallet.bytes')}}</span>
            <div v-if="netSlider">
              <q-slider v-if="incNet" color="positive" v-model="incNetVal" :min="0" :max="getMainCurrencyBalance" :step="0.0001" />
              <q-slider v-else color="negative" v-model="decNetVal" :min="0" :max="parseFloat(getAccount.self_delegated_bandwidth.net_weight)" :step="0.0001" />
            </div>
            <q-slider v-else color="red" readonly v-model="getAccountResources.net.available" :min="0" :max="100" :step="1" />
          </q-item-main>
        </q-item>
        <q-slide-transition>
          <div v-show="netSlider" style="overflow:hidden;">
            <q-list class="q-mx-sm no-padding" dark no-border>
              <q-item-separator />
              <div class="row">
                <div class="col">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.action_type')}}:</div>
                </div>
                <div class="col">
                  <q-btn-toggle dense size="sm" dark class="no-shadow float-right" v-model="incNet" :toggle-color="(incNet)? 'positive': 'negative'" :options="[{label: $t('wallet.increase'), value: true},{label: $t('wallet.decrease'), value: false}]" />
                </div>
              </div>
              <q-item-separator />
              <div class="row" v-if="incNet">
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.increase_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(incNetVal, parseFloat(getAccount.self_delegated_bandwidth.net_weight))}} % || {{incNetVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-auto">
                  <div class="text-dimwhite q-body-1">{{$t('wallet.decrease_by')}}:</div>
                </div>
                <div class="col text-right">
                  <div class="q-body-1">{{getPercentageOf(decNetVal, parseFloat(getAccount.self_delegated_bandwidth.net_weight))}} % || {{decNetVal}} {{mainCurrencyName}}</div>
                </div>
              </div>
              <q-item-separator />
              <q-btn color="primary" @click="(incNet)?increaseNet():decreaseNet()" class="no-shadow q-ma-sm float-right" :label="(incNet)? $t('wallet.increase'): $t('wallet.decrease')" />
              <q-btn color="dark" @click="netSlider = false" class="no-shadow q-ma-sm  float-right" :label="$t('wallet.cancel')" />
            </q-list>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </div>
  <div class="row q-mt-xl q-px-md md-hide sm-hide xs-hide">
    <div class="col-12">
      <h4 class="q-display-1 q-mb-sm q-mt-none text-weight-thin">{{ $t("wallet.send_tokens") }}</h4>
    </div>
  </div>
  <div class="row q-px-md lg-hide xl-hide">
    <div class="col-12">
      <h4 class="q-display-1 q-mb-sm q-mt-none text-weight-thin">{{ $t("wallet.send_tokens") }}</h4>
    </div>
  </div>
  <div class="row q-px-md">
    <div class="col-12 bg-dark2">
      <div class="row gutter-xs">
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.token_selection_and_quantity') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field class="q-mb-md" :label="$t('wallet.select_token_to_send')" label-width="12" dark>
                <q-select color="p-light" dark :placeholder="$t('wallet.select_from_list')" :options="[
                  { label: mainCurrencyName,  value: mainCurrencyName },
                  { label: tokenName, value: tokenName }
                ]"
                  v-model="tokenSelection" />
              </q-field>
              <q-field :label="$t('wallet.quantity_to_send')" :error="transferAmountError" :error-label="transferAmountErrorText" label-width="12">
                <q-input color="p-light" :error="transferAmountError" placeholder="0.0000" v-model="transferAmount" type="number" :decimals="(tokenSelection === mainCurrencyName)?transferMainAmountDecimals : transferAmountDecimals" dark />
              </q-field>
            </q-card-main>
          </q-card>
        </div>
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.destination') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field class="q-mb-md relative-position" :label="$t('wallet.input_a_destination_account')" :error="transferToError" :error-label="transferToErrorText" label-width="12">
                <q-checkbox color="white" left-label class="float-right" :label="$t('wallet.add_to_addressbook')" v-model="addContact" />
                <q-input color="p-light" :error="transferToError" dark v-model="transferTo">
                  <q-autocomplete :min-characters="0" :max-results="999999" :static-data="{field: 'value',list: getContacts}" />
                </q-input>
              </q-field>
              <div class="row">

                <!--<div class="col-lg-12 col-xl-8">
                  <q-field class="q-mb-md" :label="$t('wallet.or_select_address_book')" label-width="12" dark>
                    <q-select dark :placeholder="$t('wallet.select_from_list')" :options="getContacts" v-model="transferTo" />
                  </q-field>
                </div>-->
                <div class="col-lg-12 col-xl-4 text-right">
                  <q-btn @click="manageAddressbook = true" no-caps dense class="q-mt-lg" flat color="p-light">{{ $t('wallet.manage_addressbook') }}</q-btn>
                </div>
              </div>
            </q-card-main>
          </q-card>
        </div>
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.memo') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field dark label-width="12">
                <q-input inverted rows="8" color="dark" type="textarea" v-model="transferMemo" dark />
              </q-field>
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div class="row q-pa-xs">
        <div class="col-12 relative-postition">
          <q-btn color="primary" @click="transfer()" :disabled="badTransferTo || transferAmountError || !tokenSelection" class="q-ma-md float-right no-shadow" :label="$t('wallet.transfer_tokens')" />
        </div>
      </div>
    </div>
  </div>
  <q-modal class="relative-position" v-model="manageAddressbook" content-classes="fit bg-dark2" :content-css="{maxWidth: '300px', maxHeight: '610px'}">
    <q-scroll-area style="width: 100%; height: 90%;">
      <q-list class="relative-position q-pa-sm" dark no-border separator link dense>
        <q-btn class="float-right no-shadow" dense flat size="lg" icon="icon-ui-8" color="white" @click="manageAddressbook = false" />
        <q-list-header class="q-title">{{ $t('wallet.addressbook') }}</q-list-header>
        <q-search color="p-light" class="q-mx-sm q-mt-sm" dark v-model="contactSearch" />
        <div class="row">
          <div class="col-12 text-center q-pa-sm relative-position">
            <q-btn v-if="!addContactSlide" class="no-shadow" :label="$t('wallet.add')" icon="icon-plus" color="primary" @click="addContactSlide = true" />
          </div>
        </div>
        <q-slide-transition>
          <q-card v-show="addContactSlide" class="bg-dark q-pa-sm">
            <q-card-title class="no-padding">
              <q-btn class="no-shadow float-right" icon="icon-ui-8" color="primary" @click="addContactSlide = false" />
            </q-card-title>
            <q-card-main>
              <q-field :label="$t('wallet.account_name')"label-width="12">
                <q-input color="p-light" v-model="accountToAdd" type="text"  dark />
              </q-field>
            </q-card-main>
            <q-card-actions align="center">
              <q-btn class="no-shadow" :label="$t('wallet.confirm')" color="primary" @click="addToAddressbook();addContactSlide = false" />
            </q-card-actions>
          </q-card>
        </q-slide-transition>
        <q-item v-for="(contact, index) in filterContacts" :key="index">
          <q-item-main @click.native="transferTo = String(contact.value); manageAddressbook = false" :label="String(contact.value)" />
          <q-item-side right>
            <q-btn icon="icon-ui-8" flat color="negative" @click="removeContact(contact.value);" />
          </q-item-side>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-modal>
  <Transaction ref="Transaction" v-on:done="lookupTokenBalance()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Wallet',
  components: {
    Transaction,
    LoadingSpinner
    //TransferHistory
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      tokenSelection: '',
      tokenName: this.$configFile.network.tokenContract.token,
      mainCurrencyName: this.$configFile.network.mainCurrencyContract.token,
      transferTo: '',
      transferToError: false,
      transferToErrorText: '',
      transferAmount: 0,
      transferAmountError: false,
      transferAmountErrorText: '',
      transferAmountDecimals: this.$configFile.network.tokenContract.decimals,
      transferMainAmountError: false,
      transferMainAmountErrorText: '',
      transferMainAmount: 0,
      transferMainAmountDecimals: this.$configFile.network.mainCurrencyContract.decimals,
      transferMemo: '',
      badTransferAmount: true,
      badTransferMainAmount: true,
      badTransferTo: true,
      showValue: false,
      total: 0,
      addContact: true,
      ramslider: false,
      ramPrice: 0,
      ramPriceUpdateInterval: null,
      buyRam: true,
      sellRamVal: 0,
      buyRamVal: 0,
      cpuSlider: false,
      incCpu: true,
      decCpuVal: 0,
      incCpuVal: 0,
      netSlider: false,
      incNet: true,
      decNetVal: 0,
      incNetVal: 0,
      manageAddressbook: false,
      contactSearch: '',
      addContactSlide: false,
      accountToAdd: ''
    }
  },
  computed: {
    filterContacts() {
      if (this.contactSearch.length > 0 && this.getContacts.length > 0) {
        let retArray = []
        for (let i = 0; i < this.getContacts.length; i++) {
          if (String(this.getContacts[i].value).includes(String(this.contactSearch))) {
            retArray.push(this.getContacts[i])
          }
        }
        return retArray
      } else {
        return this.getContacts
      }
    },
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getTokenBalance: 'account/getTokenBalance',
      getAccount: 'account/getAccount',
      getMainCurrencyBalance: 'account/getMainCurrencyBalance',
      getAccountResources: 'account/getAccountResources',
      getContacts: 'account/getContacts'
    }),
    getMainCurrencyStaked() {
      let mainCurrencyStaked = 0
      let res = this.getAccount.self_delegated_bandwidth
      if (res) {
        mainCurrencyStaked = (parseFloat(res.net_weight) + parseFloat(res.cpu_weight))
      }
      return mainCurrencyStaked
    }
  },
  mounted() {
    if (this.getAccountName) {
      this.lookupTokenBalance()
      this.getTokenPrices()
    }
  },
  methods: {
    addToAddressbook() {
      this.$store.commit('account/ADD_CONTACT', this.accountToAdd)
    },
    removeContact(name) {
      this.$store.commit('account/REMOVE_CONTACT', name)
    },
    getPercentageOf(val, max) {
      return parseFloat(((val / max) * 100).toFixed(3))
    },
    async getPriceOf(name) {
      try {
        let price = await this.$axios.get('https://api.coingecko.com/api/v3/coins/' + name.toLowerCase() + '?localization=false')
        return price.data.market_data.current_price.usd
      } catch (error) {
        throw error
      }
    },
    async getTokenPrices() {
      try {
        let mainP = await this.getPriceOf(this.mainCurrencyName)
        let tokenP = await this.getPriceOf(this.tokenName)
        this.total = ((mainP * (this.getMainCurrencyBalance + this.getMainCurrencyStaked)) + (tokenP * this.getTokenBalance)).toFixed(3)
        this.showValue = true
      } catch (error) {
        this.showValue = false
      }
    },
    increaseCpu() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'delegatebw', {
        from: this.getAccountName,
        receiver: this.getAccountName,
        stake_net_quantity: (0).toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        stake_cpu_quantity: this.incCpuVal.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        transfer: 0
      })
    },
    decreaseCpu() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'undelegatebw', {
        from: this.getAccountName,
        receiver: this.getAccountName,
        unstake_net_quantity: (0).toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        unstake_cpu_quantity: this.decCpuVal.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token
      })
    },
    increaseNet() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'delegatebw', {
        from: this.getAccountName,
        receiver: this.getAccountName,
        stake_net_quantity: this.incNetVal.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        stake_cpu_quantity: (0).toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        transfer: 0
      })
    },
    decreaseNet() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'undelegatebw', {
        from: this.getAccountName,
        receiver: this.getAccountName,
        unstake_net_quantity: this.decNetVal.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        unstake_cpu_quantity: (0).toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token
      })
    },
    buyRamFunc() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'buyram', {
        payer: this.getAccountName,
        receiver: this.getAccountName,
        quant: this.buyRamVal.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token
      })
    },
    sellRam() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.systemContract.name, 'sellram', {
        account: this.getAccountName,
        bytes: this.sellRamVal
      })
    },
    transfer() {
      if (this.addContact) {
        this.$store.commit('account/ADD_CONTACT', this.transferTo)
      }
      if (this.tokenSelection === this.tokenName) {
        this.$refs.Transaction.newTransaction(this.$configFile.network.tokenContract.name, 'transfer', {
          from: this.getAccountName,
          to: this.transferTo,
          quantity: this.transferAmount.toFixed(this.$configFile.network.tokenContract.decimals) + ' ' + this.$configFile.network.tokenContract.token,
          memo: this.transferMemo
        })
      } else {
        this.$refs.Transaction.newTransaction(this.$configFile.network.mainCurrencyContract.name, 'transfer', {
          from: this.getAccountName,
          to: this.transferTo,
          quantity: this.transferAmount.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
          memo: this.transferMemo
        })
      }
    },
    async lookupTokenBalance() {
      try {
        this.loading = true
        this.loadingText = 'Looking up balances...'
        const balance = this.$store.dispatch('api/getTokenContractBalance')
        const mainBalance = this.$store.dispatch('api/getMainCurrencyBalance')
        const acc = this.$store.dispatch('api/updateAccountInfo')
        let race = await Promise.race([balance, mainBalance, acc])
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$store.commit('api/NOTIFY', {
          icon: 'error',
          color: 'red',
          message: 'Error: ' + err.message,
          detail: ''
        })
      }
    },
    async getRamPrice() {
      try {
        const price = await this.$store.dispatch('api/getRamPrice')
        this.ramPrice = price.quote.balance.slice(0, -4) / price.base.balance.slice(0, -4)
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    ramslider(val) {
      if (val && !this.ramPriceUpdateInterval) {
        this.getRamPrice()
        this.ramPriceUpdateInterval = setInterval(this.getRamPrice, 10000)
        this.sellRamVal = this.getAccountResources.ram.raw.available
      } else {
        clearInterval(this.ramPriceUpdateInterval)
        this.ramPriceUpdateInterval = null
      }
    },
    transferAmount(val) {
      if (this.tokenSelection === this.tokenName) {
        if (val > this.getTokenBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
          this.transferAmountError = true
          this.transferAmountErrorText = 'Invalid amount'
        } else {
          this.transferAmountError = false
        }
      } else if (this.tokenSelection === this.mainCurrencyName) {
        if (val > this.getMainCurrencyBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
          this.transferAmountError = true
          this.transferAmountErrorText = 'Invalid amount'
        } else {
          this.transferAmountError = false
        }
      } else {
        this.transferAmountError = false
      }
    },
    transferTo(val) {
      if (!/(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(val)) {
        this.transferToError = true
        this.transferToErrorText = 'Invalid account name'
        this.badTransferTo = true
      } else {
        this.transferToError = false
        this.transferToErrorText = ''
        this.badTransferTo = false
      }
    }
  }
}
</script>
<style lang="stylus">
@import '~variables'

.gradient-bg-primary
  background-image linear-gradient(to right, $primary, $p-light)

.blur-details
  background rgba(255, 255, 255, 0.1)
</style>
