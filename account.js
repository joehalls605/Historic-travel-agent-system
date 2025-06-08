document.addEventListener("DOMContentLoaded", async function(){
    try{
        const response = await fetch("http://localhost:5000/bookings/monthly-count");

        if(!response.ok){
            throw new Error("Failed to fetch booking count");
        }

        const data = await response.json();
        const bookingCountElement = document.getElementById("monthly-booking-count");
        bookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${data.count}`;
    } catch (error) {
        console.error("Error fetching monthly booking count:", error);
    }
})