import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';

ReactDOM.render(
    <Relay.RootContainer
      Component={App}
      route={new AppHomeRoute({ userEmail: 'jay@jay.com' })}
    />,
    document.getElementById('root')
);
