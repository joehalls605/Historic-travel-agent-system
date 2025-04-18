import locationData from './location-data.js';

const displayedLocations = document.getElementById("displayedLocations");

document.addEventListener("DOMContentLoaded", function(){
    if(displayedLocations){
        locationData.locations.forEach(item => {
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
            </div>
            `;
            displayedLocations.appendChild(locationDiv);
        })
    }
})
