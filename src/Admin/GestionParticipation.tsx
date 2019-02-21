import React, { Component, useState } from "react";
import restApiService from "../RestApiService";

class GestionParticipation extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      participations: []
    };
  }

  async componentDidMount() {
    await this.updateParticipations();
  }

  updateParticipations = async () => {
    console.log("updating participations...");
    this.setState({ participations: [] });
    const response = await restApiService.getActiveParticipations();
    this.setState({
      participations: response._embedded.participations
    });
    console.log(...this.state.participations);
  };

  handleUnshift = async() => {
    await restApiService.unshift();
    this.updateParticipations();
  }

  generateParticipations = async () => {
    await restApiService.generateParticipations();
    this.updateParticipations();
  }

  render() {
    return (
      <div className="mx-auto col-8">
              <div className="row">
        <div className="form-row col">
          <button type="button" className="btn btn-primary" onClick={this.handleUnshift}>
            Unshift
          </button>
          <button type="button" className="btn btn-primary ml-2" onClick={this.generateParticipations}>
            Générer participations
          </button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-3">Nom</div>
          <div className="col-6">Date</div>
        </div>
        {this.state.participations.map((participation: any, index: number) => {
          console.log("rendering...");
          return (
            <ParticipationForm
              key={participation.id}
              participation={participation}
              updateParticipations={this.updateParticipations}
            />
          );
        })}

      </div>
    );
  }
}

const ParticipationForm = (props: any) => {
  const { id, participant, date } = props.participation;
  const { updateParticipations } = props;
  const [_date, setDate] = useState(date);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`mise à jour de la participation à la date : ${_date}`);
    await restApiService.updateParticipation(id, {
        date: _date
    });
    updateParticipations();
    alert(`La participation a bien été mise à jour à la date ${_date}`)
  };

  const handleDate = (e: any) => {
    console.log(e.target.value);
    setDate(e.target.value);
  };

  return (
    <form className="mt-2">
      <div className="form-row">
        <input
          id="name"
          className="form-control col-3"
          type="text"
          value={participant.name}
          readOnly
        />
        <input
          id="date"
          className="form-control col-6 ml-2"
          type="date"
          value={_date}
          onChange={handleDate}
        />
        <button
          onClick={handleSubmit}
          className="form-control btn btn-info col-2 ml-2"
        >
          Modifier
        </button>
      </div>
    </form>
  );
};

export default GestionParticipation;
