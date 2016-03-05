import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    account: () => Relay.QL`
      query {
        account(id:1)
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
