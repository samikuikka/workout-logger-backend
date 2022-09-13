const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports.create = async ({username, password, email}) => {
     
    const saltrounds = 10;
    const passwordHash = await bcrypt.hash(password, saltrounds);

    const user = new User({
        username: username,
        passwordHash,
        email: email
    });
    const savedUser = await user.save();
    return savedUser;
}