import React, { PropTypes } from 'react';
import Relay from 'react-relay';

import TopNav from './TopNav';
import Workout from './Workout';

const App = (props) => {
  const account = props.account;
  return (
    <div>
      <TopNav
        account={account}
      />
      {
        account.workouts.edges.map(
          edge =>
            <Workout workout={ edge.node } />
        )
      }
    </div>
  );
};

App.propTypes = {
  account: PropTypes.object,
};

export default Relay.createContainer(App, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        ${TopNav.getFragment('account')},
        workouts(first: 10) {
          edges {
            node {
              ${Workout.getFragment('workout')}
            }
          }
        }
      }
    `,
  },
});
