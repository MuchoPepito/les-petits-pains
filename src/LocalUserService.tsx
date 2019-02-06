import auth0Client from "./Auth";

const currentParticipantKey = "currentParticipant";

class LocalUserService {
  constructor() {}

  getLocalUser = () => {
    if (auth0Client.isAuthenticated) {
      const participant = JSON.parse(
        localStorage.getItem(currentParticipantKey) || "{}"
      );
      return participant;
    }
    return null;
  };

  updateLocalUserName = (name:string) => {
    let localUser = this.getLocalUser();
    localUser.name = name;
    localStorage.setItem(currentParticipantKey, JSON.stringify(localUser));
  }

}

const localUserService = new LocalUserService();

export default localUserService;
