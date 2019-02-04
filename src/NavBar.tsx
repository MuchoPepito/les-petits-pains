import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "./Auth";

const NavBar = (props:any) => {

  const signOut = () => {
    auth0Client.signOut();
    props.history.replace('/');
  }

  return (
    <nav className="navbar navbar-dark bg-info fixed-top">
      <Link className="navbar-brand" to="/">
        Les petits pains
      </Link>
      {!auth0Client.isAuthenticated() && (
        <button className="btn btn-dark" onClick={auth0Client.signIn}>
          Connexion
        </button>
      )}
      {auth0Client.isAuthenticated() && (
        <div>
          <label className="mr-2 text-white">
            {auth0Client.getProfile().name}
          </label>
          <button className="btn btn-dark" onClick={() => {signOut()}}>
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
};

export default withRouter(NavBar);
