
// let currentPage = 1;
// let tripsPage = 6;
// let allTrips = [];
// async function loadAndDisplayTrips() {
//     try {
//         const response = await fetch('../data/trips.json');
//         const trips = await response.json();
//         allTrips = trips;
//         const grid = document.getElementById('trips-grid');
//         if (grid === null) {
//             return;
//         }
//         grid.innerHTML = "";
//         let start = (currentPage - 1) * tripsPage;
//         let end = start + tripsPage;
//         for (let i = start; i < end && i < allTrips.length; i++) {
//             let trip = allTrips[i];
//             let capacity = 20;
//             if (trip.capacity) {
//                 capacity = trip.capacity;
//             }
//             let reservedCount = 0;
//             if (trip.reservations) {
//                 reservedCount = trip.reservations.length;
//             }
//             let freeSeats = capacity - reservedCount;
//             let status = "DISPONIBLE";
//             let color = "text-emerald-600";
//             if (freeSeats <= 0) {
//                 status = "COMPLET";
//                 color = "text-rose-600";
//             }
//             grid.innerHTML += `
//                 <div class="bg-white rounded-3xl p-6 border shadow-sm">
//                     <div class="flex justify-between mb-4">
//                         <span class="${color} font-bold">
//                             ${status}
//                         </span>
//                     </div>

//                     <div class="flex justify-between my-4">
//                         <div>
//                             <h4 class="text-lg font-bold">${trip.departure}</h4>
//                             <p>${trip.departureTime}</p>
//                         </div>

//                         <div>
//                             <h4 class="text-lg font-bold">${trip.destination}</h4>
//                             <p>${trip.arrivalTime}</p>
//                         </div>
//                     </div>
//                     <div class="grid grid-cols-3 gap-2 text-center border-t pt-4">
//                         <div>
//                             <p>Prix</p>
//                             <p>${trip.price} DH</p>
//                         </div>
//                         <div>
//                             <p>Libres</p>
//                             <p>${freeSeats}/${capacity}</p>
//                         </div>

//                         <div>
//                             <p>Attente</p>
//                             <p>${trip.waitingList ? trip.waitingList.length : 0}</p>
//                         </div>
//                     </div>

//                     <button onclick="openCabin(${trip.id})"
//                         class="w-full mt-6 py-3 rounded-2xl border">
//                         Ouvrir la cabine
//                     </button>
//                 </div>
//             `;
//         }
//         pagination();

//     } catch (error) {
//         console.log("Erreur :", error);
//     }
// }
// function pagination() {
//     const paginationDiv = document.getElementById("pagination");
//     let totalPages = Math.ceil(allTrips.length / tripsPage);
//     paginationDiv.innerHTML = "";
//     for (let i = 1; i <= totalPages; i++) {
//         paginationDiv.innerHTML += `
//             <button
//                 onclick="changePage(${i})"
//                 class="px-4 py-2 border rounded-lg
//                 ${currentPage === i ? 'text-black' : ''}">
//                 ${i}
//             </button>
//         `;
//     }
// }
// function changePage(page) {
//     currentPage = page;
//     loadAndDisplayTrips();
// }
// function openCabin(id) {
//     window.location.href = "cabine.html?id=" + id;
// }
// loadAndDisplayTrips();