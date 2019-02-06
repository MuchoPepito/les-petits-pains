import React, { Component } from "react";
import auth0Client from "./Auth";
import restApiService from "./RestApiService";
import moment from "moment";
class Participations extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      participations: []
    };
  }

  async componentDidMount() {
    try{
      const response = await restApiService.getActiveParticipations();
      let participations = response._embedded.participations;
      participations.map((participation:any, index:number) => {
        this.setState({
          participations: [...this.state.participations, participation]
        })
      })
    }catch(err){
      console.log(err)
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
            {this.state.participations.map((participation:any, index:number) => {
              return(<Participation key={participation.id} order={index+1} name={participation.participant.name} date={participation.date} isActive={participation.active} />)
            })}
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
}

const Participation = (props: Participation) => {
  const { order, name, date, isActive } = props;
  if (!isActive) {
    return null;
  }
  return (
    <tr>
      <th scope="row">{order}</th>
      <td>{name}</td>
      <td>{moment(date).format("DD/MM/YYYY")}</td>
      {auth0Client.isAuthenticated() ? (
        <td><span className="ml-3 oi oi-transfer cursorhover"></span></td>
      ) : (
        <td>swap link not available (sign in to see it)</td>
      )}
    </tr>
  );
};

export default Participations;
