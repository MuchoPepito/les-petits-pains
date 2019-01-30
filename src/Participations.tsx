import React, { Component } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import EquipeDto from "./ApiDto/EquipeDto";

interface Props {}

interface State {}

class Participations extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {

    const response = await restApiService.getEquipe(2);
    console.log(response);

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
