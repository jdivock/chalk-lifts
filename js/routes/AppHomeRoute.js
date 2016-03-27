import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    user: () => Relay.QL`
      query {
        user(email: $userEmail),
      }
    `,
  };
  static paramDefinitions = {
    userEmail: { required: true },
  };
  static routeName = 'AppHomeRoute';
}
