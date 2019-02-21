import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "./Auth";
import localUserService from "./LocalUserService";

const NavBar = (props: any) => {
  const signOut = () => {
    auth0Client.signOut();
    localStorage.clear();
    props.history.replace("/");
  };

  return (
    <nav className="navbar navbar-dark bg-info fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Les petits pains
        </Link>
        {localUserService.getLocalUser().admin && <Link className="text-white" to="/admin">Administration</Link>}
        {!auth0Client.isAuthenticated() && (
          <button className="btn btn-dark" onClick={auth0Client.signIn}>
            Connexion
          </button>
        )}
        {console.log({auth0Client})}
        {auth0Client.isAuthenticated() && (
          <div>
            <label className="mr-2 text-white">
              {localUserService.getLocalUser().name}
            </label>
            <button
              className="btn btn-dark"
              onClick={() => {
                signOut();
              }}
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default withRouter(NavBar);
