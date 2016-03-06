import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { AppBar, Avatar } from 'material-ui';

const Account = ({ account }) => {
  const {
    profile_pic_url,
  } = account;

  return (
    <div>
      <AppBar
        title={'LiftQL'}
        iconElementRight={ <Avatar src={profile_pic_url} /> }
      />
    </div>
  );
};

Account.propTypes = {
  account: PropTypes.object,
};

Account.displayName = 'Account';

export default Relay.createContainer(Account, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        profile_pic_url,
      }
    `,
  },
});
