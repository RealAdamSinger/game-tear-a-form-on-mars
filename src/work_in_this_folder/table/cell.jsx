import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getColor, rgbToHex } from './utilities/get_color';

import Tooltip from '@material-ui/core/Tooltip';
import MuiTableCell from '@material-ui/core/TableCell';

/**
 * Table cell is a generic table cell that can be located anywhere
 * inside of a table i.e. header, row, or cell
 */


export default function Cell(props) {
  const {
    backgroundColor,
    highlightOnHover,
    style,
    children,
    tooltip,
    bold,
    tooltipProps = {},
    ...restProps
  } = props;

  const [hovered, setHovered] = useState();

  const onMouseEnter = useCallback((e) => {
    const {
      onMouseEnter,
    } = props;

    setHovered(true);

    if (onMouseEnter) onMouseEnter(e);
  });

  const onMouseLeave = useCallback((e) => {
    const {
      onMouseLeave,
    } = props;

    setHovered(false);

    if (onMouseLeave) onMouseLeave(e);
  });


  const bgColor = useMemo(() => {
    if (highlightOnHover && hovered) return getColor(backgroundColor, { lighten: 0.4 });

    return getColor(backgroundColor);
  }, [backgroundColor, highlightOnHover, hovered]);

  let tableCell = (
    <MuiTableCell
      {...restProps}
      style={{
        ...style,
        fontWeight: bold && 650,
        backgroundColor: bgColor,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </MuiTableCell>
  );


  if (tooltip) {
    tableCell = (
      <Tooltip
        title={tooltip}
        enterDelay={2000}
        {...tooltipProps}
      >
        {tableCell}
      </Tooltip>
    );
  }
  return tableCell;
}


Cell.defaultProps = {
  backgroundColor: '#f4f4f4',
};

Cell.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.string,
};
