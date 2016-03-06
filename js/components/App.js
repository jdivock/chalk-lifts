import React, { PropTypes } from 'react';
import Relay from 'react-relay';

import TopNav from './TopNav';

const App = ({ account }) =>
  <div>
    <TopNav
      account={account}
    />
  </div>;

App.propTypes = {
  account: PropTypes.object,
};

export default Relay.createContainer(App, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        email,
        ${TopNav.getFragment('account')},
      }
    `,
  },
});
