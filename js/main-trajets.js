
import { loadTrips } from "./store.js";
import { displayTrips } from "./render.js";

let currentPage = 1;
let tripsPage = 6;
let allTrips = [];
let filteredTrips = [];

async function loadAndDisplayTrips() {
    try {
        allTrips = await loadTrips();
        filteredTrips = allTrips;
        displayCurrentPage();
    } catch (error) {
        console.log(error);
    }
}
function filtrer() {
    let search = document.getElementById("search").value.toLowerCase().trim();
    let status = document.getElementById("status-filter").value;
    filteredTrips = allTrips.filter(function(trip) {
        let matchSearch = 
            trip.departure.toLowerCase().includes(search) ||
            trip.destination.toLowerCase().includes(search);
        let matchStatus = true;
        if (status === "disponible") {
            matchStatus = trip.capacity > trip.reservations.length;
        }
        if (status === "complete") {
            matchStatus = trip.capacity <= trip.reservations.length;
        }
        return matchSearch && matchStatus;
    });
    currentPage = 1;
    displayCurrentPage();
}
function displayCurrentPage() {
    let grid = document.getElementById("trips-grid");
    let start = (currentPage - 1) * tripsPage;
    let end = start + tripsPage;
    let pageTrips = [];
    for (let i = start; i < end && i < filteredTrips.length; i++) {
        pageTrips.push(filteredTrips[i]);
    }
    if (filteredTrips.length === 0) {
        grid.innerHTML = "Aucun trajet ne correspond";
    } else {
        displayTrips(pageTrips, grid);
    }
    pagination();
}
function pagination() {
    let paginationDiv = document.getElementById("pagination");
    let totalPages = Math.ceil(filteredTrips.length / tripsPage);
    paginationDiv.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement("button");
        button.textContent = i;
        button.className = "px-4 py-2 border rounded-lg";
        if (currentPage === i) {
            button.classList.add("bg-white", "text-black");
        }
        button.addEventListener("click", function() {
            currentPage = i;
            displayCurrentPage();
        });
        paginationDiv.append(button);
    }
}
document.getElementById("status-filter").addEventListener("change", filtrer);
loadAndDisplayTrips();
document.getElementById("search").addEventListener("input",filtrer);
