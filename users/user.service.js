const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    uploadImage,
    downloadImage,
    update,
    delete: _delete
};

async function authenticate({ userMail, password }) {
    const user = await User.findOne({ userMail });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ userMail: userParam.userMail })) {
        throw 'Mail "' + userParam.userMail + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
        ...user.toJSON(),
        token
    };
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.userMail !== userParam.userMail && await User.findOne({ userMail: userParam.userMail })) {
        throw 'User mail "' + userParam.userMail + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function uploadImage(imageParams) {    
    const user = await User.findById(imageParams.id);
    if (!user) throw 'User not found!'
    user.image = {
        data: imageParams.image.data,
        uploadDate: imageParams.image.createdDate,
    }
    await user.save();
}

async function downloadImage(id) {
    const user = await User.findById(id);
    if (!user) throw 'User not found!'
    if (!user.image) throw 'User contains no image!'
    return user.image;
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}