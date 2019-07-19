import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MalcolmDeviceSelect from './mainMalcolmView/malcolmDeviceSelect.container';
import malcolmPopOut from './mainMalcolmView/malcolmPopOut.container';

const AppRouter = () => (
  <div>
    <Route exact path="/gui/*" component={MalcolmDeviceSelect} />
    <Route exact path="/details/*" component={malcolmPopOut} />
    <Route exact path="/" render={() => <Redirect to="/gui/" />} />
    <Route strict exact path="/gui" render={() => <Redirect to="/gui/" />} />
  </div>
);

export default AppRouter;
