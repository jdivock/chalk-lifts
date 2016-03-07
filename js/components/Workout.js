import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Card, CardHeader, CardText, FontIcon } from 'material-ui';
import { grey500 } from 'material-ui/lib/styles/colors';

import Lift from './Lift';

const styles = {
  icon: {
    alignSelf: 'flex-end',
    border: '1px dashed',
    borderColor: grey500,
    cusor: 'pointer',
    marginLeft: 5,
  },
  lift: {
    display: 'flex',
  },
  cardHeader: {
    height: 50,
  },
};

const Workout = ({ workout }) =>
  <Card>
    <CardHeader
      title={moment(new Date(workout.date)).format('L')}
      subtitle={workout.name}
      style={styles.cardHeader}
    />
    <CardText style={styles.lift}>
      {
        workout.lifts.edges.map(
          edge =>
            <Lift
              lift={edge.node}
              key={edge.node.id}
            />
        )
      }
      <FontIcon
        className="material-icons"
        style={styles.icon}
        color={grey500}
      >
        add
      </FontIcon>
    </CardText>
  </Card>;

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
