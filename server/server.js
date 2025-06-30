// this is the backend server.js that handles the ongoing API operations

// =================== IMPORTS ===================
import mongoose from 'mongoose'; // mongoose to interact with MongoDB
import express from 'express'; // express to create an API server
import dotenv from 'dotenv'; // to manage environment variables
import cors from 'cors'; // cors to enable cross-origin requests
import { v4 as uuidv4 } from 'uuid'; // unique id generator  library

// =================== CONFIGURATION ===================

// Loads environment variables from a .env file
dotenv.config();
console.log("MONGO_URI value:", process.env.MONGO_URI); // Log the MongoDB URI to check its value

// Express app instance created
const app = express();  // Initialise an Express app to handle HTTP requests and routes

// Middleware
app.use(express.json()); // Middleware to automatically parse incoming JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for handling requests from different origins

// Server port and MongoDB connection string
const PORT = process.env.PORT || 5000; // Set server port (use value from environment or default to 5000 if not set)
const uri = process.env.MONGO_URI; // MongoDB connection string (loaded from .env file)

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Connected to MongoDB
mongoose.connection.on("connected", () => {
    // Log a message when successfully connected to MongoDB
    console.log(`Mongoose connected to ${mongoose.connection.db.databaseName}`);
});

// Defined Booking Schema (structure for bookings in the database)
const bookingSchema = {
    bookingId: {
        type: String, // The booking ID is a string
        required: true, // The booking ID is required
        unique: true, // Each booking ID must be unique
    },
    firstName: {
        type: String, // First name of the person who made the booking
        required: true, // The first name is required
    },
    surname: {
        type: String, // Surname of the person
        required: true, // Surname is required
    },
    LocationName: {
        type: String, // The name of the location where the booking was made
        required: true, // This field is required
    },
    LocationCountry: {
        type: String, // The country of the location (optional)
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    attendees:{
        type: Number,
        required: true,
        min: 1
    }
}

// Create a Booking model to interact with the 'HistoryCollection' collection in the database
const Booking = mongoose.model("Booking", bookingSchema, "HistoryCollection");

// The front end request triggers this async

// GET BOOKINGS
app.get("/bookings", async(req, res) => {
    try {
        console.log("Database connection state:", mongoose.connection.readyState);
        console.log("Database name:", mongoose.connection.db.databaseName);
        console.log("Fetching bookings from collection 'bookings'...");

        // List all collections in the database to verify that 'bookings' exists
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Retrieve all bookings from the 'bookings' collection
        const bookings = await Booking.find();

        // Send the bookings as JSON in the response
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err)
        res.status(500).send("Server Error");
    }
});

// POST BOOKINGS
app.post("/bookings", async(req, res) => {
    try{
        // Destructuring the data from req body so I can use the variables
        const {firstName, surname, location, country, bookingDate, attendees} = req.body;

        // Checking if fields are present
        if(!firstName || !surname || !location || !country || !bookingDate || !attendees){
            return res.status(400).send("All fields are required");
        }

        // Create new booking instance
        const newBooking = new Booking({
            bookingId: uuidv4(), // generate a unique id
            firstName,
            surname,
            LocationName: location,
            LocationCountry: country,
            bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
            attendees
        });

        console.log("Booking to be saved:", newBooking);

        await newBooking.save();
        res.status(201).send("Booking created successfully!");
    }catch(err){
        console.log("Error creating booking at server", err);
        res.status(500).send("Server Error");
    }
});

// DELETE
app.delete("/bookings/:id", async(req, res) => {
    try {
        const bookingId = req.params.id;
        console.log(`Attempting to delete booking with ID: ${bookingId}`);

        // Find and delete the booking with the specified ID
        const result = await Booking.findByIdAndDelete(bookingId);

        if (!result) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking deleted successfully", deletedBooking: result });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).send("Server Error");
    }
});

// GET BOOKINGS MONTHLY COUNT
app.get("/bookings/monthly-count", async (req, res) => {
    try{
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const count = await Booking.countDocuments({
           bookingDate: {$gte: startOfMonth, $lt: endOfMonth}
        });

        res.json({count});
    } catch(err){
        console.log("Error fetching monthly booking count:", err);
        res.status(500).send("Server Error");
    }
})

// GET BOOKINGS COUNTRY COUNT
app.get("/bookings/country-count", async (req, res) => {
    try{
        const count = await Booking.countDocuments({
            LocationCountry: "United Kingdom"
        });
        res.json({count});
    }catch(err){
        console.log("Error fetching monthly booking count:", err);
        res.status(500).send("Server Error");
    }

})

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory (one level up from server/)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Fallback: send index.html for any unmatched route
app.use((req, res, next) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});


// =================== SERVER STARTUP ===================
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
