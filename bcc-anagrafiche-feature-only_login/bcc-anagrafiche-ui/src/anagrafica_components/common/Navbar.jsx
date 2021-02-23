import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {ROUTES} from "./Constants";

class Navbar extends Component {
    state = { }

    render() { 
        return (
     <nav className="navbar navbar-light bg-light">
         <div className="row col-md-12">
        <span className="navbar-brand mb-0 h1 col-md-2 text-left">{this.props.username ? this.props.username : localStorage.getItem("USERNAME")}</span>
        <Link className={`nav-link col-md-2 noPadding navButton ${false ? "active" : ""}`} to={window.defConfigurations.url_prefix + ROUTES.RICERCA_CLIENTI}>Ricerca Cliente</Link>
        <Link className={`nav-link col-md-1 ml-2 navButton ${false ? "active" : ""}`} to={window.defConfigurations.url_prefix + ROUTES.REPORT}>Report</Link>
        {/* <button className="btn btn-danger col-md-1 offset-md-6">{LABELS.LOGOUT}</button> */}
        </div>
    </nav> );
    }
}
 
export default Navbar;