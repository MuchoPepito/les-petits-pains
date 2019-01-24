import auth0 from "auth0-js";
import { reject } from "q";

class Auth {
  private _auth0: auth0.WebAuth;
  profile: any;
  idToken: any;
  expiresAt: any;

  public get auth0(): auth0.WebAuth {
    return this._auth0;
  }
  public set auth0(value: auth0.WebAuth) {
    this._auth0 = value;
  }

  constructor() {
    this._auth0 = new auth0.WebAuth({
      domain: "sopradialog.eu.auth0.com",
      audience: "https://sopradialog.eu.auth0.com/api/v2/",
      clientID: "OQXzQKJooX9lOulr0po99TGQPlb7GaBb",
      redirectUri: "http://localhost:3000/callback",
      responseType: "token id_token",
      scope: "openid profile"
    });
  }

  getProfile = () => {
    return this.profile;
  };

  getIdToken = () => {
    return this.idToken;
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  };

  signIn = () => {
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    });
  };

  setSession = (authResult: any) => {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    //set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  };

  signOut = () => {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: 'OQXzQKJooX9lOulr0po99TGQPlb7GaBb'
    })
  };

  silentAuth = () => {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if(err) return reject(err);
        this.setSession(authResult);
        resolve();
      })
    })
  }

}

const auth0Client = new Auth();

export default auth0Client;
