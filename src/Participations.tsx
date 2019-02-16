import React, { Component, useState } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import moment from "moment";
import localUserService from "./LocalUserService";
import { OverlayTrigger, Popover } from "react-bootstrap";

class Participations extends Component<any, any> {

  private colorEchangeTag:any = new Map();

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  constructor(props: any) {
    super(props);
    this.state = {
      participations: [],
      ownParticipation: {
        id : 0,
        echange : {
          id: 0
        }
      }
    };
  }

  async componentDidMount() {
    try {
      const response = await restApiService.getActiveParticipations();
      let participations = response._embedded.participations;
      participations.filter(
        (p: any) => p.participant.id === localUserService.getLocalUser().id
      ).map((ownP:any) => this.setState({ ownParticipation: ownP }));
      
      participations.map((participation: any, index: number) => {
        if(participation.echange){
          this.colorEchangeTag.set(participation.echange.id, this.getRandomColor());
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
            <tbody>
              {this.state.participations.map(
                (participation: any, index: number) => {
                  return (
                    <Participation
                      key={participation.id}
                      order={index}
                      participation={participation}
                      ownParticipation={this.state.ownParticipation}
                      colorEchangeTag={this.colorEchangeTag}
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
  colorEchangeTag: any;
}

const Participation = (props: Participation) => {
  const { participation, ownParticipation, colorEchangeTag } = props;
  const { date, active, id } = participation;
  const { name } = participation.participant;
  const [callingApi, setCallingApi] = useState(false);

  if (!active) {
    return null;
  }

  const callEchangeApi = async (apiMethod: any) => {
    try {
      console.log("appel api échange...");
      setCallingApi(true);
      const response = await apiMethod();
      setCallingApi(false);
      console.log("fin appel api échange");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Une erreur s'est produite lors de la requête");
      window.location.reload();
    }
  };

  const handleEchange = async () => {
    console.log("Demande d'échange...");
    callEchangeApi(() =>
      restApiService.askEchange(ownParticipation, participation)
    );
  };

  const acceptEchange = async () => {
    console.log("Acceptation échange ...");
    callEchangeApi(() =>
      restApiService.accepterEchange(ownParticipation.echange.id)
    );
  };

  const cancelEchange = async () => {
    console.log("Annulation de l'échange...");
    if (
      ownParticipation.echange.emetteurId === ownParticipation.participant.id
    ) {
      callEchangeApi(() =>
        restApiService.annulerEchange(ownParticipation.echange.id)
      );
    } else {
      callEchangeApi(() =>
        restApiService.refuserEchange(ownParticipation.echange.id)
      );
    }
  };

  let styleColorTag = {};

  let getStyleColorTag = () => {
    if(participation.echange){
      styleColorTag = {color: colorEchangeTag.get(participation.echange.id)};
    }
    return styleColorTag;
  }

  const infoTag = <span className="oi oi-tag ml-2" style={getStyleColorTag()} />;

  const popover = (
    <Popover
      id="popover-basic"
      title="Echange en cours"
      style={{ pointerEvents: "none" }}
    >
      {participation.echange && participation.echange.emetteurName} souhaite
      échanger sa place avec{" "}
      {participation.echange && participation.echange.destinataireName}
    </Popover>
  );

  const cancelEchangeButton = (
    <span
      key="cancel"
      className="ml-2 oi oi-circle-x cursorhover"
      onClick={cancelEchange}
    />
  );

  const acceptEchangeButton = (
    <span
      key="accept"
      className="ml-2 oi oi-circle-check cursorhover"
      onClick={acceptEchange}
    />
  );

  const activeEchangeComponent = (
    <td className="w-25">
      {participation.echange ? (
        ""
      ) : (
        <span
          className={
            "ml-2 oi oi-transfer " +
            (ownParticipation.echange || ownParticipation === participation
              ? "disablehover"
              : "cursorhover")
          }
          onClick={
            ownParticipation.echange || ownParticipation === participation
              ? () => {
                  return;
                }
              : () => {
                  handleEchange();
                }
          }
        />
      )}
      {participation.echange && (
        <OverlayTrigger placement="left" overlay={popover}>
          {infoTag}
        </OverlayTrigger>
      )}
      {ownParticipation === participation &&
        participation.echange &&
        (ownParticipation.echange.emetteurId === ownParticipation.participant.id
          ? cancelEchangeButton
          : [acceptEchangeButton, cancelEchangeButton])}
      <span className="ml-2 oi oi-loop-circular spin" hidden={!callingApi} />
    </td>
  );

  const disabledEchangeComponent = (
    <td>
      {participation.echange && (
        <OverlayTrigger placement="left" overlay={popover}>
          {infoTag}
        </OverlayTrigger>
      )}
    </td>
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
