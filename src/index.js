import Influx from './components/Influx.vue'

// function to be called when service loaded into web app:
// naming rule: iios_<service_unique_name>
//
global.iios_influx = function(Vue) {
  // Warning: component name must be globally unique in your host app
  Vue.component('influx', Influx)

  let register = () => {
    // EXEAMPLE
    Vue.prototype.$services.emit('app:menu:add', [
      {
        path: '/service-influx',
        title: 'Timeseries',
        svgIcon: '$$service(influx)/assets/influx.svg',
        section: 'Services',
        anonymousAccess: true,
        hideIfLogged: false,
        route: {
          name: 'Influx',
          path: '/service-influx',
          component: Influx
        }
      }
    ])

    let onServiceDestroy = () => {
      Vue.prototype.$services.emit('app:menu:remove', [{
        path: '/service-influx'
      }])

      Vue.prototype.$services.emit('service:destroy:influx:done')
    }

    Vue.prototype.$services.once('service:destroy:influx', onServiceDestroy)
  }

  if (Vue.prototype.$services.appReady) {
    register()
  } else {
    Vue.prototype.$services.once('app:ready', register)
  }
}
