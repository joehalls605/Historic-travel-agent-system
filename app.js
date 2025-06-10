import locationData from './location-data.js';

// Global variable to track the current displayed list
let currentDisplayedLocations = locationData.locations.slice();

const displayedLocations = document.getElementById("displayedLocations");
const countryOptions = document.getElementById("countryOptions");
const topicOptions = document.getElementById("topicOptions");
const ratingOptions = document.getElementById("ratingOptions");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sortOptions = document.getElementById("sortOptions");
const displayedLocationsValue = document.getElementById("displayedLocationsValue");

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
                    <h3>${item.name}</h3>        
                    <div class="card-details">
                      <p class="card-country">${item.country}</p>
                      <p class="card-description">${item.description}</p>   
                      <p>${item.significance}</p>
                      <p>${item.details}</p>
                    </div>
                  </div>
                  <div class="card-bottom">
                  <p class="card-rating">Rating: ${item.rating}</p>  
                  <p class="card-price">${priceText}</p>
                  </div>
                </div>
                  <button class="card-button">Book</button>
              </div>
            `;
        displayedLocations.appendChild(locationDiv);
    });
}

const applyFiltersButton = document.getElementById("filter-button");
if(applyFiltersButton){
    applyFiltersButton.addEventListener("click", applyFilters);
}

function applyFilters(){
    const filteredLocations = filterLocations();
    currentDisplayedLocations = filteredLocations;
    displayLocations(filteredLocations);
}

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

function locationsDisplayedTotal(){
    return currentDisplayedLocations.length;
}

// CARD BUTTON LOGIC

document.addEventListener("click", function(event){
    if(event.target && event.target.classList.contains("card-button")){
        handleBook(event);
    }
});

function handleBook(event){
    const card = event.target.closest(".location-card");
    const locationName = card.querySelector("h3").textContent;
    const selectedLocation = locationData.locations.find(loc => loc.name === locationName);
    if(selectedLocation){
        localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
        window.location.href = "bookDetails.html";
    }
}













