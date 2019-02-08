import React, { Component } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import moment from "moment";
import Properties from "./Properties";
import localUserService from "./LocalUserService";
import { OverlayTrigger, Popover } from "react-bootstrap";
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
      let ownParticipation = participations.filter((p:any) => p.participant.id === localUser.id)[0];
      console.log(ownParticipation);
      this.setState({ ownParticipation: ownParticipation });
      participations.map((participation: any, index: number) => {
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
            <tbody>
              {this.state.participations.map(
                (participation: any, index: number) => {
                  console.log(participation);
                  return (
                    <Participation
                      key={participation.id}
                      order={index}
                      participation={participation}
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
  participation: any;
  ownParticipation: any;
}

const Participation = (props: Participation) => {
  const { participation, ownParticipation } = props;
  const { date, active, id } = participation;
  const { name } = participation.participant;
  if (!active) {
    return null;
  }

  async function handleEchange() {
    const urlEchange = Properties.contextUrl
      .concat(Properties.endPoints.demanderEchange)
      .concat("?idParticipation1=")
      .concat(ownParticipation.id.toString())
      .concat("&idParticipation2=")
      .concat(id.toString());
    console.log(urlEchange);
  }

  const infoTag = <span className="oi oi-tag ml-2" />;

  const popover = (
    <Popover id="popover-basic" title="Echange en cours" style={{pointerEvents: "none"}}>
        {participation.echange && participation.echange.emetteurName} souhaite échanger sa place avec {participation.echange && participation.echange.destinataireName}
    </Popover>
  );

  const activeEchangeComponent = (
    <td>
      {participation.echange ? (
        ""
      ) : (
        <span
          className={"ml-2 oi oi-transfer " + (ownParticipation.echange ? "disablehover": "cursorhover")}
          onClick={participation.echange ? handleEchange : ()=>{return;}}
        />
      )}
      {participation.echange && (
        <OverlayTrigger placement="left" overlay={popover}>
          {infoTag}
        </OverlayTrigger>
      )}
    </td>
  );

  const disabledEchangeComponent = (
    <td>swap link not available (sign in to see it)</td>
  );

  return (
    <tr>
      <th scope="row">{props.order + 1}</th>
      <td>{name}</td>
      <td>{moment(date).format("DD/MM/YYYY")}</td>
      {auth0Client.isAuthenticated()
        ? activeEchangeComponent
        : disabledEchangeComponent}
    </tr>
  );
};

export default Participations;
