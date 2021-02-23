import React, { Component } from 'react';
import './App.css';
import { withRouter, Route, Switch } from "react-router-dom";
import {Login} from "./anagrafica_components/Login";
import {USER_TYPE, ROUTES} from "./anagrafica_components/common/Constants";
import axios from "axios";
import config from "./config.json";
import dotenv from "dotenv";

dotenv.config();

class App extends Component {
  state = { 
    userType: null,
    username: ""
   }

   UNSAFE_componentWillMount() {
    //this if handle an eventual modification of URL from the user and redirect it to the login
    if(this.props.location.pathname === "/" || this.props.location.pathname === "" || this.props.location.pathname === window.defConfigurations.url_prefix){
      localStorage.removeItem("TOKEN");
      this.props.history.replace(window.defConfigurations.url_prefix + ROUTES.LOGIN);
    }
    
    for (let api in config) {
      config[api] = config[api].replace(
        "[REACT_APP_URL_JAVA]",
        window.defConfigurations.REACT_APP_URL_JAVA
      );
    }
    
   }

  handleLogin = (loginRequest) => {
    const headers = { "Content-Type": "application/json"};
    const conf = { headers: { ...headers } };

    let roles = [];

    axios.post(config.apiLoginEndpoint, loginRequest, conf)
    .then(response => {
        roles = [...response.data.roles];
        //saving token and username in local storage to persist data for the session
        localStorage.setItem("TOKEN", response.data.accessToken);
        localStorage.setItem("USERNAME", response.data.username);

        this.setState({roles: roles, username: response.data.username,
          userType: roles.length === 1 && roles[0].authority === USER_TYPE.USER ? USER_TYPE.USER : USER_TYPE.ADMINISTRATOR})
        //checking if the user logged is a simple user or an admin
        if(roles.length === 1 && roles[0].authority === USER_TYPE.USER){
          this.props.history.replace(window.defConfigurations.url_prefix + ROUTES.RICERCA_CLIENTI);
        } else {
          this.props.history.replace(window.defConfigurations.url_prefix + ROUTES.IMPORTA_CLIENTI);
        }
     }
    )
    .catch(err => console.log(err.response));
  }

  render() { 
    const {userType} = this.state;
    return (
      <div className="App">
         <Switch>
              <Route
                path={window.defConfigurations.url_prefix + ROUTES.LOGIN}
                exact
                render={(props) => <Login {...props} handleLogin={this.handleLogin}/>}
              />
              {/* <Redirect from="/" to={this.state.userType === USER_TYPE.USER && this.state.username !== "" ? window.defConfigurations.url_prefix + "ricerca-clienti" : this.state.username !== "" ? window.defConfigurations.url_prefix + "importa-clienti" : window.defConfigurations.url_prefix + "login"} /> */}
          </Switch>
      </div>
    );
  }
}
 
export default withRouter(App);
