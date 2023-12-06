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

        setTimeout(async () => {
            try {
                const simulatedSpotifyData = {
                    genres: ["Pop", "Rock", "Indie"],
                    artists: ["Artist1", "Artist2", "Artist3"],
                };

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $set: {
                            isSpotifyConnected: true,
                            spotifyAccessToken: tokenData.access_token,
                            spotifyRefreshToken: tokenData.refresh_token,
                            spotifyTokenExpiry: new Date(new Date().getTime() + tokenData.expires_in * 1000),
                            spotifyGenres: simulatedSpotifyData.genres,
                            spotifyArtists: simulatedSpotifyData.artists
                        },
                    },
                    { new: true }
                );

                const { password, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry,
                    spotifyGenres, spotifyArtists, ...userDetails } = updatedUser._doc;

                const responseData = {
                    spotify_data: { spotifyGenres, spotifyArtists },
                    user_data: userDetails
                };

                res.status(200).json(responseData);
            } catch (updateError) {
                console.error(updateError);
                next(errorHandler(500, 'Error updating user with Spotify data'));
            }
        }, 5000); // 5000 milliseconds (5 seconds) delay

    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}


export async function disconnectSpotify(req, res, next) {
    try {

        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                isSpotifyConnected: false,
                spotifyAccessToken: null,
                spotifyRefreshToken: null,
                spotifyTokenExpiry: null,
                spotifyGenres: [],
                spotifyArtists: []
            },
        }, { new: true });


        const { password, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry,
            spotifyGenres, spotifyArtists, ...userDetails } = updatedUser._doc;

        const responseData = {
            spotify_data: { spotifyGenres, spotifyArtists },
            user_data: userDetails
        };
        res.status(200).json(responseData);


    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}

export async function refreshAccessToken(req, res, next) {
}

export async function fetchSpotifyData(req, res, next) {
}