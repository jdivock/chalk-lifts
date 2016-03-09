import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    account: () => Relay.QL`
      query {
        account(email:"jay@jay.com")
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
