const db = require('_helpers/db');
const Gems = db.Gems;

module.exports = {
    getAllGemsForUserId,
}

async function getAllGemsForUserId(id) {
    const gems = await Gems.find({userId: id});
    if (!gems) throw 'No Gems for given id'

    return gems;
}