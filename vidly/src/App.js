import logo from './logo.svg';
import './App.css';
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import Navbar from "./components/navBar";
import LoginForm from "./components/loginForm";
import NotFound from "./components/notFound";
import {
   Route,
   Switch,
   Redirect
 } from "react-router-dom";
function App() {
   return (
      <>
      
         <div>
            <Navbar></Navbar>
            <div className="content">
               <Switch>
               <Route  path="/movies" component={Movies}/>
               <Route path="/customers" component={Customers}/>
               <Route path="/rentals" component={Rentals} />
                <Route path="/login" component={LoginForm} />
                  <Route exact path="/" component={Movies} />
                  <Route exact path="/not-found" component={NotFound} />

                <Redirect to="/not-found" />
                </Switch>
            </div>
         </div>
    
    </>
   );
   
}

export default App;
