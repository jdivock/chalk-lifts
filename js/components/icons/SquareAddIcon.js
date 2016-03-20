import React, { PropTypes } from 'react';
import { FontIcon } from 'material-ui';
import { grey500 } from 'material-ui/lib/styles/colors';

const SquareAddIcon = ({ style, onClick }) => {
  const styles = {
    border: '1px dashed',
    borderColor: grey500,
    cursor: 'pointer',
    ...style,
  };

  return (
    <FontIcon
      className="material-icons"
      style={styles}
      color={grey500}
      onClick={onClick}
    >
      add
    </FontIcon>
  );
};

SquareAddIcon.displayName = 'SquareAddIcon';

SquareAddIcon.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default SquareAddIcon;
