import React, { PropTypes } from 'react';
import Relay from 'react-relay';

import TopNav from './TopNav';
import Workout from './Workout';

const App = ({ user }) =>
    <div>
      <TopNav
        user={user}
      />
      {
        user.workouts.edges.map(
          edge =>
            <Workout
              workout={edge.node}
              key={edge.node.id}
            />
        )
      }
    </div>;

App.propTypes = {
  user: PropTypes.object,
};

export default Relay.createContainer(App, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${TopNav.getFragment('user')},
        workouts(first: 10) {
          edges {
            node {
              id,
              ${Workout.getFragment('workout')}
            }
          }
        }
      }
    `,
  },
});
