
import { loadTrips, saveTrips } from "./store.js";
let trips = [];
let trip = null;
let oldSeat = null;
async function loadCabine() {
    try {
        trips = await loadTrips();
        let url = new URLSearchParams(window.location.search);
        let id = Number(url.get("id"));

        for (let i = 0; i < trips.length; i++) {
            if (trips[i].id === id) {
                trip = trips[i];
            }
        }
        if (trip === null) {
            console.log("Trajet introuvable");
            return;
        }
        if (!trip.reservations) {
            trip.reservations = [];
        }
        if (!trip.waitingList) {
            trip.waitingList = [];
        }

        renderAll();
        attachEvents();

    } catch (error) {
        console.log(error);
    }
}
function renderAll() {
    displaySeats();
    updateKPIs();
    updateSelects();
    displayTickets();
     displaywaitingList()
}
function displaySeats() {
    let grid = document.getElementById("bus-cabin-grid");
    grid.innerHTML = "";
    for (let i = 1; i <= trip.capacity; i++) {
        let book = null;
        for (let j = 0; j < trip.reservations.length; j++) {
            if (trip.reservations[j].seat === i) {
                book = trip.reservations[j];
            }
        }
        let seat = document.createElement("button");
        seat.className = "p-4 rounded-lg border";
        seat.dataset.seat = i;
        if (book !== null) {
            seat.textContent = i + " - " + book.name;
            seat.classList.add("bg-red-500", "text-white");
            seat.title = book.name;
            seat.draggable = true;
        } else {
            seat.textContent = i + " - Libre";
            seat.classList.add("bg-green-500", "text-white");
        }
        seat.addEventListener("dragstart", function() {
            if (book !== null) {
                oldSeat = i;
            }
        });
        seat.addEventListener("dragover", function(event) {
            event.preventDefault();
        });
        seat.addEventListener("drop", function(event) {
            event.preventDefault();
            moveReservation(i);
        });
        grid.append(seat);
    }
}
function updateKPIs() {
    let count = trip.reservations.length;
    let free = trip.capacity - count;
    let total = count * trip.price;
    document.getElementById("header-available-count").textContent = free;
    document.getElementById("header-total-revenue").textContent =
        total + " DH";
    let alert = document.getElementById("full-bus-alert");
    if (free === 0) {
        alert.classList.remove("hidden");
    } else {
        alert.classList.add("hidden");
    }
}
function updateSelects() {
    let reserveList = document.getElementById("reserve-seat-select");
    let editList = document.getElementById("edit-passenger-select");
    let seatList = document.getElementById("edit-seat-select");
    let deleteList = document.getElementById("delete-passenger-select");
    reserveList.innerHTML = '<option value="">Choisir un siège</option>';
    editList.innerHTML = '<option value="">Choisir un passager</option>';
    seatList.innerHTML = '<option value="">Choisir un siège</option>';
    deleteList.innerHTML = '<option value="">Choisir un passager</option>';
    for (let i = 1; i <= trip.capacity; i++) {
        let occupied = false;

        for (let j = 0; j < trip.reservations.length; j++) {
            if (trip.reservations[j].seat === i) {
                occupied = true;
            }
        }

        if (occupied === false) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = "Siège " + i;
            reserveList.append(option);

            let option2 = document.createElement("option");
            option2.value = i;
            option2.textContent = "Siège " + i;
            seatList.append(option2);
        }
    }

    for (let i = 0; i < trip.reservations.length; i++) {
        let book = trip.reservations[i];

        let option = document.createElement("option");
        option.value = book.name;
        option.textContent = book.name;
        editList.append(option);

        let option2 = document.createElement("option");
        option2.value = book.name;
        option2.textContent = book.name;
        deleteList.append(option2);
    }
}

function reserveSeat() {
    let name = document.getElementById("reserve-name").value.trim();
    let phone = "";
    let phoneInput = document.getElementById("reserve-phone");

    if (phoneInput) {
        phone = phoneInput.value.trim();
    }
    let seatValue = document.getElementById("reserve-seat-select").value;
    if (name === "") {
        showMessage("msg-reserve", "Veuillez saisir le nom");
        return;
    }
    for (let i = 0; i < trip.reservations.length; i++) {
        if (trip.reservations[i].name.toLowerCase() === name.toLowerCase()) {
            showMessage("msg-reserve", "Ce passager existe déjà");
            return;
        }
    }
    let seat = Number(seatValue);
    if (seatValue === "") {
        seat = 0;
        for (let i = 1; i <= trip.capacity; i++) {
            let occupied = false;
            for (let j = 0; j < trip.reservations.length; j++) {
                if (trip.reservations[j].seat === i) {
                    occupied = true;
                }
            }
            if (occupied === false) {
                seat = i;
                break;
            }
        }
    }

    if (seat === 0) {
        trip.waitingList.push({
            name: name,
            phone: phone
        });
        saveTrips(trips);
        renderAll();

        showMessage("msg-reserve", "Ajouté à la liste d'attente");
        document.getElementById("form-reserve").reset();
        return;
    }

    let book = {
        seat: seat,
        name: name,
        phone: phone
    };

    trip.reservations.push(book);

    saveTrips(trips);
    renderAll();

    showMessage("msg-reserve", "Réservation ajoutée");
    document.getElementById("form-reserve").reset();
}
function editReservation() {
    let oldName = document.getElementById("edit-passenger-select").value;
    let name = document.getElementById("edit-name").value.trim();
    let phone = "";
    let phoneInput = document.getElementById("edit-phone");

    if (phoneInput) {
        phone = phoneInput.value.trim();
    }

    let seatValue = document.getElementById("edit-seat-select").value;

    if (oldName === "") {
        showMessage("msg-edit", "Choisissez un passager");
        return;
    }

    let index = -1;

    for (let i = 0; i < trip.reservations.length; i++) {
        if (trip.reservations[i].name === oldName) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        return;
    }
    if (name !== "") {
        for (let i = 0; i < trip.reservations.length; i++) {
            if (i !== index &&
                trip.reservations[i].name.toLowerCase() === name.toLowerCase()) {
                showMessage("msg-edit", "Ce nom existe déjà");
                return;
            }
        }
    }
    let newSeat = Number(seatValue);
    if (seatValue !== "") {
        for (let i = 0; i < trip.reservations.length; i++) {
            if (i !== index && trip.reservations[i].seat === newSeat) {
                showMessage("msg-edit", "Ce siège est occupé");
                return;
            }
        }
    }
    if (name !== "") {
        trip.reservations[index].name = name;
    }
    if (phone !== "") {
        trip.reservations[index].phone = phone;
    }
    if (seatValue !== "") {
        trip.reservations[index].seat = newSeat;
    }
    saveTrips(trips);
    renderAll();

    showMessage("msg-edit", "Modification réussie");
    document.getElementById("form-edit").reset();
}
function deleteReservation() {
    let name = document.getElementById("delete-passenger-select").value;

    if (name === "") {
        showMessage("msg-delete", "Choisissez un passager");
        return;
    }
    let index = -1;
    for (let i = 0; i < trip.reservations.length; i++) {
        if (trip.reservations[i].name === name) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        return;
    }
    let freeSeat = trip.reservations[index].seat;
    trip.reservations.splice(index, 1);
    if (trip.waitingList.length > 0) {
        let person = trip.waitingList.shift();
        trip.reservations.push({
            seat: freeSeat,
            name: person.name,
            phone: person.phone || ""
        });
    }

    saveTrips(trips);
    renderAll();

    showMessage("msg-delete", "Réservation supprimée");
}

function moveReservation(newSeat) {
    if (oldSeat === null || oldSeat === newSeat) {
        return;
    }
    let book = null;
    let occupied = false;
    for (let i = 0; i < trip.reservations.length; i++) {
        if (trip.reservations[i].seat === oldSeat) {
            book = trip.reservations[i];
        }
        if (trip.reservations[i].seat === newSeat) {
            occupied = true;
        }
    }
    if (book !== null && occupied === false) {
        book.seat = newSeat;
        saveTrips(trips);
        renderAll();
    }
    oldSeat = null;
}
function displayTickets() {
    let tickets = document.getElementById("tickets-container");
    let empty = document.getElementById("no-tickets-msg");
    tickets.innerHTML = "";

    if (trip.reservations.length === 0) {
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");

    for (let i = 0; i < trip.reservations.length; i++) {
        let book = trip.reservations[i];

        let ticket = document.createElement("div");
        ticket.className = "border rounded-lg p-4 mb-3";

        let title = document.createElement("h3");
        title.textContent = book.name;

        let seat = document.createElement("p");
        seat.textContent = "Siège : " + book.seat;

        let phone = document.createElement("p");
        phone.textContent = "Téléphone : " + (book.phone || "Non renseigné");

        let price = document.createElement("p");
        price.textContent = "Prix : " + trip.price + " DH";

        ticket.append(title, seat, phone, price);
        tickets.append(ticket);
    }
}
function searchTicket() {
    let search = document.getElementById("search-ticket").value.toLowerCase();

    let tickets = document.querySelectorAll("#tickets-container > div");

    for (let i = 0; i < tickets.length; i++) {
        let name = tickets[i].querySelector("h3").textContent.toLowerCase();

        if (name.includes(search)) {
            tickets[i].classList.remove("hidden");
        } else {
            tickets[i].classList.add("hidden");
        }
    }
}
function showMessage(id, message) {
    let msg = document.getElementById(id);

    msg.textContent = message;
    msg.classList.remove("hidden");

    setTimeout(function() {
        msg.classList.add("hidden");
    }, 3000);
}

function displaywaitingList(){
    let container=document.getElementById("waiting-list-container");
    let empty=document.getElementById("no-waiting-msg");
    container.innerHTML="";

    if(trip.waitingList.length===0){
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    for(let i=0;i<trip.waitingList.length;i++){
        let person=trip.waitingList[i];
        let div=document.createElement("div");
        div.className="p-3 border rounded-lg flex justify-between";
        let name=document.createElement("span");
        name.textContent=(i+1)+"."+person.name;

        let phone=document.createElement("span");
        phone.textContent=person.phone||"sans telephone";

        div.append(name,phone);
        container.append(div);
    }
}
function attachEvents() {
    document.getElementById("form-reserve").addEventListener("submit", function(event) {
        event.preventDefault();
        reserveSeat();
    });
    document.getElementById("form-edit").addEventListener("submit", function(event) {
        event.preventDefault();
        editReservation();
    });
    document.getElementById("form-delete").addEventListener("submit", function(event) {
        event.preventDefault();
        deleteReservation();
    });

    document.getElementById("search-ticket").addEventListener("input", searchTicket);
}

loadCabine();
