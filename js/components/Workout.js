import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Card, CardHeader, CardText } from 'material-ui';
import Debug from 'debug';

import Lift from './Lift';
import AddLiftDialog from './AddLiftDialog';
import SquareAddIcon from './icons/SquareAddIcon';

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
    });
  }

  render() {
    const { workout } = this.props;
    const lifts = workout.lifts.edges.map(
      edge =>
        <Lift
          lift={edge.node}
          key={edge.node.id}
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
        />
      </Card>
    );
  }
}

Workout.propTypes = {
  workout: PropTypes.object,
};

export default Relay.createContainer(Workout, {
  fragments: {
    workout: () => Relay.QL`
      fragment on Workout {
        name,
        date,
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
