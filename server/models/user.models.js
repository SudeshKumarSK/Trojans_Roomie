import mongoose from 'mongoose';
import Listing from './ListingSchema.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    isSpotifyConnected: {
        type: Boolean,
        default: false,
    },
    spotifyAccessToken: {
        type: String,
        default: null
    },
    spotifyRefreshToken: {
        type: String,
        default: null
    },
    spotifyTokenExpiry: {
        type: Date,
        default: null
    },
    spotifyGenres: {
        type: [String], // Array of genres as strings
        default: [],
    },
    spotifyArtists: {
        type: [{
            name: String,
            albumImageUrl: String,
        }],
        default: [], // Explicitly set an empty array as the default value
    },
    spotifyTracks: {
        type: [{
            name: String,
            albumImageUrl: String,
        }],
        default: [], // Explicitly set an empty array as the default value
    },

    compatibilityScores: {
        type: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: Number,
        }],
        default: [] 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
