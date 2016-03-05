import React from 'react';
import Relay from 'react-relay';

class BumLifts extends React.Component {

  render() {
    return (
      <div>
        <h1>Bum lifts yo</h1>
      </div>
    );
  }
}

export default Relay.createContainer(BumLifts, {
  fragments: {
    lift: () => Relay.QL`
      fragment on Lift {
        id,
        name,
        sets,
        reps
      }
    `,
  },
});
