import ParticipantDto from "./ParticipantDto";

class EquipeDto {
    constructor(){
        this.nom = "nameUpdatedWithPatch";
        this.membres = [];
    }

    nom: string;

    membres: ParticipantDto[];



}

export default EquipeDto;