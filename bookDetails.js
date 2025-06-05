document.addEventListener("DOMContentLoaded", function(){
    const locationDataString = localStorage.getItem("selectedLocation");

    if(locationDataString){
        const location = JSON.parse(locationDataString);
        const mainContent = document.getElementById("main-content");

        if(mainContent){
            mainContent.innerHTML = `
        <div class="book-details-wrapper">
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

            <div class="booking-sidebar">
              <p class="price">£${location.price} <span class="per-person">per person</span></p>
              <form>
                <div class="booking-date-row">
                    <label for="booking-date">Select Date</label>
                    <br>
                    <input type="date" id="booking-date" required />
                </div>
                <div id="booking-people-row">
                       <label for="booking-people">Number of People</label>
                       <br>
                       <select id="booking-people">
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4 People</option>
                    </select>
                </div>

                <div class="price-summary">
                    <div class="price-summary-row">
                        <p id="total-price">Total Price:</p>
                        <p><strong id="total-price-figure">£${location.price}</strong></p>
                    </div>
                  <p class="price-breakdown">1 person × £${location.price}</p>
                </div>

                <button type="button" class="book-now-button">Book This Tour</button>
                <div class="cancellation-policy">
                <p>Free cancellation up to 24 hours before the tour</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
            // Dynamic price update logic

            const price = location.price;
            const peopleSelect = document.getElementById("booking-people");
            const totalPriceDisplay = document.getElementById("total-price-figure");

            peopleSelect.addEventListener("change", () => {
                const people = parseInt(peopleSelect.value);
                if(price === 0){
                    totalPriceDisplay.textContent = "Free";
                }
                else{
                    totalPriceDisplay.textContent = `£${people * price}`;
                }
            });
        }
    }
    else{
        document.getElementById("main-content").innerHTML = "<p>No booking details found!</p>";
    }
});