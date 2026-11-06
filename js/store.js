export async function loadTrips() {
    let data = localStorage.getItem("trips");
    if (data) {
        return JSON.parse(data);
    }
    const response = await fetch("./data/trips.json");
    const trips = await response.json();
    saveTrips(trips);
    return trips;
}
export function getTrips() {
    let data = localStorage.getItem("trips");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}
export function saveTrips(trips) {
    localStorage.setItem("trips", JSON.stringify(trips));
}
