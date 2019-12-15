import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import VueMapbox from 'vue-mapbox'
import Mapbox from 'mapbox-gl'
import vuetify from './plugins/vuetify'
import { VueCsvImportPlugin } from 'vue-csv-import'

Vue.config.productionTip = false

Vue.use(VueMapbox, { mapboxgl: Mapbox })
Vue.use(VueCsvImportPlugin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
