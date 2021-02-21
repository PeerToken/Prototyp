const db = require('_helpers/db');
const { post } = require('./newsFeed.controller');
const NewsFeed = db.NewsFeed;
const User = db.User;
const Gems = db.Gems;

module.exports = {
    create,
    getSpecificLimit,
    like,
    dislike,
    deletePost,
};

async function create(newsFeedParam) {
    const user = await User.findById(newsFeedParam.creator.id);
    if (!user) throw 'User not found'

    const newsFeed = new NewsFeed(newsFeedParam);

    await newsFeed.save();
}

async function getSpecificLimit(skipAmount, amount) {
    var newsFeed;
    if (skipAmount == 0) {
        newsFeed = await NewsFeed.find().sort({createdDate: 'desc'}).limit(parseInt(amount));
    } else {
        newsFeed = await NewsFeed.find().sort({createdDate: 'desc'}).skip(parseInt(skipAmount)).limit(parseInt(amount));
    }

    for (i = 0; i < newsFeed.length;  i++) {
        user = await User.findById(newsFeed[i].creator.id);
        if (user) {
            newsFeed[i].creator.image = user.image.data;
            newsFeed[i].creator.name = user.fullName;
        }
    }
    return newsFeed;
}

async function like(userId, postId, creatorId) {
    const newsFeed = await NewsFeed.findById(postId);
    if (!newsFeed) throw 'News feed not found!'
    newsFeed.likes += 1;
    await newsFeed.save();

    const user = await User.findById(userId);
    if (!user) throw 'User not found!'

    user.likedPost.push(postId);
    await user.save();

    if (userId === creatorId) {
        return postId;
    }

    const gems = await Gems.findOne({userId: creatorId, postId: postId});
    if (!gems) {
        const newGem = new Gems({userId: creatorId, postId: postId});
        await newGem.save();
    }

    return postId;
}

async function dislike(userId, postId) {
    const newsFeed = await NewsFeed.findById(postId);
    if (!newsFeed) throw 'News feed not found!'
    newsFeed.likes -= 1;
    await newsFeed.save();

    const user = await User.findById(userId);
    if (!user) throw 'User not found!'

    var index = user.likedPost.indexOf(postId);
    if (index > -1) {
        user.likedPost.splice(index, 1);
    }

    await user.save();
    return postId;
}

async function deletePost(id) {
    const newsFeed = await NewsFeed.findById(id);
    if (!newsFeed) throw 'News feed not found!'
    newsFeed.remove();

    for await (const doc of User.find({likedPost: id})) {
        doc.likedPost.pull(id);
        doc.save();
    }

    return id;
}