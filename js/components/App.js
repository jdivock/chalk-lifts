import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { AppBar, Avatar } from 'material-ui';

class Account extends Component {
  render() {
    const {
      name,
      email,
      profile_pic_url,
    } = this.props.account;

    return (
      <div>
        <AppBar
          title={'LiftQL'}
          iconElementRight={ <Avatar src={profile_pic_url}/> }
        >
        </AppBar>
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
        email,
        profile_pic_url,
      }
    `,
  },
});
