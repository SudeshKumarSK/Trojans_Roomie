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

async function fetchUserTopArtistsAndGenres(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            throw new Error(`Error fetching top Artists: ${response.statusText}`);
        }

        const data = await response.json();
        let genres = new Set(); // Use a Set to store genres without duplicates

        const artists = data.items.map(artist => {
            artist.genres.forEach(genre => genres.add(genre)); // Add genres to the set
            return {
                name: artist.name,
                albumImageUrl: artist.images[0]?.url,
            };
        });

        // Since genres is a simple array of strings, we just convert the set to an array
        return {
            artists: artists,
            genres: Array.from(genres)
        };

    } catch (error) {
        console.error('Failed to fetch user top artists and genres:', error);
        throw error; // Propagate the error up to be handled in handleAuthCallback
    }
}


async function fetchUserTopTracks(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            throw new Error(`Error fetching top tracks: ${response.statusText}`);
        }

        const data = await response.json();
        const tracks = data.items.map(track => {
            return {
                name: track.name,
                albumImageUrl: track.album.images[0]?.url // Using optional chaining in case there's no image
            };
        });
        return tracks;

    } catch (error) {
        console.error('Failed to fetch user top tracks:', error);
        throw error; // Re-throw the error to be handled by the calling function
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

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isSpotifyConnected: true,
                    spotifyAccessToken: tokenData.access_token,
                    spotifyRefreshToken: tokenData.refresh_token,
                    spotifyTokenExpiry: new Date(new Date().getTime() + tokenData.expires_in * 1000),
                    spotifyGenres: [],
                    spotifyArtists: [],
                    spotifyTracks: []
                },
            },
            { new: true }
        );

        // Fetch Spotify Data from Spotify API.
        const artistGenreData = await fetchUserTopArtistsAndGenres(tokenData.access_token);
        const tracks = await fetchUserTopTracks(tokenData.access_token);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    spotifyGenres: artistGenreData.genres,
                    spotifyArtists: artistGenreData.artists,
                    spotifyTracks: tracks
                },
            },
            { new: true }
        );

        const { password, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry,
            spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores, ...userDetails } = updatedUser._doc;

        const responseData = {
            spotify_data: { spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores },
            user_data: userDetails
        };


        // Calculate and update compatibility scores
        await calculateCompatibilityScoresForAll(userId);

        res.status(200).json(responseData);


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
                spotifyArtists: [],
                spotifyTracks: []
            },
        }, { new: true });


        const { password, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry,
            spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores, ...userDetails } = updatedUser._doc;

        const responseData = {
            spotify_data: { spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores },
            user_data: userDetails
        };
        res.status(200).json(responseData);


    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
};



export async function refreshAccessToken(req, res, next) {
};

export async function fetchSpotifyData(req, res, next) {
    try {

        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }
        const userId = req.user.id;
        const user = await User.findById(userId);

        const { password, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry,
            spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores, ...userDetails } = user._doc;

        const spotify_data = {
            spotifyGenres, spotifyArtists, spotifyTracks, compatibilityScores
        };
        res.status(200).json(spotify_data);

    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
};

function calculateCompatibilityScore(currentUser, otherUser) {
    // If either user hasn't connected their Spotify account, return -1
    if (!currentUser.isSpotifyConnected || !otherUser.isSpotifyConnected) {
        return -1;
    }

    let score = 0;

    // Calculate a score based on the intersection of their top genres
    const commonGenres = currentUser.spotifyGenres.filter(genre =>
        otherUser.spotifyGenres.includes(genre)
    );
    score += commonGenres.length; // 1 point for each common genre

    // Calculate a score based on the intersection of their top artists
    const commonArtists = currentUser.spotifyArtists.filter(artist =>
        otherUser.spotifyArtists.some(a => a.name === artist.name)
    );
    score += commonArtists.length * 3; // 3 points for each common artist (increased weight)

    // Calculate a score based on the intersection of their top tracks
    const commonTracks = currentUser.spotifyTracks.filter(track =>
        otherUser.spotifyTracks.some(t => t.name === track.name)
    );
    score += commonTracks.length * 5; // 5 points for each common track (increased weight)

    // Normalize the score to a scale of 0-100 (if needed)
    const maxPossibleScore = currentUser.spotifyGenres.length +
        (currentUser.spotifyArtists.length * 3) +
        (currentUser.spotifyTracks.length * 5);

    if (maxPossibleScore === 0) {
        return 0; // Or another appropriate value when no comparison data is available
    }
    const normalizedScore = (score / maxPossibleScore) * 100;

    return normalizedScore;
}


async function calculateAndUpdateScores(userId) {
    const currentUser = await User.findById(userId);

    // Fetch other users to calculate scores with
    const otherUsers = await User.find({ _id: { $ne: userId } });

    // An array to hold the updated scores
    let updatedScores = [];

    // For each other user, calculate the score and add it to the updatedScores array
    for (const otherUser of otherUsers) {
        const score = calculateCompatibilityScore(currentUser, otherUser);
        updatedScores.push({ user: otherUser._id, score });
    }

    // Update the currentUser's document with these new scores
    currentUser.compatibilityScores = updatedScores;
    await currentUser.save();
}

async function calculateCompatibilityScoresForAll() {
    const allUsers = await User.find({});
    // console.log(allUsers);

    for (const currentUser of allUsers) {
        let updatedScores = [];

        for (const otherUser of allUsers) {
            if (currentUser.id === otherUser.id) continue; // Skip comparing the user with themselves

            const score = calculateCompatibilityScore(currentUser, otherUser);
            updatedScores.push({ user: otherUser._id, score });
        }

        // Update the currentUser's document with these new scores
        currentUser.compatibilityScores = updatedScores;
        await currentUser.save();
    }
}
