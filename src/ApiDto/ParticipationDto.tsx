import EchangeDto from "./EchangeDto";
import ParticipantDto from "./ParticipantDto";
class ParticipationDto {
  constructor() {
      this.participant = new ParticipantDto();
      this.date = new Date();
      this.echange = new EchangeDto();
  }

  participant: ParticipantDto;

  date: Date;

  echange: EchangeDto;
}

export default ParticipationDto;
