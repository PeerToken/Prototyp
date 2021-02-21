const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: ObjectId, required: true},
    postId: {type: ObjectId, required: true},
    createdDate: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Gems', schema);