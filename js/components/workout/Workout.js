import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Card, CardHeader, CardText } from 'material-ui';
import Debug from 'debug';

import { Lift, AddLiftDialog } from 'components/Lift';
import { SquareAddIcon } from 'components/icons';

Debug.enable('*');
const debug = Debug('chalk-lifts:components/Workout');
debug('Building component/Workout');

const styles = {
  icon: {
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
  lift: {
    display: 'flex',
  },
  cardHeader: {
    height: 50,
  },
};

class Workout extends React.Component {
  static propTypes = {
    workout: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      openLiftDialog: false,
    };
  }

  addLift = () => {
    this.setState({
      openLiftDialog: true,
    });
  }

  closeLiftDialog = () => {
    this.setState({
      openLiftDialog: false,
      editableLift: null,
    });
  }

  editLift = (lift) => {
    this.setState({
      openLiftDialog: true,
      editableLift: lift,
    });
  }

  render() {
    const { workout } = this.props;
    const lifts = workout.lifts.edges.map(
      edge =>
        <Lift
          lift={edge.node}
          workout={workout}
          key={edge.node.id}
          onEdit={this.editLift}
        />
    );

    return (
      <Card>
        <CardHeader
          title={moment(new Date(workout.date)).format('L')}
          subtitle={workout.name}
          style={styles.cardHeader}
        />
        <CardText style={styles.lift}>
          { lifts }
          <SquareAddIcon
            style={styles.icon}
            onClick={this.addLift}
          />
        </CardText>
        <AddLiftDialog
          open={this.state.openLiftDialog}
          handleClose={this.closeLiftDialog}
          workout={workout}
          lift={this.state.editableLift}
        />
      </Card>
    );
  }
}

export default Relay.createContainer(Workout, {
  fragments: {
    workout: () => Relay.QL`
      fragment on Workout {
        id,
        name,
        date,
        ${Lift.getFragment('workout')},
        ${AddLiftDialog.getFragment('workout')},
        lifts(first:10) {
          edges {
            node {
              id,
              ${Lift.getFragment('lift')}
            }
          }
        }
      }
    `,
  },
});
