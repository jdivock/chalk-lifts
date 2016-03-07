import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Set } from 'immutable';
import { Card, CardHeader, CardText, FontIcon } from 'material-ui';
import { grey500 } from 'material-ui/lib/styles/colors';

import RelayLift, { Lift } from './Lift';

const styles = {
  icon: {
    alignSelf: 'flex-end',
    border: '1px dashed',
    borderColor: grey500,
    cursor: 'pointer',
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
      editMode: false,
      newLifts: new Set(),
    };
  }

  addLift = () => {
    const key = `${this.state.newLifts.size + 1}_new`;

    this.setState({
      newLifts: this.state.newLifts.add(
        <Lift key={key} editMode />
      ),
    });
  }

  render() {
    const { workout } = this.props;
    const { newLifts } = this.state;

    return (
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
                <RelayLift
                  lift={edge.node}
                  key={edge.node.id}
                />
            )
          }
          { newLifts.map(newLift => newLift) }
          <FontIcon
            className="material-icons"
            style={styles.icon}
            color={grey500}
            onClick={this.addLift}
          >
            add
          </FontIcon>
        </CardText>
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
              ${RelayLift.getFragment('lift')}
            }
          }
        }
      }
    `,
  },
});
