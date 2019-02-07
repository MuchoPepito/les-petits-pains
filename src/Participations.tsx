import React, { Component } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import moment from "moment";
import Properties from "./Properties";
import localUserService from "./LocalUserService";
class Participations extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      participations: [],
      ownParticipation: null
    };
  }

  async componentDidMount() {
    try {
      const localUser = localUserService.getLocalUser();
      const response = await restApiService.getActiveParticipations();
      let participations = response._embedded.participations;
      participations.map((participation: any, index: number) => {
        if (participation.participant.id === localUser.id) {
          this.setState({ ownParticipation: participation });
        }
        this.setState({
          participations: [...this.state.participations, participation]
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="card bg-light col p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0 mt-0">
            {/* <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nom</th>
              <th scope="col">Date</th>
              <th scope="col">Swap</th>
            </tr>
          </thead> */}
            <tbody>
              {this.state.participations.map(
                (participation: any, index: number) => {
                  return (
                    <Participation
                      key={participation.id}
                      order={index + 1}
                      name={participation.participant.name}
                      date={participation.date}
                      isActive={participation.active}
                      id={participation.id}
                      ownParticipation={this.state.ownParticipation}
                    />
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

interface Participation {
  order: number;
  name: string;
  date: Date;
  isActive: boolean;
  id: number;
  ownParticipation: any;
}

const Participation = (props: Participation) => {
  const { order, name, date, isActive, id, ownParticipation } = props;
  if (!isActive) {
    return null;
  }

  async function handleEchange() {
    const urlEchange =      Properties.contextUrl
    .concat(Properties.endPoints.demanderEchange)
    .concat("?idParticipation1=")
    .concat(ownParticipation.id.toString())
    .concat("&idParticipation2=")
    .concat(id.toString());
    console.log(urlEchange);
  }

  return (
    <tr>
      <th scope="row">{order}</th>
      <td>{name}</td>
      <td>{moment(date).format("DD/MM/YYYY")}</td>
      {auth0Client.isAuthenticated() ? (
        <td>
          <span
            className="ml-3 oi oi-transfer cursorhover"
            onClick={handleEchange}
          />
          <span className="oi oi-tag ml-2 disablehover" />
        </td>
      ) : (
        <td>swap link not available (sign in to see it)</td>
      )}
    </tr>
  );
};

export default Participations;
