import { setupSidebarToggle } from './layout.js';

document.addEventListener("DOMContentLoaded", function(){
    const locationDataString = localStorage.getItem("selectedLocation");

    if(locationDataString){
        const location = JSON.parse(locationDataString);
        const mainContent = document.getElementById("main-content");

        if(mainContent){
            mainContent.innerHTML = `
        <div class="book-details-wrapper">
        <div id="book-details-header">
               <div id="burger-icon">
                    <i class="fas fa-bars"></i>
                </div>
        </div>
          <div class="location-main">
            <div class="location-image-placeholder">
              <span class="badge">${location.topic || "Museum"}</span>
              <img id="location-image" src="${location.image}" alt="${location.name}">
            </div>
          </div>

          <div class="booking-content">
            <div class="location-header">
              <div class="location-header-items">
                  <h1 id="locationName">${location.name}</h1>
              </div>
              <div class="location-meta">
                <span><i class="locationIcon fas fa-map-marker-alt"></i> ${location.country}</span>
                <span><i class="calendarIcon fas fa-calendar"></i> ${location.year || "n/a"}</span>
                <span><i class="ratingIcon fas fa-star"></i> ${location.rating}</span>  
              </div>
              <p>${location.description}</p>
             
            </div>

            <div class="booking-panel">
              <p class="price">£${location.price} <span class="per-person">per person</span></p>
              <form>
                <div class="booking-date-row">
                    <label for="booking-date">Select Tour Date</label>
                    <br>
                    <input type="date" id="booking-date" required />
                </div>
                <div id="booking-attendees-row">
                       <label for="booking-attendees">Number of Attendees</label>
                       <br>
                       <select id="booking-attendees" required>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                    </select>
                </div>
                    <div id="customer-details-row">
                       <label for="customer-firstName">First Name</label>
                       <input id="customer-firstName" type="text" placeholder="Please enter first name" required/>
                       <label for="customer-surname">Last Name</label>
                       <input id="customer-surname" type="text" placeholder="Please enter surname" required/>
                    </select>
                </div>
                

                <div class="price-summary">
                    <div class="price-summary-row">
                        <p id="total-price">Total Price:</p>
                        <p><strong id="total-price-figure">£${location.price}</strong></p>
                    </div>
                  <p class="price-breakdown">1 attendee × £${location.price}</p>
                </div>

                <button type="button" class="book-button">Confirm Booking</button>
                <div class="cancellation-policy">
                <p>Free cancellation up to 24 hours before the tour</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

            // Dynamic price update logic
            setupSidebarToggle();

            const price = location.price;
            const attendeesSelect = document.getElementById("booking-attendees");
            const totalPriceDisplay = document.getElementById("total-price-figure");

            attendeesSelect.addEventListener("change", () => {
                const attendees = parseInt(attendeesSelect.value);
                if(price === 0){
                    totalPriceDisplay.textContent = "Free";
                }
                else{
                    totalPriceDisplay.textContent = `£${attendees * price}`;
                }
            });
        }
    }
    else{
        document.getElementById("main-content").innerHTML = "<p>No booking details found!</p>";
    }


    const bookButton = document.querySelector(".book-button");
    bookButton.addEventListener("click", async () => {

        const firstName = document.getElementById("customer-firstName").value;
        const surname = document.getElementById("customer-surname").value;
        const bookingDate = document.getElementById("booking-date").value;
        const attendees = Number(document.getElementById("booking-attendees").value);

        // Get selected location from localStorage
        const locationDataString = localStorage.getItem("selectedLocation");
        if(!locationDataString){
            alert("No location selected");
        }
        const location = JSON.parse(locationDataString);

        const newBooking = {
            firstName,
            surname,
            location:location.name,
            country:location.country,
            bookingDate,
            attendees
        };
        console.log("Submitting booking from bookDetails.js", newBooking);

        try{
            const response = await fetch("/bookings", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(newBooking)
            });

            if(!response.ok){
                throw new Error("Failed to create booking in bookingDetails");
            }

            alert("Booking successful!");
            window.location.href="bookings.html";
        } catch(error){
            console.error("Error submitting booking:", error);
            alert("Something went wrong while submitting the booking");
        }
    });
});
