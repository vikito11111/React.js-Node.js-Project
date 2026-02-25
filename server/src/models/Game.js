const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Game title is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    shortDescription: {
        type: String,
        trim: true, 
    },
    price: {
        type: Number,
        required: [true, 'Game price is required'],
        min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative'],
    },
    images: {
        cover: String,
        banner: String,
        screenshots: [String],
    },
    genre: [{
        type: String,
        trim: true,
    }],
    tags: [{
        type: String,
        trim: true,
    }],
    developer: {
        type: String,
        trim: true,
    },
    publisher: {
        type: String,
        trim: true,
    },
    releaseDate: {
        type: Date,
    },
    platforms: [{
        type: String,
        trim: true,
    }],
    systemRequirements: {
        minimum: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String,
        },
        recommended: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String,
        },
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        count: {
            type: Number,
            default: 0,
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

gameSchema.pre('save', function() {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

module.exports = mongoose.model('Game', gameSchema);