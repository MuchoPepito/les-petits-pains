import React, { Component } from "react";
import restApiService from "./RestApiService";
import localUserService from "./LocalUserService";

class TeamChoice extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      equipes: new Array(),
      errors: ""
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
    let currentParticipant = localUserService.getLocalUser();
    currentParticipant.equipe = this.state.chosenTeamRef;
    restApiService
      .updateCurrentParticipant(currentParticipant)
      .catch(error => {
        console.log("Error:" + error.message);
        this.setState({errors: error.message});
      })
      .then(() => this.props.history.replace("/"));

  };

  handleChange = async (e: any) => {
    this.setState({
      chosenTeamRef: e.target.value
    });
  };

  render() {
    return (
      <div className="offset-sm-5 offset-2">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="selectTeam">Veuillez choisir une équipe :</label>
            <select
              className="form-control"
              id="selectTeam"
              onChange={this.handleChange}
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
          <span style={{color: 'red'}}>{this.state.errors}</span>
        </form>
      </div>
    );
  }
}

export default TeamChoice;
