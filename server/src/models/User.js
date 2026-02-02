const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const specialCouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discountPercent: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    validForGames: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }],
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['guest', 'user', 'superuser', 'admin'],
        default: 'user',
    },
    profile: {
        avatar: {
            type: String,
            default: ''
        },
        displayName: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        dateOfBirth: {
            type: Date
        },
        country: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        joinDate: {
            type: Date,
            default: Date.now
        }
    },
    superUserBenefits: {
        isActive: {
            type: Boolean,
            default: false
        },
        tier: {
            type: String,
            enum: ['monthly', 'yearly', null],
            default: null,
        },
        subscribedAt: {
            type: Date
        },
        expiresAt: {
            type: Date
        },
        specialCoupons: [specialCouponSchema]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    if (!this.profile.displayName) {
        this.profile.displayName = this.username;
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);