const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userMail: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    fullName: { type: String, required: true },
    description: String,
    image: {
        data: String,
        uploadDate: String,
    },
    likedPost: [{type: ObjectID}],
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);