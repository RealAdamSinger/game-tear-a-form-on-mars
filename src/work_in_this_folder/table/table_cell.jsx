import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getColor } from './utilities/get_color';

import Cell from './cell.jsx';

const WHITE = getColor('f');

export default function TableCell(props) {
  const { row, column } = props;

  const modifiedProps = useMemo(() => ({
    id: `${row}-${column}`,
    ...props,
    backgroundColor: props.backgroundColor || WHITE,
  }), [column, props, row]);


  return <Cell {...modifiedProps} />;
}
TableCell.propTypes = {
  row: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  column: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
