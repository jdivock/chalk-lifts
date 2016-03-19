import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { AppBar, Avatar } from 'material-ui';

const TopNav = ({ user }) =>
  <div>
    <AppBar
      title={'LiftQL'}
      iconElementRight={ <Avatar src={user.profile_pic_url} /> }
    />
  </div>;

TopNav.propTypes = {
  user: PropTypes.object,
};

TopNav.displayName = 'TopNav';

export default Relay.createContainer(TopNav, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        profile_pic_url,
      }
    `,
  },
});
