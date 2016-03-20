import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    user: () => Relay.QL`
      query {
        user(email:"jay@jay.com")
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
