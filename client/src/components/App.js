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
import OwnerOrderProceedingPage from './views/OwnerDetailStorePage/OwnerOrderProceedingPage';
import OwnerOrderCompletedPage from './views/OwnerDetailStorePage/OwnerOrderCompletedPage';
import OwnerMenuPage from './views/OwnerDetailStorePage/OwnerMenuPage';
import OwnerReviewPage from './views/OwnerDetailStorePage/OwnerReviewPage';
import StoreListPage from './views/StorePage/StoreListPage/StoreListPage';
import UserStorePage from './views/UserStorePage/UserStorePage';
import OrderPage from './views/OrderPage/OrderPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import OwnerStoreSettingPage from './views/OwnerDetailStorePage/OwnerStoreSettingPage';
import UserInfoPage from './views/UserInfoPage/UserInfoPage';
import CartPage from './views/CartPage/CartPage';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null) || AuthOwner(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false) || AuthOwner(OwnerRegisterPage, false)} />
          
          <Route exact path="/register/owner" component={Auth(OwnerRegisterPage, false) || AuthOwner(OwnerRegisterPage, false)} />
          <Route exact path="/login/owner" component={AuthOwner(OwnerLoginPage, null)} />

          <Route exact path="/store" component={AuthOwner(StorePage, true)} />  
          <Route exact path="/store/addstore" component={AuthOwner(AddStorePage, true)} />
          <Route exact path="/store/:storeId/order/proceeding" component={AuthOwner(OwnerOrderProceedingPage, true)} />
          <Route exact path="/store/:storeId/order/completed" component={AuthOwner(OwnerOrderCompletedPage, true)} />
          <Route exact path="/store/:storeId/menu" component={AuthOwner(OwnerMenuPage, true)} />
          <Route exact path="/store/:storeId/review" component={AuthOwner(OwnerReviewPage, true)} />
          <Route exact path="/store/:storeId/setting" component={AuthOwner(OwnerStoreSettingPage, true)} />

          
          <Route exact path="/store/:category" component={Auth(StoreListPage, true)} />

          <Route exact path="/store/:storeId/detail" component={Auth(UserStorePage, null)} />

          <Route exact path="/order" component={Auth(OrderPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route exact path="/user" component={Auth(UserInfoPage, true)} />
          <Route exact path="/cart" component={Auth(CartPage, true)} />
          

        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
