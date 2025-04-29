console.log("bookings.js file loaded");

// FETCHING THE BOOKINGS FROM THE SERVER FIRST.

async function fetchBookingsFromServer(){
    try{
        const response = await fetch("http://localhost:5000/bookings");

        if(!response.ok){
            const cachedData = localStorage.getItem("userData");
            if(cachedData){
                console.log("Using cached bookings data");
                return JSON.parse(cachedData);
            }
            throw new Error("Error fetching bookings");
        }

        const bookings = await response.json();
        console.log("Received bookings from server", bookings);

        if(bookings && bookings.length > 0){
            localStorage.setItem("userData", JSON.stringify(bookings));
            return bookings;
        }
        else{
            console.log("No bookings received from server");
            return [];
        }
    } catch(error){
        console.error("Error in getBookings", error);
        throw error;
    }
}

// INITIALISING THE BOOKINGS

async function initialiseBookings(){
    try{
        console.log("Initialise bookings");
        const userData = await fetchBookingsFromServer();
        console.log("userData initialised", userData);

        if(userData && userData.length > 0){
            console.log("Rendering bookings with data", userData);
            renderBookings(userData);
        }else{
            console.log("No booking data available");
        }
    }catch(error){
        console.log("Error initialising bookings", error);
        const cachedData = localStorage.getItem("userData");
        if(cachedData){
            console.log("Using cached bookings data after error");
            const parsedData = JSON.parse(cachedData);
            renderBookings(parsedData);
        }
        // If no cached data, return empty array instead of throwing an error.
        return [];
    }
}

document.addEventListener("DOMContentLoaded", initialiseBookings);

// RENDER BOOKINGS

function renderBookings(bookings){
    console.log("Render function called");
    const tableBody = document.getElementById("booking-table-body");

    bookings.forEach(booking => {
        const row = document.createElement("tr");

        // Create and append table cells for each booking attribute
        const bookingIdCell = document.createElement("td");
        bookingIdCell.textContent = booking.bookingId;
        row.appendChild(bookingIdCell);

        const firstNameCell = document.createElement("td");
        firstNameCell.textContent = booking.firstName;
        row.appendChild(firstNameCell);

        const surnameCell = document.createElement("td");
        surnameCell.textContent = booking.surname;
        row.appendChild(surnameCell);

        const locationName = document.createElement("td");
        locationName.textContent = booking.LocationName;
        row.appendChild(locationName);

        const locationCountry = document.createElement("td");
        locationCountry.textContent = booking.LocationCountry;
        row.appendChild(locationCountry);

        const deleteButton = document.createElement("i");
        deleteButton.classList.add("fa", "fa-trash");
        deleteButton.classList.add("deleteButton");
        deleteButton.addEventListener("click", () => deleteBooking(booking._id));

        row.appendChild(deleteButton);
        tableBody.appendChild(row);
    })
}

async function deleteBooking(bookingId){
    try {
        console.log(`Deleting booking with ID: ${bookingId}`);

        // Make sure bookingId is defined and not undefined
        if (!bookingId) {
            throw new Error("Booking ID is required");
        }

        const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete booking (Status: ${response.status})`);
        }

        const result = await response.json();
        console.log("Booking deleted successfully:", result);
        const tableBody = document.getElementById("booking-table-body");
        tableBody.innerHTML = "";
        initialiseBookings();

    }catch (error) {
        console.error("Error deleting booking:", error);
    }
}


// CREATE A NEW BOOKING

document.getElementById("new-booking-form").addEventListener("submit",  async function(event){
    event.preventDefault();  // stops the form from reloading the page, I want to handle manually.

    const newBookingData = {
        firstName: document.getElementById("firstName").value,
        surname: document.getElementById("surname").value,
        location: document.getElementById("location").value,
        country: document.getElementById("country").value
    }

    try{
        // SEND POST request to the server
        const response = await fetch("http://localhost:5000/bookings", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBookingData)
        });
        if(!response.ok){
            throw new Error("Failed to add booking");
        }
        alert("Booking added successfully");

        // Clear all form fields
        document.getElementById("new-booking-form").reset();
        location.reload();

    }catch(error){
        console.error("Error adding booking:", error);
        alert("Failed to add booking. Check console for details.");
    }
});