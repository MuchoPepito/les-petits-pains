import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";

const currentParticipantKey = "currentParticipant";
class Callback extends Component<any, any> {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    await this.generateAndStoreParticipant();
    if (!this.checkIfUserHasATeam()) {
      console.log("redirection vers choix de l'équipe");
      this.props.history.replace("/teamchoice");
    } else {
      console.log("Redirection vers participations");
      this.props.history.replace("/");
    }
  }

  generateAndStoreParticipant = async () => {
    const participant = await restApiService.generateParticipant();
    localStorage.setItem(currentParticipantKey, JSON.stringify(participant));
  };

  checkIfUserHasATeam = () => {
    if (auth0Client.isAuthenticated) {
      const participant = JSON.parse(
        localStorage.getItem(currentParticipantKey) || "{}"
      );
      if (!participant.equipe) {
        console.log("L'utilisateur n'a pas d'équipe");
        return false;
      }
      return true;
    }
    return false;
  };

  render() {
    return <p className="offset-5">Chargement...</p>;
  }
}

export default withRouter(Callback);
