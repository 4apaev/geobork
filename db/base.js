'use strict';

const { MongoClient, ObjectID } = require('mongodb');

module.exports = class DB {
  constructor({ name, limit = 100 }) {
    this.LIMIT = limit
    this.NAME = name
  }

  get collection() {
      return this.db.collection(this.NAME);
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

  list(query, skip, limit) {
    const cursor = this.collection
                      .find(query)
                      .skip(0|skip)
                      .limit(0|limit||this.LIMIT);
    return cursor.count()
                  .then(total => cursor.toArray().then(result => ({ result, total })))
                  .catch(DB.fail);
  }

  find(id) {
    return this.collection
              .findOne(ObjectID(id))
              .then(DB.wrap)
              .catch(DB.fail);
  }

  add(item) {
    item.updated = Date.now()
    return this.collection
              .insertOne(item)
              .then(DB.getRes)
              .catch(DB.fail);
  }

  update(query, item) {
    item.updated = Date.now()
    return this.collection.updateOne(query, { $set: item })
              .then(DB.getRes)
              .catch(DB.fail);
  }

  static getRes({ ops }) {
    return DB.wrap(ops[ 0 ])
  }

  static wrap(result) {
    return { result }
  }

  static fail(error) {
    const { message, stack, name } = error
    return { error: { message, stack, name } }
  }
}