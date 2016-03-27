import Relay from 'react-relay';
import Debug from 'debug';

const debug = new Debug('chalk-lifts:EditLiftMutation');

export default class EditLiftMutation extends Relay.Mutation {
  static fragments = {
    // lift: () => Relay.QL`
    //   fragment on Lift {
    //     id,
    //   }
    // `,
  };

  getMutation() {
    return Relay.QL`mutation { editLift }`;
  }

  getVariables() {
    debug(this.props);
    return {
      id: this.props.id,
      workout_id: this.props.workout_id,
      name: this.props.name,
      sets: this.props.sets,
      weight: this.props.weight,
      reps: this.props.reps,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditLiftMutationPayload @relay(pattern:true) {
        lift,
      }
    `;
  }

  getConfigs() {
    debug(this.props);
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        lift: this.props.id,
      },
    }];
  }
}
