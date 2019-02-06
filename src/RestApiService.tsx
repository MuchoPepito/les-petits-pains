import axios from "axios";
import auth0Client from "./Auth";
import EquipeDto from "./ApiDto/EquipeDto";
import Properties from "./Properties";
import ParticipantDto from "./ApiDto/ParticipantDto";
import ParticipationDto from "./ApiDto/ParticipationDto";
import EchangeDto from "./ApiDto/EchangeDto";
import moment from "moment";

const { contextUrl, endPoints } = Properties;

class RestApiService {
  constructor() {}

  whoAmI = async () => {
    const headers = this.generateHeadersWithBearerToken();
    const response = await axios.get(contextUrl.concat("whoami"), headers);
    return response.data;
  }

  generateParticipant = async () => {
    const headers = this.generateHeadersWithBearerToken();
    const response = await axios.get(contextUrl.concat("generateParticipant"), headers)
    return response.data;
  }

  getActiveParticipations = async() => {
    const response = await axios.get(contextUrl.concat(endPoints.participations).concat("search/findAllByDateIsGreaterThanEqual"), {
      params: {
        date: moment().format("YYYY-MM-DD")
      }
    })
    return response.data;
  }

  getParticipants = async () => {
    return this.getResource(endPoints.participants);
  };

  getParticipations = async () => {
    return this.getResource(endPoints.participations);
  };

  getEchanges = async () => {
    return this.getResource(endPoints.echanges);
  };

  getEquipes = async () => {
    return this.getResource(endPoints.equipes);
  };

  getEquipe = async (id: number) => {
    return this.getResource(endPoints.equipes.concat(id.toString()));
  };

  getEchange = async (id: number) => {
    return this.getResource(endPoints.echanges.concat(id.toString()));
  };

  getParticipant = async (id: number) => {
    return this.getResource(endPoints.participants.concat(id.toString()));
  };

  getParticipation = async (id: number) => {
    return this.getResource(endPoints.participations.concat(id.toString()));
  };

  createEquipe = async (equipe: EquipeDto) => {
    return this.createResource(endPoints.equipes, equipe);
  };

  createParticipant = async (participant: ParticipantDto) => {
    return this.createResource(endPoints.participants, participant);
  };

  createParticipation = async (participation: ParticipationDto) => {
    return this.createResource(endPoints.participations, participation);
  };

  createEchange = async (echange: EchangeDto) => {
    return this.createResource(endPoints.equipes, echange);
  };

  updateEquipe = async (resouceRef: string, equipe: EquipeDto) => {
    return this.updateResource(resouceRef, equipe);
  };

  updateParticipant = async (
    resouceRef: string,
    participant: ParticipantDto
  ) => {
    return this.updateResource(resouceRef, participant);
  };

  updateCurrentParticipant = async (currentParticipant:any) => {
    return this.updateResource(endPoints.participants.concat(currentParticipant.id.toString()), currentParticipant);
  }

  updateParticipation = async (
    resouceRef: string,
    participation: ParticipantDto
  ) => {
    return this.updateResource(resouceRef, participation);
  };

  updateEchange = async (resouceRef: string, echange: EchangeDto) => {
    return this.updateResource(resouceRef, echange);
  };

  deleteEquipe = async (id:number) => {
    return this.deleteResource(endPoints.equipes.concat(id.toString()));
  }

  deleteParticipant = async (id:number) => {
    return this.deleteResource(endPoints.participants.concat(id.toString()));
  }

  deleteParticipation = async (id:number) => {
    return this.deleteResource(endPoints.participations.concat(id.toString()));
  }

  deleteEchange = async (id:number) => {
    return this.deleteResource(endPoints.echanges.concat(id.toString()));
  }

  private updateResource = async (resourceRef: string, resource: Object) => {
    const headers = this.generateHeadersWithBearerToken();
    try {
      const response = await axios.patch(
        this.normalizeResourceLocation(resourceRef),
        resource,
        headers
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw err
    }
  };

  private deleteResource = async (resourceRef: string) => {
    const headers = this.generateHeadersWithBearerToken();
    try {
        const response = await axios.delete(this.normalizeResourceLocation(resourceRef), headers);
        return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  private createResource = async (resourceName: string, resource: Object) => {
    const headers = this.generateHeadersWithBearerToken();
    try {
      const response = await axios.post(
        this.normalizeResourceLocation(resourceName),
        resource,
        headers
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  private getResource = async (resourceName: string) => {
    try {
      const response = await axios.get(
        this.normalizeResourceLocation(resourceName)
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  private normalizeResourceLocation = (resourceRef: string) => {
    let ref = resourceRef.replace(contextUrl, "");
    return contextUrl.concat(ref);
  };

  private generateHeadersWithBearerToken = () => {
    if (!auth0Client.isAuthenticated) {
      throw "Client is not authenticated !";
    }
    const AuthStr = "Bearer ".concat(auth0Client.getAccessToken());
    return {
      headers: {
        Authorization: AuthStr
      }
    };
  };
}

const restApiService = new RestApiService();

export default restApiService;
