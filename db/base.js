'use strict';

const { MongoClient, ObjectID } = require('mongodb');

module.exports = class DB {
  constructor({ limit = 100 }) {
    this.LIMIT = limit
  }

  connect(host) {
    return MongoClient.connect(host).then(db => {
      this.db = db
      return this
    })
  }

  index(obj, ...names) {
    const n = names.length,
          buf = Array(n);
    for(let i = 0; i < n; i++)
      buf[ i ] = this.db.collection(names[ i ])
                        .createIndex(obj);
    return Promise.all(buf)
  }

  list(name, query, skip, limit) {
    const col = this.db.collection(name),
          cursor = col.find(query)
                      .skip(0|skip)
                      .limit(0|limit||this.LIMIT);
    return cursor.count()
                 .then(total => cursor.toArray()
                                      .then(result => ({ result, total })))
                 .catch(DB.fail);
  }

  find(name, id) {
    const col = this.db.collection(name);
    return col.findOne(ObjectID(id))
              .then(DB.wrap)
              .catch(DB.fail);
  }

  add(name, item) {
    item.updated = Date.now()
    const col = this.db.collection(name);
    return col.insertOne(item)
              .then(DB.wrap)
              .catch(DB.fail);
  }

  static wrap(result) {
    return { result }
  }

  static fail(error) {
    const { message, stack, name } = error
    return { error: { message, stack, name } }
  }
}