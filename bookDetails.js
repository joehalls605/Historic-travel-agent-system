document.addEventListener("DOMContentLoaded", function(){
    const locationDataString = localStorage.getItem("selectedLocation");

    if(locationDataString){
        const location = JSON.parse(locationDataString);
        const mainContent = document.getElementById("main-content");

        if(mainContent){
            mainContent.innerHTML = `
            <h1>${location.name}</h1>
            <img src="${location.image}">
            <p>Country:${location.country}</p>
            `
        }
    }
    else{
        document.getElementById("main-content").innerHTML = "<p>No booking details found!</p>";
    }
});