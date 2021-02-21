const { ObjectId, Long } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    text: String,
    image: {
        data: String,
        description: String,
    },
    creator: {
        id: {type: Object, required: true},
        image: String,
        name: String
    },
    likes: Number,
    createdDate: {type: Date, default: Date.now}
});


module.exports = mongoose.model('NewsFeed', schema);