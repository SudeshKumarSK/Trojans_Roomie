import User from "../models/user.models.js";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

async function exchangeCodeForTokens(code) {

    try {
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI
        });

        const tokenData = await spotifyApi.authorizationCodeGrant(code)
        return tokenData.body;

    } catch (error) {
        console.error(error);
        throw error;
    }

}

export async function handleAuthCallback(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(errorHandler(400, 'Authorization header is missing'));
        }

        const code = authHeader.split('Bearer ')[1];
        if (!code) {
            return next(errorHandler(400, 'Spotify authorization code is missing'));
        }

        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        const tokenData = await exchangeCodeForTokens(code);
        const userId = req.user.id;

        // Save tokens to MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    spotifyAccessToken: tokenData.access_token,
                    spotifyRefreshToken: tokenData.refresh_token,
                    spotifyTokenExpiry: new Date(new Date().getTime() + tokenData.expires_in * 1000)
                },
            },
            { new: true }
        );
        
        // Send a JSON response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}




async function refreshSpotifyToken(refreshToken) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    const data = await response.json();
    return data; // This will contain access_token and expires_in
}

export async function refreshAccessToken(req, res) {
    try {
        const userId = req.user._id; // Get user's ID from session or JWT
        const user = await User.findById(userId);

        const newTokenData = await refreshSpotifyToken(user.spotifyRefreshToken); // Implement this
        await User.findByIdAndUpdate(userId, {
            spotifyAccessToken: newTokenData.access_token,
            spotifyTokenExpiry: new Date(new Date().getTime() + newTokenData.expires_in * 1000)
        });

        res.status(200).json({
            message: 'Spotify access token refreshed successfully',
            accessToken: newTokenData.access_token, // Send new access token
            expiresIn: newTokenData.expires_in // Send token expiry time
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}

export async function disconnectSpotify(req, res) {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, {
            spotifyAccessToken: null,
            spotifyRefreshToken: null,
            spotifyTokenExpiry: null,
            spotifyProfileData: {}
        });

        res.send('Spotify account disconnected');
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}



async function fetchUserArtists(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data.items.map(artist => artist.name); // Returns an array of artist names
}

// Spotify doesn't provide a direct endpoint for user's favorite genres.
// You would need to fetch top artists or tracks and extract genres from them.
// Below is a simplified example of fetching genres based on top artists.
async function fetchUserGenres(accessToken) {
    const artistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const artistsData = await artistsResponse.json();
    let genres = new Set(); // Use a set to avoid duplicates

    artistsData.items.forEach(artist => {
        artist.genres.forEach(genre => genres.add(genre));
    });

    return Array.from(genres); // Converts set to array
}

export async function fetchSpotifyData(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const accessToken = user.spotifyAccessToken;

        const genres = await fetchUserGenres(accessToken); // Implement this
        const artists = await fetchUserArtists(accessToken); // Implement this

        await User.findByIdAndUpdate(userId, {
            'spotifyProfileData.genres': genres,
            'spotifyProfileData.artists': artists
        });

        res.send('Spotify data updated');
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}
