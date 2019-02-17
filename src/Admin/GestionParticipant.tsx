import React, { Component, useState } from "react";
import restApiService from "../RestApiService";

class GestionParticipant extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      participants: []
    };
  }

  async componentDidMount() {
    await this.updateParticipants();
  }

  updateParticipants = async () => {
    console.log("updating participants...")
    const participantsData = await restApiService.getParticipants();
    this.setState({
      participants: participantsData._embedded.participants.sort(
        (a: any, b: any) => a.id - b.id
      )
    });
  };

  render() {
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-3">Nom</div>
          <div className="col-6">Email</div>
          <div className="col-2">Actif</div>
        </div>
        {this.state.participants.map((participant: any, index: number) => {
            console.log('rendering...')
          return (
            <ParticipantForm
              key={participant.id}
              participant={participant}
              updateParticipants={this.updateParticipants}
            />
          );
        })}
      </div>
    );
  }
}

const ParticipantForm = (props: any) => {
  const { id, name, email, active } = props.participant;
  const { updateParticipants } = props;
  const [participantName, setParticipantName] = useState(name);
  const [participantEmail, setParticipantEmail] = useState(email);
  const [participantIsActive, setParticipantIsActive] = useState(active);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`modification de ${participantName}`);
    await restApiService.updateParticipant(id, {
      name: participantName,
      email: participantEmail,
      active: participantIsActive
    });
    alert(`Le participant ${participantName} a bien été mis à jour.`)
    updateParticipants();
  };

  const handleName = (e: any) => {
    console.log(e.target.value);
    setParticipantName(e.target.value);
  };

  const handleEmail = (e: any) => {
    console.log(e.target.value);
    setParticipantEmail(e.target.value);
  };

  const handleIsActive = (e: any) => {
    console.log(e.target.checked);
    setParticipantIsActive(e.target.checked);
  };

  return (
    <form className="mt-2">
      <div className="form-row">
        <input
          id="name"
          className="form-control col-3"
          type="text"
          value={participantName}
          onChange={handleName}
        />
        <input
          id="email"
          className="form-control col-6 ml-2"
          type="text"
          value={participantEmail}
          onChange={handleEmail}
        />
        <input
          id="isactive"
          className="my-auto ml-4 mr-4"
          type="checkbox"
          checked={participantIsActive}
          onChange={handleIsActive}
        />
        <button
          onClick={handleSubmit}
          className="form-control btn btn-info col-2"
        >
          Modifier
        </button>
      </div>
    </form>
  );
};

export default GestionParticipant;
