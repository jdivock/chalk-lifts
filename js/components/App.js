import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class Account extends Component {
  render() {
    const {
      name,
      email,
    } = this.props.account;

    return (
      <div>
        <h1>LiftQL yo</h1>

        <h3>Hello {name} ({email})</h3>
      </div>
    );
  }
}

Account.propTypes = {
  account: PropTypes.object,
};

Account.displayName = 'Account';

export default Relay.createContainer(Account, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        id,
        name,
        email
      }
    `,
  },
});
