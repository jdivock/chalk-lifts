import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { FontIcon, Card, CardHeader, CardText } from 'material-ui';
import { RemoveLiftMutation } from 'mutations/lift';

const styles = {
  card: {
    margin: '0 7px',
  },
  remove: {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  },
  cardHeader: {
    height: 30,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

class Lift extends React.Component {
  static propTypes = {
    lift: PropTypes.object,
    workout: PropTypes.object,
  }

  _handleRemove = () => {
    Relay.Store.commitUpdate(
      new RemoveLiftMutation({
        lift: this.props.lift,
        workout: this.props.workout,
      })
    );
  }

  render() {
    const { lift } = this.props;
    let weight;
    if (lift && lift.weight) {
      weight = `${lift.weight} x `;
    } else {
      weight = '';
    }

    return (
      <Card style={styles.card}>
        <CardHeader
          style={styles.cardHeader}
          title={lift.name}
        >
          <FontIcon
            className="material-icons"
            onClick={this._handleRemove}
            style={styles.remove}
          >
            remove
          </FontIcon>
        </CardHeader>
        <CardText>
          {weight} {lift.sets} x {lift.reps}
        </CardText>
      </Card>
    );
  }
}

export default Relay.createContainer(Lift, {
  fragments: {
    lift: () => Relay.QL`
      fragment on Lift {
        ${RemoveLiftMutation.getFragment('lift')},
        id,
        name,
        weight,
        sets,
        reps,
      }
    `,
    workout: () => Relay.QL`
      fragment on Workout {
        ${RemoveLiftMutation.getFragment('workout')},
      }
    `,
  },
});
