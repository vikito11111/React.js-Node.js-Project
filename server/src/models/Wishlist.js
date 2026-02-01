const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

wishlistSchema.index({ user: 1, game: 1 }, { unique: true });

modules.exports = mongoose.model('Wishlist', wishlistSchema);