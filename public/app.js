import locationData from './location-data.js';

// Global variable to track the current displayed list
let currentDisplayedLocations = locationData.locations.slice();

// DOM ELEMENTS
const displayedLocations = document.getElementById("displayedLocations");
const countryOptions = document.getElementById("countryOptions");
const topicOptions = document.getElementById("topicOptions");
const ratingOptions = document.getElementById("ratingOptions");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sortOptions = document.getElementById("sortOptions");
const displayedLocationsValue = document.getElementById("displayedLocationsValue");

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", function(){
    if(displayedLocations){
        displayLocations(locationData.locations);
    }
    const locationsDisplayed = locationsDisplayedTotal();
    console.log(locationsDisplayed);
    if(displayedLocationsValue){
        displayedLocationsValue.innerHTML = `<i class="fas fa-map-pin"></i> ${locationsDisplayed} locations`
    }
})

// DISPLAY LOCATIONS
function displayLocations(locationsArray){
    displayedLocations.innerHTML = "";

    locationsArray.forEach(item => {
        const locationDiv = document.createElement("div");
        const priceText = item.price === 0 ? 'Free entry' : `£${item.price}`;

        locationDiv.innerHTML = `
              <div class="location-card">
                <img class="location-card-image" alt="image" src="${item.image}">
                <div class="card-content">
                  <div class="card-text-wrapper">
                    <p class="card-text">${item.name}</p>        
                    <div class="card-details">
                      <span><i class="locationIcon fas fa-map-marker-alt"></i> ${item.country}</span>
                      <p class="card-description">${item.description}</p>   
                      <p>${item.significance}</p>
                      <p>${item.details}</p>
                    </div>
                  </div>
                  <div class="card-bottom">
<!--                  <span class="card-rating"><i class="ratingIcon fas fa-star"></i>${item.rating}</span>  -->
                  <p class="card-price">${priceText}</p>
                  </div>
                </div>
                  <button class="card-button">Book</button>
              </div>
            `;
        displayedLocations.appendChild(locationDiv);
    });
}

// APPLY FILTERS BUTTON
const applyFiltersButton = document.getElementById("filter-button");
if(applyFiltersButton){
    applyFiltersButton.addEventListener("click", applyFilters);
}
function applyFilters(){
    const filteredLocations = filterLocations();
    currentDisplayedLocations = filteredLocations;
    displayLocations(filteredLocations);
}

// FILTER LOCATIONS
function filterLocations(){
    const selectedCountry = countryOptions.value;
    const selectedTopic = topicOptions.value;
    const selectedRating = parseFloat(ratingOptions.value); // Convert rating to a number

    return locationData.locations.filter(function(item){
        if(selectedCountry !== "All" && selectedCountry !== item.country){ // removes it from the new array
            return false;
        }
        if(selectedTopic !== "All" && selectedTopic !== item.topic){
            return false;
        }
        if(selectedRating > 0 && item.rating < selectedRating){
            return false;
        }
        return true;
    });
}

// SEARCH INPUT
if(searchButton){
    searchButton.addEventListener("click", search);
}
function search(){
    const searchTerm = searchInput.value;
    const searchResults = locationData.locations.filter(function(item){
        console.log(searchTerm);
        return(
            item.name.includes(searchTerm) ||
            item.country.includes(searchTerm)
        );
    });
    currentDisplayedLocations = searchResults;
    displayLocations(searchResults);
}

// SORT DROPDOWN
if(sortOptions){
    sortOptions.addEventListener("change", sort);
}

function sort(){
    const selectedSortValue = sortOptions.value;
    let sortedLocations = [...currentDisplayedLocations];

    if(selectedSortValue === "price-low"){
        sortedLocations.sort((a,b) => a.price - b.price);
    }
    else if(selectedSortValue === "price-high"){
        sortedLocations.sort((a,b) => b.price - a.price);
    }
    else if(selectedSortValue === "rating-low"){
        sortedLocations.sort((a,b) => a.rating - b.rating);
    }
    else if(selectedSortValue === "rating-high"){
        sortedLocations.sort((a,b) => b.rating - a.rating);
    }
    displayLocations(sortedLocations);
}

// LOCATIONS DISPLAY TOTAL
function locationsDisplayedTotal(){
    return currentDisplayedLocations.length;
}

// CARD BUTTON
document.addEventListener("click", function(event){
    if(event.target && event.target.classList.contains("card-button")){
        handleBook(event);
    }
});
function handleBook(event){
    const card = event.target.closest(".location-card");
    const locationName = card.querySelector(".card-text").textContent;
    console.log(locationName);
    const selectedLocation = locationData.locations.find(loc => loc.name === locationName);
    if(selectedLocation){
        localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
        window.location.href = "bookDetails.html";
    }
}
















