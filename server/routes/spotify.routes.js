import express from "express";
import { handleAuthCallback, fetchSpotifyData, disconnectSpotify, refreshAccessToken } from "../controllers/spotify.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get('/callback/:id', verifyToken, handleAuthCallback);
router.post('/refresh', verifyToken, refreshAccessToken);
router.get('/fetch', verifyToken, fetchSpotifyData);
router.post('/disconnect/:id', verifyToken, disconnectSpotify);



export default router;                                                                         