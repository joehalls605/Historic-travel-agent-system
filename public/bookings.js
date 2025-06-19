console.log("bookings.js file loaded");

// FETCHING THE BOOKINGS FROM THE SERVER FIRST.

async function fetchBookingsFromServer(){
    try{
        const response = await fetch("/bookings");

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
    const loadingIndicator = document.getElementById("loading-indicator");
    loadingIndicator.style.display = "block";

    try{
        const userData = await fetchBookingsFromServer();
        if(userData && userData.length > 0){
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
    } finally{
        loadingIndicator.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", initialiseBookings);

// RENDER BOOKINGS

function renderBookings(bookings){
    console.log("Render function called");

    const table = document.getElementById("booking-table");
    const tableBody = document.getElementById("booking-table-body");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Remove existing header if it exists
    const existingHeader = document.getElementById("booking-table-header");
    if (existingHeader) {
        existingHeader.remove();
    }

    // Create and insert new table header
    const tableHeader = document.createElement("thead");
    tableHeader.id = "booking-table-header";
    const tableHeadRow = document.createElement("tr");

    const headers = ["Booking ID", "First Name", "Surname", "Location Name", "Location Country", "Date", "Attendees"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        tableHeadRow.appendChild(th);
    });

    tableHeader.appendChild(tableHeadRow);
    table.insertBefore(tableHeader, tableBody); // ✅ Ensure header goes before body

    // Render each booking row
    bookings.forEach(booking => {
        const row = document.createElement("tr");

        const bookingIdCell = document.createElement("td");
        bookingIdCell.textContent = booking.bookingId;
        row.appendChild(bookingIdCell);

        const firstNameCell = document.createElement("td");
        firstNameCell.textContent = booking.firstName;
        row.appendChild(firstNameCell);

        const surnameCell = document.createElement("td");
        surnameCell.textContent = booking.surname;
        row.appendChild(surnameCell);

        const locationNameCell = document.createElement("td");
        locationNameCell.textContent = booking.LocationName;
        row.appendChild(locationNameCell);

        const locationCountryCell = document.createElement("td");
        locationCountryCell.textContent = booking.LocationCountry;
        row.appendChild(locationCountryCell);

        const dateCell = document.createElement("td");
        const dateObj = new Date(booking.bookingDate);
        dateCell.textContent = isNaN(dateObj.getTime())
            ? "Invalid Date"
            : dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        row.appendChild(dateCell);

        const attendeesCell = document.createElement("td");
        attendeesCell.textContent = booking.attendees;
        row.appendChild(attendeesCell);

        // Add delete icon
        const deleteButton = document.createElement("i");
        deleteButton.classList.add("fa", "fa-trash", "deleteButton");
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", () => deleteBooking(booking._id));

        row.appendChild(deleteButton);

        tableBody.appendChild(row);
    });
}

async function deleteBooking(bookingId){
    try {
        console.log(`Deleting booking with ID: ${bookingId}`);

        // Make sure bookingId is defined and not undefined
        if (!bookingId) {
            throw new Error("Booking ID is required");
        }

        const response = await fetch(`/bookings/${bookingId}`, {
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
        firstName: document.getElementById("firstNameInput").value,
        surname: document.getElementById("surnameInput").value,
        location: document.getElementById("locationSelect").value,
        country: document.getElementById("countrySelect").value,
        bookingDate: document.getElementById("date").value,
        attendees: Number(document.getElementById("attendeesInput").value)
    }

    console.log("Submitting booking:", newBookingData);

    try{
        // SEND POST request to the server
        const response = await fetch("/bookings", {
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
        initialiseBookings();

    }catch(error){
        console.error("Error adding booking:", error);
        alert("Failed to add booking. Check console for details.");
    }
});