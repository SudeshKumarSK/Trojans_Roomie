import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import spotifyRoutes from "./routes/spotify.routes.js";
import listingsRoutes from "./routes/listings.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const CONNECTION_URI = process.env.MONGO_URI

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


mongoose
    .connect(CONNECTION_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server kick-started on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err.message);
        console.log("Server could not be started! Whon Whon!");
    });


/* mongoose
    .connect(CONNECTION_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); */

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/listings", listingsRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});

// trojanroomie@gmail.com 
// Brandon6969#