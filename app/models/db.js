var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db.db('ZPX')
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.getCollection = function(collection) {
  return state.db.collection(collection)
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}

// // grab the mongoose module
// var mongoose = require('mongoose');

// // define our nerd model
// // module.exports allows us to pass this to other files when it is called
// module.exports = mongoose.model('Nerd', {
// 	name : {type : String, default: ''}
// });
