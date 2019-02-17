import axios from "axios";
import auth0Client from "./Auth";
import Properties from "./Properties";
import moment from "moment";

const { contextUrl, endPoints } = Properties;

class RestApiService {
  constructor() {}

  accepterEchange = async (id: number) => {
    return this.handleEchange(id, endPoints.accepterEchange);
  }

  annulerEchange = async (id: number) => {
    return this.handleEchange(id, endPoints.annulerEchange);
  }

  refuserEchange = async (id:number) => {
    return this.handleEchange(id, endPoints.refuserEchange);
  }

  private async handleEchange(id: number, endpoint:string){
    let axiosParams = {
      headers : this.generateHeadersWithBearerToken()['headers'],
      params : {
        id : id
      }
    }
    const uriRefuserEchange = contextUrl.concat(endpoint);
    const response = await axios.get(uriRefuserEchange, axiosParams);
    return response.data;
  }

  askEchange = async (ownParticipation:any, participation:any) => {
    let axiosParams = {
      headers : this.generateHeadersWithBearerToken()['headers'],
      params : {
        idParticipation1 : ownParticipation.id,
        idParticipation2 : participation.id
      }
    }
    const uriDemanderEchange = contextUrl.concat(endPoints.demanderEchange);
    const response = await axios.get(uriDemanderEchange, axiosParams);
    return response.data;
  }

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
    const response = await axios.get(contextUrl.concat(endPoints.participations).concat("search/findAllByDateIsGreaterThanEqualOrderByDateAsc"), {
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

  createEquipe = async (equipe: any) => {
    return this.createResource(endPoints.equipes, equipe);
  };

  createParticipant = async (participant: any) => {
    return this.createResource(endPoints.participants, participant);
  };

  createParticipation = async (participation: any) => {
    return this.createResource(endPoints.participations, participation);
  };

  createEchange = async (echange: any) => {
    return this.createResource(endPoints.equipes, echange);
  };

  updateEquipe = async (id: number, equipe: any) => {
    return this.updateResource(endPoints.equipes.concat(id.toString()), equipe);
  };

  updateParticipant = async (
    resouceRef: string,
    participant: any
  ) => {
    return this.updateResource(resouceRef, participant);
  };

  updateCurrentParticipant = async (currentParticipant:any) => {
    return this.updateResource(endPoints.participants.concat(currentParticipant.id.toString()), currentParticipant);
  }

  updateParticipation = async (
    resouceRef: string,
    participation: any
  ) => {
    return this.updateResource(resouceRef, participation);
  };

  updateEchange = async (resouceRef: string, echange: any) => {
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
