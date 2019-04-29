import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MainMalcolmView from './mainMalcolmView/mainMalcolmView.container';
import malcolmPopOut from './mainMalcolmView/malcolmPopOut.container';

const AppRouter = () => (
  <div>
    <Route exact path="/gui/*" component={MainMalcolmView} />
    <Route exact path="/details/*" component={malcolmPopOut} />
    <Route exact path="/" render={() => <Redirect to="/gui/" />} />
    <Route exact path="/gui" render={() => <Redirect to="/gui/" />} />
  </div>
);

export default AppRouter;
