const Influx = require('influx')
const _ = require('lodash')

const Gateway = require('@ignitial/iio-services').Gateway
const config = require('./config')

class Influx extends Gateway {
  constructor(options) {
    super(options)

    this._measurement = 'measurements'
    this._defaultTag = 'serie'

    this._influxClient = new Influx.InfluxDB(this._options.influx)
  }

  // set configuration and create client
  // ***************************************************************************
  setConfig(options) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      try {
        this._options.influx = options

        this._influxClient = new Influx.InfluxDB(this._options.influx)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // set default measurement name
  // ***************************************************************************
  setMeasurement(name) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      this._measurement = name
      resolve()
    })
  }

  // set default tag name
  // ***************************************************************************
  setMeasurement(name) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      this._defaultTag = name
      resolve()
    })
  }

  // set default database
  // ***************************************************************************
  setDatabase(name) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      this._options.influx.database = name
      resolve()
    })
  }

  // write a set of points
  // - must fit the following Influx format:
  // [
  //   {
  //     measurement: <string>,
  //     tags: { tag1: ..., tag2: ... },
  //     fields: { value1: ..., value2: ..., ... },
  //     timestamp: <timestamp>
  //   },
  //  ...
  // ]
  //
  // - if timestamp is ignored, it taks the value of actual write
  // ***************************************************************************
  writePoints(points) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      this._influxClient.writePoints(points).then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  }

  // put one or several measurements into the current database taking some defaults.
  // - format must be:
  // [
  //   {
  //     tags: { tag1: ..., tag2: ... },
  //     fields: {
  //        value1: ...,
  //        ...
  //     },
  //     timestamp: <timestamp>
  //   },
  //  ...
  // ]
  //
  // - if timestamp is ignored, it takes the value of actual write
  // ***************************************************************************
  writeMeasurement(measurement, points) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      this._influxClient.writeMeasurement(measurement, points).then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  }

  // write to default measurement and tag
  //
  // - format must be:
  // [
  //   {
  //     name: <string>,
  //     value: <object|number>,
  //     timestamp: <timestamp>
  //   },
  //  ...
  // ]
  //
  // - could be an object instead of an array for single measurement
  // - if timestamp is ignored, it taks the value of actual write
  // ***************************************************************************
  write(points) {
    /* @_POST_ */
    return new Promise((resolve, reject) => {
      points = _.map(points, e => {
        let fields = e.value
        if (typeof e.value !== 'object') {
          fields = {
            value: e.value
          }
        }

        return {
          tags: {
            name: this._defaultTag,
          },
          fields: fields,
          timestamp: e.timestamp
        }
      })

      this._influxClient.writeMeasurement(this._measurement, points).then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  }

  // get series names
  // options = {
  //   measurement: <string>
  //   db: <string>
  // }
  // ***************************************************************************
  getSeries(options) {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      this._influxClient.getSeries(options).then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  }

  // get measurements names
  // options = {
  //   measurement: <string>
  //   db: <string>
  // }
  // ***************************************************************************
  getMeasurements() {
    /* @_GET_ */
    return new Promise((resolve, reject) => {
      this._influxClient.getMeasurements(this._options.influx.database).then(() => {
        resolve()
      }).catch(err => reject(err))
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
