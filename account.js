document.addEventListener("DOMContentLoaded", async function(){
    try{
        const monthlyCountResponse = await fetch("http://localhost:5000/bookings/monthly-count");
        const countryCountResponse = await fetch("http://localhost:5000/bookings/country-count");

        if(!monthlyCountResponse.ok){
            throw new Error("Failed to fetch monthly booking count");
        }
        if(!countryCountResponse.ok){
            throw new Error("Failed to fetch country booking count");
        }

        const monthlyCountData = await monthlyCountResponse.json();
        console.log(monthlyCountData);
        const bookingCountElement = document.getElementById("monthly-booking-count");
        bookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${monthlyCountData.count}`;

        const countryBookingCountData = await countryCountResponse.json();
        const countryBookingCountElement = document.getElementById("country-booking-count");
        countryBookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${countryBookingCountData.count}`;

        // Progress bars

        // BOOKING COUNT PROGRESS BAR
        let min = 0;
        let max = 10;
        let monthlyCountValue = monthlyCountData.count;

        const monthlyCountPercentage = ((monthlyCountValue - min) / (max - min)) * 100

        const bookingCountProgressBar = document.getElementById("bookingCountProgressBar");
        bookingCountProgressBar.style.width = monthlyCountPercentage + "%";

        const monthlyCountSummaryElement = document.getElementById("monthly-count-performance-summary");
        monthlyCountSummaryElement.textContent = `${monthlyCountValue} / ${max} monthly bookings toward monthly goal`;

        // UK PROGRESS BAR
        let countryMin = 0;
        let countryMax = 5;

        let countryCountValue = countryBookingCountData.count;

        const monthlyCountryCountPercentage = ((countryCountValue - countryMin) / (countryMax - countryMin)) * 100
        const countryCountProgressBar = document.getElementById("countryCountProgressBar");
        countryCountProgressBar.style.width = monthlyCountryCountPercentage + "%";

        const countryCountSummaryElement = document.getElementById("country-count-performance-summary");
        countryCountSummaryElement.textContent = `${monthlyCountValue} / ${countryMax} monthly bookings toward monthly goal`;


    } catch (error) {
        console.error("Error fetching monthly booking count:", error);
    }

})