'use strict'

const TransformStream = require('through2').obj

module.exports = transformStore

function transformStore (syncTransformFn) {
  return TransformStream((state, _encoding, cb) => {
    try {
      const newState = syncTransformFn(state)
      cb(null, newState)
      return undefined
    } catch (err) {
      cb(err)
      return undefined
    }
  })
}
