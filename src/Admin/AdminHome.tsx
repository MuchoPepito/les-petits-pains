import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

class AdminHome extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      participations: []
    };
  }

  render() {
    return (
      <div className="mx-auto col-2">
        <ul className="list-group">
            <li className="list-group-item"><Link to="/admin/equipes">Equipes</Link></li>
            <li className="list-group-item"><Link to="/admin/participants">Participants</Link></li>
            <li className="list-group-item"><Link to="/admin/participations" >Participations</Link></li>
        </ul>
      </div>
    );
  }
}


export default AdminHome;
