import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";

export const getInfo = (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "This the Mern Application Test Route!",
            statusCode: 200
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }
};



export const updateUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            { new: true }
        );
        const { password: hashedPassword, spotifyAccessToken, spotifyRefreshToken, spotifyTokenExpiry, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        let message = "Internal Server Error";
        let statusCode = 500;

        if (error.code === 11000) {
            // Determine which field caused the duplicate error
            let errorMessage = "Duplicate field error: ";
            if (error.keyValue.username && error.keyValue.email) {
                errorMessage += "both username and email already exist.";
            } else if (error.keyValue.username) {
                errorMessage += "username already exists.";
            } else if (error.keyValue.email) {
                errorMessage += "email already exists.";
            }
            message = errorMessage;
            statusCode = 409;
        }
        next(errorHandler(statusCode, message));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can delete only your account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        next(errorHandler(statusCode, message));
    }

}