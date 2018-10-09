<template>
<q-page class="text-white q-ma-lg">
  <h4 class="q-display-1 q-mt-none q-mb-md">Welcome back</h4>
  <div class="row gutter-sm q-mb-lg">
    <div class="col-sm-12 col-md-4" style="min-height:96px;">
      <DashboardButton to="/wallet" text="Make Transfer" icon="icon-type-12" />
    </div>
    <div class="col-sm-12 col-md-4" style="min-height:96px;">
      <DashboardButton text="Vote for Custodians" icon="icon-ui-3" />
    </div>
    <div class="col-sm-12 col-md-4" style="min-height:96px;">
      <DashboardButton url="https://explorer.eosdac.io/transfers/" text="Token Explorer" icon="icon-menu-4" />
    </div>
  </div>

  <div class="row">
    <div class="col-sm-12">
      <q-card dark flat class="bg-dark2">
        <div class="row">
          <div class="col-sm-12 col-md-4 q-pa-xs">
            <div style="border-right: 2px solid rgba(255, 255, 255, 0.3);">
              <div class="row">
                <div class="col-lg-12 col-xl-3">
              <img class="q-ma-lg" style="max-height: 80px;" src="statics/quasar-logo.png">
              </div>
              <div class="col-lg-12 col-xl-9">
              <q-card flat>
                <q-card-title>
                  <h4 class="q-ma-none">My Votes</h4>
                  <q-icon color="grey" slot="right" name="icon-topmenu-6" />
                </q-card-title>
                <q-card-main>
                  <q-list dense no-border>
                    <q-item v-for="i in 4" :key="i">
                      <q-item-side>
                        <q-item-tile avatar>
                          <img src="statics/quasar-logo.png">
                        </q-item-tile>
                      </q-item-side>
                      <q-item-main>
                        <h6 class="q-my-none">Rsdfdsfsd</h6>
                      </q-item-main>
                    </q-item>
                    <q-item-separator />
                  </q-list>
                </q-card-main>
              </q-card>
              </div>
              </div>
            </div>
          </div>

          <div class="col-sm-12 col-md-4 q-pa-xs">
            <div style="border-right: 2px solid rgba(255, 255, 255, 0.3);">
              <q-card flat>
                <q-card-title>
                  <h4 class="q-ma-none">My Votes</h4>
                  <q-icon color="grey" slot="right" name="icon-topmenu-6" />
                </q-card-title>
                <q-card-main>
                  <q-list dense no-border>
                    <q-item v-for="i in 4" :key="i">
                      <q-item-side>
                        <q-item-tile avatar>
                          <img src="statics/quasar-logo.png">
                        </q-item-tile>
                      </q-item-side>
                      <q-item-main>
                        <h6 class="q-my-none">Rsdfdsfsd</h6>
                      </q-item-main>
                    </q-item>
                    <q-item-separator />
                  </q-list>
                </q-card-main>
              </q-card>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</q-page>
</template>

<script>
import DashboardButton from 'components/dashboard-button'
export default {
  name: 'Dashboard',
  components: {
    DashboardButton
  }
}
</script>

<style>
</style>
