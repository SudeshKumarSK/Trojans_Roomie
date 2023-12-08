import express from "express";
import { createListing, getAllListings } from "../controllers/listings.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/create/:id', verifyToken, createListing);
router.get('/listings/', verifyToken, getAllListings);

export default router; 