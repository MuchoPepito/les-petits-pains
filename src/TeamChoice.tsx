import React, { Component } from "react";
import restApiService from "./RestApiService";
import localUserService from "./LocalUserService";

class TeamChoice extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      equipes: new Array(),
      errors: "",
      currentParticipant: localUserService.getLocalUser()
    };
  }

  async componentDidMount() {
    const equipesData = await restApiService.getEquipes();
    this.setState({
      equipes: equipesData._embedded.equipes,
      chosenTeamRef: equipesData._embedded.equipes[0]._links.equipe.href
    });
    console.log(this.state.equipes);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("submit team id : " + this.state.chosenTeamRef);
    this.state.currentParticipant.equipe = this.state.chosenTeamRef;
    if(this.state.newUsername){
      this.state.currentParticipant.name = this.state.newUsername;
    }
    restApiService
      .updateCurrentParticipant(this.state.currentParticipant)
      .catch(error => {
        console.log("Error:" + error.message);
        this.setState({ errors: error.message });
      })
      .then(() => {
        localUserService.updateLocalUserName(this.state.newUsername);
        this.props.history.replace("/")
      });
  };

  handleSelectChange = async (e: any) => {
    this.setState({
      chosenTeamRef: e.target.value
    });
  };

  handleInputChange = async (e:any) => {
    console.log(e.target.value)
    this.setState({
      newUsername : e.target.value
    });
  }

  render() {
    const nameInput = (
      <div className="form-group">
        <label htmlFor="name">Votre nom d'utilisateur (Prénom et Nom):</label>
        <input type="text" className="form-control" placeholder="ex: Valentchoin Ricrac" onChange={this.handleInputChange}></input>
        <small id="nameHelp" className="form-text text-muted">Ce champ apparaît car votre nom n'a pas pu être récupéré.</small>
      </div>
    );

    return (
      <div className="offset-sm-4 offset-2">
        <form onSubmit={this.handleSubmit}>
          {this.state.currentParticipant.name.includes("@") ? nameInput : ""}

          <div className="form-group">
            <label htmlFor="selectTeam">Veuillez choisir une équipe :</label>
            <select
              className="form-control"
              id="selectTeam"
              onChange={this.handleSelectChange}
              defaultValue={this.state.chosenTeamRef}
            >
              {this.state.equipes.map((equipe: any, index: number) => (
                <option key={equipe.id} value={equipe._links.equipe.href}>
                  {equipe.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <button type="submit" className="btn btn-info">
              Valider
            </button>
          </div>
          <span style={{ color: "red" }}>{this.state.errors}</span>
        </form>
      </div>
    );
  }
}

export default TeamChoice;
