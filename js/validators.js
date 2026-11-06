export function validateName(name){
    if(name===""){
        return "veuillez saisir le nom ";
    }
    return;
}
export function validateSeat(reservations,seat,index=-1){
     for (let i = 0; i < reservations.length; i++) {
        if (
            i !== index &&
            reservations[i].seat === seat
        ) {
            return "Ce siège est occupé";
        }
    }
    return "";
}

export function validateDuplicateName(reservations, name, index = -1){
    for(let i=0;i<reservations.length;i++){ 
     if (
            i !== index &&
            reservations[i].name.toLowerCase() === name.toLowerCase()
        ) {
            return "Ce passager existe déjà";
        }
    }
    return "";}

export function validatePassenger(reservations,name){
     for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].name === name) {
            return "";
        }
    }
    return "Passager introuvable";
}
