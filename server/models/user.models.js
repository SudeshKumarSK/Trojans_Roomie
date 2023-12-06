import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
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
            default:
                'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
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
            type: [String], // Favorite genres
            default: []
        },
        spotifyArtists: {
            type: [String], // Favorite artists
            default: []
        },

    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;