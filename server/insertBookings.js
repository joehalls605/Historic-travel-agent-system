import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGO_URI;
const dbName = "HistoryDatabase";

const bookingData = [
    {
        "bookingId": "B001",
        "firstName": "John",
        "surname": "Doe",
        "LocationName": "Normandy D-Day Beaches",
        "LocationCountry": "France",
        "LocationPrice": 25
    },
    {
        "bookingId": "B002",
        "firstName": "Jane",
        "surname": "Smith",
        "LocationName": "Anne Frank House",
        "LocationCountry": "Netherlands",
        "LocationPrice": 16
    },
    {
        "bookingId": "B003",
        "firstName": "Alice",
        "surname": "Johnson",
        "LocationName": "Pearl Harbor National Memorial",
        "LocationCountry": "United States",
        "LocationPrice": 15
    }
];


async function insertBookings() {
    let client;
    
    try {
        console.log('Attempting to connect to MongoDB...');
        
        client = new MongoClient(url, {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: true,
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true
            }
        });

        await client.connect();
        console.log('Successfully connected to MongoDB');

        const db = client.db(dbName);
        console.log('Using database:', dbName);
        
        const collection = db.collection("HistoryCollection");
        console.log('Using collection: HistoryCollection');

        // First, check if documents already exist
        const existingDocs = await collection.countDocuments();
        console.log('Existing documents in collection:', existingDocs);

        // Insert the documents
        const result = await collection.insertMany(bookingData);
        console.log('Insert operation completed');
        console.log(`Successfully inserted ${result.insertedCount} documents`);
        console.log('Inserted IDs:', result.insertedIds);

    } catch (error) {
        console.error('Error occurred:');
        console.error(error);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

// Run the insertion function
insertBookings().catch(console.error);