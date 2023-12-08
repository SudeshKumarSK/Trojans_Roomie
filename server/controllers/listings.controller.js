import User from "../models/user.models.js";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();

export async function createListing(req, res, next) {
    try {
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            console.log(`${req.params.id} is not a valid user!`);
            return next(errorHandler(404, 'User not found'));
        }

        user.listings.push(req.body);
        const newListing = user.listings[user.listings.length - 1]; // Access the newly added listing
        await user.save();

        res.status(201).json(newListing);

    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
}


export async function getAllListings(req, res, next) {
    try {
        // Check if the user is authorized to view the listings
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        // Fetch all users with their listings and populate the listings field
        const usersWithListings = await User.find({})
            .populate('listings')
            .exec();

        // Initialize an array to store all the listings from all users
        let allListings = [];

        // Fetch the reference user's compatibility scores
        const referenceUser = await User.findById(req.user.id)
            .select('compatibilityScores spotifyArtists spotifyTracks spotifyGenres')
            .exec();

        if (!referenceUser) {
            return next(errorHandler(404, 'Referenced User not found!'));
        }

        // Create a map for faster compatibility score lookup
        const compatibilityScoresMap = new Map(
            referenceUser.compatibilityScores.map(score => [score.user.toString(), score.score])
        );

        // Iterate over each user to access their listings
        usersWithListings.forEach(user => {
            // Combine user's listings with the reference user's compatibility score for each listing
            const userListingData = user.listings.map(listing => {
                // Extract the relevant information from the listing
                const { buildingType, rent, moveInFee, utilityFee, isFurnished, apartmentImage, address, headline, description, cleanliness, overnightGuests, partyHabits, getUpTime, goToBed, smoker, foodPreference, smokePreference, preferredPets } = listing;

                // Combine into one apartment data object
                const apartmentData = {
                    buildingType,
                    rent,
                    moveInFee,
                    utilityFee,
                    isFurnished,
                    apartmentImage,
                    address,
                };

                // Combine into one listing info object
                const listingInfo = {
                    address,
                    headline,
                    description,
                    cleanliness,
                    overnightGuests,
                    partyHabits,
                    getUpTime,
                    goToBed,
                    smoker,
                    foodPreference,
                    smokePreference,
                    preferredPets,
                };

                // Find the compatibility score for this listing with respect to the reference user
                const compatibilityScore = compatibilityScoresMap.get(user._id.toString()) || 0;

                // Prepare the Spotify data object
                const spotifyData = {
                    genres: user.spotifyGenres,
                    artists: user.spotifyArtists,
                    tracks: user.spotifyTracks,
                };

                // Return the combined listing data
                return {
                    user: {
                        id: user._id,
                        username: user.username,
                        profilePicture: user.profilePicture,
                    },
                    apartmentData,
                    listingInfo,
                    compatibilityScore,
                    spotifyData, // Add the Spotify data here
                };
            });

            // Add this user's listings to the allListings array
            allListings.push(...userListingData);
        });

        // Sort the listings by compatibility score in descending order
        allListings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        // Respond with the sorted listings data
        res.status(200).json(allListings);

    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        // Implement your errorHandler function or use a standard Express error handling mechanism
        next(errorHandler(statusCode, message));
    }
}




export async function updateListing(req, res, next) {
};



export async function deleteListing(req, res, next) {
};