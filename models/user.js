const moongose = require('mongoose');
const Schema = moongose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false
    },
    connectionLogs: {
        type: Array,
        default: []
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = moongose.model('user', UserSchema);