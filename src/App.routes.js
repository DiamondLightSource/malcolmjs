import React from 'react';
import { Route } from 'react-router-dom';
import App from './App';

const AppRouter = props => {
  return (
    <div>
      <Route exact path="/" component={App} />
    </div>
  );
};

export default AppRouter;
