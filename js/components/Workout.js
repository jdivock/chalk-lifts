import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Card, CardHeader, CardText } from 'material-ui';

import Lift from './Lift';

const Workout = ({ workout }) =>
  <Card>
    <CardHeader
      title={ moment(workout.date).format('L') }
      subtitle={ workout.name }
    />
    <CardText style={{ display: 'flex' }}>
    {
      workout.lifts.edges.map(
        edge =>
          <Lift lift={ edge.node } />
      )
    }
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
              ${Lift.getFragment('lift')}
            }
          }
        }
      }
    `,
  },
});
