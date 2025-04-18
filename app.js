import locationData from './location-data.js';


const displayedLocations = document.getElementById("displayedLocations");
const countryOptions = document.getElementById("countryOptions");

document.addEventListener("DOMContentLoaded", function(){
    if(displayedLocations){
        displayLocations(locationData.locations);
    }
})

function displayLocations(locationsArray){
    displayedLocations.innerHTML = "";

    locationsArray.forEach(item => {
        const locationDiv = document.createElement("div");
        locationDiv.innerHTML = `
        <div class="location-card">
        <img class="location-card-image" alt="image" src="${item.image}">
        <div class="card-content">
        <h3>${item.name}</h3>        
        <p>${item.country}</p>
        <p>${item.description}</p>   
        <p>${item.significance}</p>
        <p>${item.details}</p>
        <div class="card-footer">
        <p>£${item.price}</p>   
        <p>Rating:${item.rating}</p>  
        </div>
        </div>
        <button class="book-button">Book</button>
        </div>
        `;
        displayedLocations.appendChild(locationDiv);
    });
}

const applyFiltersButton = document.getElementById("filterButton");
applyFiltersButton.addEventListener("click", applyFilters);

function applyFilters(){
    const filteredLocations = filterDisplayedLocations();
    displayLocations(filteredLocations);
}

function filterDisplayedLocations(){
    const selectedCountry = countryOptions.value;

    return locationData.locations.filter(function(item){
        if(item.country !== selectedCountry){ // removes it from the new array
            return false;
        }
        return true;
    });
}