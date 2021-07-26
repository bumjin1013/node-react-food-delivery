import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import AuthOwner from "../hoc/authOwner";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import OwnerLoginPage from "./views/LoginPage/OwnerLoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import OwnerRegisterPage from "./views/RegisterPage/OwnerRegisterPage.js";
import StorePage from './views/StorePage/StorePage';
import AddStorePage from './views/StorePage/AddStorePage/AddStorePage';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/register/owner" componet={AuthOwner(OwnerRegisterPage, null)} />
          <Route exact path="/login/owner" component={AuthOwner(OwnerLoginPage, null)} />
          <Route exact path="/store" component={AuthOwner(StorePage, true)} />  
          <Route exact path="/store/addstore" component={AuthOwner(AddStorePage, true)} />
n

        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;