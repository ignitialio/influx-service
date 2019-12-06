const Service = require('@ignitial/iio-services').Service
const config = require('./config')

class Influx extends Service {
  constructor(options) {
    super(options)
  }

  // provides some services here
  // ***************************************************************************
  oneGetServiceMethod(args) {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      resolve({ somedata: 'some value', args: args })
    })
  }

  onePostServiceMethod(args) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      resolve({ somedata: 'some value', args: args })
    })
  }
}

// instantiate service with its configuration
const influx = new Influx(config)

influx._init().then(() => {
  console.log('service [' + influx.name + '] initialization done with options ',
    influx._options)
}).catch(err => {
  console.error('initialization failed', err)
  process.exit(1)
})
