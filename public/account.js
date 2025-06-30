document.addEventListener("DOMContentLoaded", async function(){
    try{
        const monthlyCountResponse = await fetch("http://localhost:5000/bookings/monthly-count");
        const countryCountResponse = await fetch("http://localhost:5000/bookings/country-count");

        let monthlyCountData, countryBookingCountData;

        // Handle monthly count response
        if(!monthlyCountResponse.ok){
            console.log("Failed to fetch monthly booking count, checking cache...");
            const cachedMonthlyData = localStorage.getItem("monthlyBookingCount");
            if(cachedMonthlyData){
                console.log("Using cached monthly booking count");
                monthlyCountData = JSON.parse(cachedMonthlyData);
            }else{
                throw new Error("Failed to fetch monthly booking count and no cached data available");
            }
        } else{
            monthlyCountData = await monthlyCountResponse.json();
            // Cache the fresh data
            localStorage.setItem("monthlyBookingCount", JSON.stringify(monthlyCountData));
            console.log("Monthly booking count fetched and cached:", monthlyCountData);
        }

        // Handle country count response
        if(!countryCountResponse.ok){
            console.log("Failed to fetch country booking count, checking cache...");
            const cachedCountryData = localStorage.getItem("countryBookingCount");
            if(cachedCountryData){
                console.log("Using cached country booking count");
                countryBookingCountData = JSON.parse(cachedCountryData);
            }else {
                throw new Error("Failed to fetch country booking count and no cached data available");
            }
        }else{
            countryBookingCountData = await countryCountResponse.json();
            // Cache the fresh data
            localStorage.setItem("countryBookingCount", JSON.stringify(countryBookingCountData));
            console.log("Country booking count fetched and cached:", countryBookingCountData);
        }

        // Update the UI with the data (fresh or cached)
        updateAccountUI(monthlyCountData, countryBookingCountData);
    } catch (error) {
        console.error("Error fetching monthly booking count:", error);

        // Try to use any cached data as final fallback
        const cachedMonthlyData = localStorage.getItem("monthlyBookingCount");
        const cachedCountryData = localStorage.getItem("countryBookingCount");

        if(cachedMonthlyData && cachedCountryData){
            console.log("Using cached data for both counts due to error");
            const monthlyCountData = JSON.parse(cachedMonthlyData);
            const countryBookingData = JSON.parse(cachedCountryData);
            updateAccountUI(monthlyCountData, countryBookingData);
        }else{
            // If no cached data available, show default/error state
            console.log("No cached data available, showing default values");
            updateAccountUI({count: 0}, {count: 0});
        }
    }
});

function updateAccountUI(monthlyCountData, countryBookingCountData){
    // Update monthly booking count display
    const bookingCountElement = document.getElementById("monthly-booking-count");
    bookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${monthlyCountData.count}`;

    // Update country booking count display
    const countryBookingCountElement = document.getElementById("country-booking-count");
    countryBookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${countryBookingCountData.count}`;

    // Progress bars

    // BOOKING COUNT PROGRESS BAR
    let min = 0;
    let max = 10;
    let monthlyCountValue = monthlyCountData.count;

    const monthlyCountPercentage = ((monthlyCountValue - min) / (max - min)) * 100;

    const bookingCountProgressBar = document.getElementById("bookingCountProgressBar");
    bookingCountProgressBar.style.width = monthlyCountPercentage + "%";

    const monthlyCountSummaryElement = document.getElementById("monthly-count-performance-summary");
    monthlyCountSummaryElement.textContent = `${monthlyCountValue} / ${max} bookings toward monthly goal`;

    // UK PROGRESS BAR
    let countryMin = 0;
    let countryMax = 5;
    let countryCountValue = countryBookingCountData.count;

    const monthlyCountryCountPercentage = ((countryCountValue - countryMin) / (countryMax - countryMin)) * 100;
    const countryCountProgressBar = document.getElementById("countryCountProgressBar");
    countryCountProgressBar.style.width = monthlyCountryCountPercentage + "%";

    const countryCountSummaryElement = document.getElementById("country-count-performance-summary");
    countryCountSummaryElement.textContent = `${countryCountValue} / ${countryMax} UK bookings toward monthly goal`;
}