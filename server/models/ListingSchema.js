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
        default: 'Not Specified',
    },
    partyHabits: {
        type: String,
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
        default: 'No Preference',
    },
    preferredPets: {
        type: [String],
        default: [], // An empty array indicates no pet preference by default
    },
    buildingType: {
        type: String,
        default: 'Not Specified', // Use a sensible default for your application
    },
    rent: {
        type: Number,
        min: 0,
        required: true,
        default: 0, // Default to 0 if not provided
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
    apartmentImage: {
        type: String,
        default: 'https://img.freepik.com/free-photo/man-watching-news-office_23-2149726070.jpg?w=740&t=st=1702025985~exp=1702026585~hmac=afec2d39205593fb82659afb557ba444f19b748ae7519ef779a159426ad4f600',
    },

    
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
