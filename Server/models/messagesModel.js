const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: {
        type: String,
        default: "",

    },
    imageUrl: {
        type: String,
        default: "",

    },
    videoUrl: {
        type: String,
        default: "",

    },
    seen: {
        type: Boolean,
        default: false,
    },
    msgByUserId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
