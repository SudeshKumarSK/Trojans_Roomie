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
};
