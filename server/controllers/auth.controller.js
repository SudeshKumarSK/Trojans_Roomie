import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();


const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({
            message: `New User - ${username} created successfully!`,
        });

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

}

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User Not Found!"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid Credentials!"));

        const { password: hashedPassword, ...rest } = validUser._doc;
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const expiryDate = new Date(Date.now() + 3600000);
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);


    } catch (error) {
        let message = "Internal Server Error";
        let statusCode = 500;
        next(errorHandler(statusCode, message));
    }
}

export const google = async (req, res, next) => {
    try {

        const idToken = req.headers.authorization.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // 
        const userEmail = decodedToken.email;
        const userName = decodedToken.name;
        const userPhoto = decodedToken.picture;

        const user = await User.findOne({ email: userEmail });

        // If user is already present in our Database
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);

        }

        // If it's a new user.
        else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    userName.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: userEmail,
                password: hashedPassword,
                profilePicture: userPhoto,
            });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        let message = "Internal Server Error";
        let statusCode = 500;

        if (error.code === 'auth/id-token-expired') {
            message = "ID Token expired";
            statusCode = 401;
        } else if (error.code === 'auth/id-token-revoked') {
            message = "ID Token revoked";
            statusCode = 401;
        }

        next(errorHandler(statusCode, message));
    }
};

export const signOut = (req, res) => {
    try {
        res.clearCookie("access_token").status(200).json("Succesfully logged out!")
    } catch (error) {
        const statusCode = error.statusCode || 500;
        next(errorHandler(statusCode, error.message));
    }
}