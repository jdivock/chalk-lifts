import Relay from 'react-relay';

export default class RemoveLiftMutation extends Relay.Mutation {
  static fragments = {
    lift: () => Relay.QL`
      fragment on Lift {
        id,
      }
    `,
    workout: () => Relay.QL`
      fragment on Workout {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation { removeLift }`;
  }

  getVariables() {
    return {
      id: this.props.lift.id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveLiftMutationPayload @relay(pattern:true) {
        removedLiftId,
        workout,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'workout',
      parentID: this.props.workout.id,
      connectionName: 'lifts',
      deletedIDFieldName: 'removedLiftId',
    }];
  }
}
