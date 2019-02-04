import React, { Component } from "react";
import NavBar from "./NavBar";
import Participations from "./Participations";
import { Route, withRouter } from "react-router-dom";
import Callback from "./Callback";
import auth0Client from "./Auth";
import TeamChoice from "./TeamChoice";
class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      checkingSession: true
    };
  }

  async componentDidMount() {
    if (this.props.location.pathname === "/callback") {
      this.setState({ checkingSession: false });
      return;
    }

    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  render() {
    const toRender = (
      <div className="container-fluid">
        <NavBar />
        <div className="row">
          <Route exact path="/" component={Participations} />
          <Route exact path="/callback" component={Callback} />
          <Route exact path="/teamchoice" component={TeamChoice} />
        </div>
      </div>
    );

    return (
      <div>
        {!this.state.checkingSession ? toRender : ""}
      </div>
    );
  }
}

export default withRouter(App);
