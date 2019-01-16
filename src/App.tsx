import React, { Component } from "react";
import NavBar from "./NavBar";
import Participations from "./Participations";
import {Route} from 'react-router-dom';
import Callback from './Callback';
class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <NavBar />
        <div className="row">
          <Route exact path='/' component={Participations}/>
          <Route exact path='/callback' component={Callback}/>
        </div>
      </div>
    );
  }
}

export default App;
