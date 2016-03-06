import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { AppBar, Avatar } from 'material-ui';

const TopNav = ({ account }) =>
  <div>
    <AppBar
      title={'LiftQL'}
      iconElementRight={ <Avatar src={account.profile_pic_url} /> }
    />
  </div>;

TopNav.propTypes = {
  account: PropTypes.object,
};

TopNav.displayName = 'TopNav';

export default Relay.createContainer(TopNav, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        profile_pic_url,
      }
    `,
  },
});
