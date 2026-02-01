const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 10,
    },
    title: {
        type: String,
        trim: true,
        maxLength: [30, 'Title cannon exceed 30 characters'],
    },
    content: {
        type: String,
        trim: true,
        maxlength: [2000, 'Review cannot exceed 2000 characters']
    },
    pros: [{
        type: String,
        trim: true
    }],
    cons: [{
        type: String,
        trim: true
    }],
    recommended: {
        type: Boolean,
        default: true,
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

reviewSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);