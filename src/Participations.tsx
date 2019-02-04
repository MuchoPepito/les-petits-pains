import React, { Component } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import EquipeDto from "./ApiDto/EquipeDto";
import ParticipantDto from "./ApiDto/ParticipantDto";
import ParticipationDto from "./ApiDto/ParticipationDto";

interface Props {
}

interface State {
  participations: ParticipantDto[]
}

class Participations extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      participations: []
    };
  }



  async componentDidMount() {
    try{
      const response = await restApiService.getParticipations();
      let participations = response._embedded.participations;
      participations.map((participation:ParticipationDto, index:number) => {
        this.state.participations.push(participation);
      })
      console.log(this.state.participations);
    }catch(err){
      console.log(err)
    }
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col-1">#</th>
              <th scope="col-5">Nom</th>
              <th scope="col-5">Date</th>
              <th scope="col-1">Swap</th>
            </tr>
          </thead>
          <tbody>
            <Participation
              order={1}
              isActive={true}
              date={new Date()}
              name="test"
            />
            <Participation
              order={1}
              isActive={true}
              date={new Date()}
              name="test"
            />
            <Participation
              order={1}
              isActive={true}
              date={new Date()}
              name="test"
            />
            <Participation
              order={1}
              isActive={true}
              date={new Date()}
              name="test"
            />
          </tbody>
        </table>
      </div>
    );
  }
}

interface Participation {
  order: number;
  name: string;
  date: Date;
  isActive: boolean;
}

const Participation = (props: Participation) => {
  const { order, name, date, isActive } = props;
  if (!isActive) {
    return <div />;
  }
  return (
    <tr>
      <th scope="row">{order}</th>
      <td>{name}</td>
      <td>{date.toDateString()}</td>
      {auth0Client.isAuthenticated() ? (
        <td>swap link</td>
      ) : (
        <td>swap link not available (sign in to see it)</td>
      )}
    </tr>
  );
};

export default Participations;
