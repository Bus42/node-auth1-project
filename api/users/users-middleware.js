const users = require('./users-model');

async function isValidID(req, res, next) {
    try {
        const user = await users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid ID' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user' });
    }
}

module.exports = {
    isValidID,
};
