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
}

const localUserService = new LocalUserService();

export default localUserService;
