import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { idText } from "typescript";
import auth0Client from "./Auth";

interface Props {}

interface State {}

class Participations extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <th scope="col-1">#</th>
            <th scope="col-5">Nom</th>
            <th scope="col-5">Date</th>
            
            <th scope="col-1">Swap</th>
          </thead>
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
      {auth0Client.isAuthenticated() ? <td>swap link</td> : <td>swap link not available (sign in to see it)</td>}
    </tr>
  );
};

export default Participations;
