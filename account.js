document.addEventListener("DOMContentLoaded", async function(){
    try{
        const response = await fetch("http://localhost:5000/bookings/monthly-count");

        if(!response.ok){
            throw new Error("Failed to fetch booking count");
        }

        const data = await response.json();
        console.log(data);
        const bookingCountElement = document.getElementById("monthly-booking-count");
        bookingCountElement.innerHTML = `<i class="fas fa-calendar-check"></i> ${data.count}`;


        // Progress bar

        let min = 0;
        let max = 10;
        let value = data.count;

        const percentage = ((value - min) / (max - min)) * 100

        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = percentage + "%";

        const summaryElement = document.getElementById("performance-summary");
        summaryElement.textContent = `${value} / ${max} monthly bookings toward monthly goal`;


        /*
        using booking count value, depending on range of this number between 0 - 10
        It calculates a percentage.
        Using this percentage it sets the percentage of the progress bar
         */


    } catch (error) {
        console.error("Error fetching monthly booking count:", error);
    }




})