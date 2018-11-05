import React from 'react';
import { Route } from 'react-router-dom';
import MainMalcolmView from './mainMalcolmView/mainMalcolmView.container';
import malcolmPopOut from './mainMalcolmView/malcolmPopOut.container';

const AppRouter = () => (
  <div>
    <Route exact path="/gui/*" component={MainMalcolmView} />
    <Route exact path="/details/*" component={malcolmPopOut} />
  </div>
);

export default AppRouter;
