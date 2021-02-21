const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;
const connect = mongoose.connection;

module.exports = {
    User: require('../users/user.model'),
    NewsFeed: require('../newsFeed/newsFeed.model'),
    Gems: require('../gems/gems.model'),
    connect,
};