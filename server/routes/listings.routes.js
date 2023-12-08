import express from "express";
import { createListing, getAllListings, updateListing, deleteListing } from "../controllers/listings.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/create/:id', verifyToken, createListing);
router.get('/show/', verifyToken, getAllListings);
router.post("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);
export default router; 