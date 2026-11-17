import { useState, Suspense, lazy, useEffect } from 'react';
import { Route, Link, Router, Switch, useLocation, Redirect } from 'wouter';

//Components
import Menus from './components/menus/menus';
import FixedFooter from './components/fixed_footer/fixed_footer';
const Footer = lazy(() => import('./components/footer/footer'));

//Routes
import NotFound from './routes/notfound';
import About from './routes/about';
import Locations from './routes/locations';
import Contact from './routes/contact';
import Catalog from './routes/catalog';
import Policy from './routes/policy';
import Faq from './routes/faq';
import Product from './routes/product';
import Cart from './routes/cart';
import Checkout from './routes/checkout';
import Confirmation from './routes/confirmation';
import Login from './routes/login';
import Signup from './routes/signup';
import Account from './routes/account';
import Tracking from './routes/tracking';
import Outbox from './routes/outbox';
import AdminRoot from './routes/admin/admin_root';
import Demo from './routes/demo';



const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [location]);

  return null;
};

function App() {

  return (
    <>
      <Router hook={undefined} >

        <Menus />
        <FixedFooter />
        <ScrollToTop />

        <Switch>

          <Route path={"/"} component={Catalog} />
          <Route path={"/locations"} component={Locations} />
          <Route path={"/about"} component={About} />
          <Route path={"/contact"} component={Contact} />

          {/* Tienda */}
          <Route path={"/product/:id"} component={Product} />
          <Route path={"/cart"} component={Cart} />
          <Route path={"/checkout"} component={Checkout} />
          <Route path={"/confirmation/:id"} component={Confirmation} />
          <Route path={"/login"} component={Login} />
          <Route path={"/signup"} component={Signup} />
          <Route path={"/account"} component={Account} />
          <Route path={"/tracking"} component={Tracking} />
          <Route path={"/outbox"} component={Outbox} />
          <Route path={"/demo"} component={Demo} />

          {/* Panel interno (POS, logística, inventario, claves, auditoría…) */}
          <Route path={"/admin/:rest*"} component={AdminRoot} />

          {/* Ayuda y políticas */}
          <Route path={"/faq"} component={Faq} />
          <Route path={"/policy"} component={Policy} />
          <Route path={"/policy/:type"} component={Policy} />
          <Route path={"/catalog"}><Redirect to="/" /></Route>
          <Route path={"/orders"}><Redirect to="/account" /></Route>

          {/* 404 */}
          <Route component={NotFound} />

        </Switch>

        <Suspense fallback={<></>}>
          <Footer />
        </Suspense>


      </Router>
    </>
  )
}

export default App
