import Relay from 'react-relay';

export default class AddLiftMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{addLiftMutation}`;
  }

  getVariables() {
    const {
      workout_id,
      name,
      reps,
      sets,
      weight,
    } = this.props;

    return {
      workout_id,
      name,
      reps,
      sets,
      weight,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddLiftMutationPayload {
        newLiftEdge,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'workout',
      parentID: this.props.workout.id,
      connectionName: 'lift',
      edgeName: 'newLiftEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(newest)': 'prepend',
      },
    }];
  }

  static fragments = {
    workout: () => Relay.QL`
      fragment on Workout {
        id,
      }
    `,
  };
}
