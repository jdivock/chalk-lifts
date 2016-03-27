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
  cardText: {
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
    onEdit: PropTypes.func,
  }

  handleRemove = () => {
    Relay.Store.commitUpdate(
      new RemoveLiftMutation({
        lift: this.props.lift,
        workout: this.props.workout,
      })
    );
  }

  handleEdit = () => {
    this.props.onEdit(this.props.lift);
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
      <Card
        style={styles.card}
      >
        <CardHeader
          style={styles.cardHeader}
          title={lift.name}
        >
          <FontIcon
            className="material-icons"
            onClick={this.handleRemove}
            style={styles.remove}
          >
            remove
          </FontIcon>
        </CardHeader>
        <CardText
          style={styles.cardText}
          onClick={this.handleEdit}
        >
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
        workout_id,
      }
    `,
    workout: () => Relay.QL`
      fragment on Workout {
        ${RemoveLiftMutation.getFragment('workout')},
      }
    `,
  },
});
