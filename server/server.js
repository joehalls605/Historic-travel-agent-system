// this is the backend server.js that handles the ongoing API operations

// =================== IMPORTS ===================
import mongoose from 'mongoose'; // Import mongoose to interact with MongoDB
import express from 'express'; // Import express to create an API server
import dotenv from 'dotenv'; // Import dotenv to manage environment variables
import cors from 'cors'; // Import cors to enable cross-origin requests
import { v4 as uuidv4 } from 'uuid';

// =================== CONFIGURATION ===================

// Loads environment variables from a .env file
dotenv.config();
console.log("MONGO_URI value:", process.env.MONGO_URI); // Log the MongoDB URI to check its value

// Express app instance created
const app = express();  // Initialize an Express app to handle HTTP requests and routes

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

// Connecting to MongoDB
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
    }
}

// Create a Booking model to interact with the 'bookings' collection in the database
const Booking = mongoose.model("Booking", bookingSchema, "HistoryCollection");

// The front end request triggers this async

// GET BOOKINGS: Route to fetch all bookings from the database
app.get("/bookings", async(req, res) => {
    try {
        console.log("Database connection state:", mongoose.connection.readyState); // Log the database connection state
        console.log("Database name:", mongoose.connection.db.databaseName); // Log the name of the connected database
        console.log("Fetching bookings from collection 'bookings'..."); // Log a message indicating the fetch operation

        // List all collections in the database to verify that 'bookings' exists
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Retrieve all bookings from the 'bookings' collection
        const bookings = await Booking.find();

        // Send the bookings as JSON in the response
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err); // Log any error that occurs
        res.status(500).send("Server Error"); // Send a 500 server error response in case of failure
    }
});

// POST HERE
app.post("/bookings", async(req, res) => {
    try{
        // Destructuring (pull out) the data from req body so I can use the variables
        const {firstName, surname, location, country} = req.body;

        // Checking if fields are present
        if(!firstName || !surname || !location || !country){
            return res.status(400).send("All fields are required");
        }

        // Create new booking instance
        const newBooking = new Booking({
            bookingId: uuidv4(), // generate a unique id
            firstName,
            surname,
            LocationName: location,
            LocationCountry: country
        });

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



// =================== SERVER STARTUP ===================
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
