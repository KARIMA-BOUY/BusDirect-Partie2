export function displayTrips(trips, grid) {
    grid.innerHTML = "";
    for (let i = 0; i < trips.length; i++) {
        let trip = trips[i];
        let capacity = 20;
        if (trip.capacity) {
            capacity = trip.capacity;
        }
        let reservedCount = 0;
        if (trip.reservations) {
            reservedCount = trip.reservations.length;
        }
        let freeSeats = capacity - reservedCount;
        let status = "DISPONIBLE";
        let color = "text-emerald-600";
        if (freeSeats <= 0) {
            status = "COMPLET";
            color = "text-rose-600";
        }
        grid.innerHTML += `
            <div class="bg-white rounded-3xl p-6 border shadow-sm">

                <div class="flex justify-between mb-4">
                    <span class="${color} font-bold">
                        ${status}
                    </span>
                </div>
                <div class="flex justify-between my-4">
                    <div>
                        <h4 class="text-lg font-bold">
                            ${trip.departure}
                        </h4>
                        <p>${trip.departureTime}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold">
                            ${trip.destination}
                        </h4>
                        <p>${trip.arrivalTime}</p>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center border-t pt-4">
                    <div>
                        <p>Prix</p>
                        <p>${trip.price} DH</p>
                    </div>
                    <div>
                        <p>Libres</p>
                        <p>${freeSeats}/${capacity}</p>
                    </div>

                    <div>
                        <p>Attente</p>
                        <p>${trip.waitingList ? trip.waitingList.length : 0}</p>
                    </div>
                </div>
                <button
                    class="open-cabin w-full mt-6 py-3 rounded-2xl border"
                    data-id="${trip.id}">
                    Ouvrir la cabine
                </button>
            </div>
        `;
    }
    const buttons = grid.querySelectorAll(".open-cabin");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            let id = this.dataset.id;
            window.location.href = "cabine.html?id=" + id;
        });
    }
}