const SerialPort = require('serialport')
const debug = require('debug')('signalk-vedirect-parser')
let port = null

exports.open = function openSerialConnection (device, parser) {
  if (port !== null) {
    try {
      port.close()
      port = null
    } catch (e) {}
  }

  port = new SerialPort(device, { baudRate: 19200, buffersize: 1024 }) // @NOTE FT: should this be configurable?

  port.on('data', chunk => {
    // Chunk is a node.js Buffer
    parser.addChunk(chunk)
    port.flush();
  })

  // @NOTE FT: should we implement reconenct/back-off code like TCP wrappers?
  //        I assume the serial port only closes if the physical line is broken/disconnected?

  port.on('error', err => {
    debug('SerialPort error: ' + err.message)
  })
}

exports.close = function (device) {
  if (port !== null) {
    try {
      port.close()
      port = null
    } catch (e) {}
  }
}
