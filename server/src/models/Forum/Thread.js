const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Thread title is required'],
        trim: true,
        maxlength: [50, 'Title cannot exceed 50 characters'],
    },
    content: {
        type: String,
        required: [true, 'Thread content is required'],
        trim: true,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Thread', threadSchema);