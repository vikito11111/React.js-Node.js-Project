const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['not_started', 'playing', 'completed', 'dropped', 'on_hold'],
        default: 'not_started',
    },
    progress: {
        hoursPlayed: {
            type: Number,
            default: 0,
            min: 0,
    }},
    personalRating: {
        type: Number,
        min: 1,
        max: 10,
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    isFinite: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true 
});

librarySchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Library', librarySchema);