import Vue from 'vue'
import Influx from '../src/components/Influx.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Influx),
}).$mount('#app')
