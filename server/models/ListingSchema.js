import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
        maxlength: 35,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    cleanliness: {
        type: String,
        required: true,
        default: 'Not Specified', // Assuming 'Not Specified' is a valid option
    },
    overnightGuests: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    partyHabits: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    getUpTime: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    goToBed: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    smoker: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    foodPreference: {
        type: String,
        required: true,
        default: 'No Preference', // Use a sensible default for your application
    },
    smokePreference: {
        type: String,
        required: true,
        default: 'No Preference',
    },
    preferredPets: {
        type: [String],
        required: true,
        default: [], // An empty array indicates no pet preference by default
    },
    buildingType: {
        type: String,
        required: true,
        default: 'Not Specified', // Use a sensible default for your application
    },
    moveInFee: {
        type: Number,
        min: 0,
        required: true,
        default: 0, // Default to 0 if not provided
    },
    utilityFee: {
        type: Number,
        min: 0,
        required: true,
        default: 0, // Default to 0 if not provided
    },
    isFurnished: {
        type: Boolean,
        required: true,
        default: false, // Default to false if not provided
    },
    
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;