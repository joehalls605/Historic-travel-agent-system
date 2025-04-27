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

// CREATING A NEW BOOKING LOGIC SET UP HERE

// LOGIC HERE

//

function renderBookings(bookings){
    console.log("Render function called");
    const tableBody = document.getElementById("booking-table");

    // Clear existing table body before rendering new rows.
    tableBody.innerHTML = "";

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
        deleteButton.cursor = "pointer";
        deleteButton.fontsize = "15px";
        deleteButton.addEventListener("click", async function(event){

            event.stopPropagation(); // why event.stopPropagation? JOE!
            const confirmation = confirm("Are you sure you want to delete this booking?");
            if(confirmation){
                try{
                    console.log("Attempting to delete booking with booking_id", booking.id);
                    const response = await fetch(`http://localhost:5000/bookings/${booking._id}`, {
                        method: "DELETE"
                    });
                    if(!response.ok){
                        throw new Error("Failed to delete booking");
                    }
                    alert("Booking deleted successfully");
                }catch(error){
                    console.error("Error deleting booking", error);
                    alert("Failed to delete booking. Check console for details");
                }
            }
        });
        row.appendChild(deleteButton);
        tableBody.appendChild(row);
    })
}