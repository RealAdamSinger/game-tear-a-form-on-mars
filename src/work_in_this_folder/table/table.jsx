import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';

import MaterialTable from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';

import Header from '@material-ui/core/TableHead';
import Row from '@material-ui/core/TableRow';
import Body from '@material-ui/core/TableBody';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Cell from './cell.jsx';


// this is how we would want this to work
// import TableCell from './table_cell.jsx';
// function HeaderCell(props) { return <Cell {...props} />; }
// function RowHeaderCell(props) { return <Cell {...props} />; }
// function TableHeaderCell(props) { return <Cell {...props} />; }
// instead we do the following
// HACKFIX
import TableCellHack from './table_cell.jsx';
function isInstanceOf(child, component) {
  if (typeof child !== 'object') return false;
  const childType = child.type;

  return component === childType
    || component.isPrototypeOf(childType)
    || (component.prototype && component.prototype === childType.prototype);
}

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        textAlign: 'center',
        padding: '0px 2px',
        whiteSpace: 'nowrap',
        backgroundColor: 'white',
      },
      head: {
        color: 'black',
      },
      sizeSmall: {
        padding: '0px 2px',
        '&:last-child': {
          paddingRight: '2px',
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '1em',
      },
    },
  },
});

class TableCell extends React.PureComponent {
  render() {
    return <TableCellHack {...this.props} />;
  }
}
class HeaderCell extends React.PureComponent {
  render() {
    return <Cell {...this.props} />;
  }
}
class RowHeaderCell extends React.PureComponent {
  render() {
    return <Cell {...this.props} />;
  }
}
class TableHeaderCell extends React.PureComponent {
  render() {
    return <Cell {...this.props} />;
  }
}

// END HACKFIX
function getElementId(element) {
  return element.props.id;
}

function useTableMatrix(children, defaultColumnWidth) {
  return useMemo(() => {
    // keep track of the header and row indexes so we can position children correctly in the table
    const columnWidths = [];
    const columnHeaders = [];
    const rowHeaders = [];
    const cells = {};
    let tableHeader;

    const restChildren = [];

    React.Children.forEach(children, (child) => {
      if (!child) return;

      if (isInstanceOf(child, RowHeaderCell)) {
        rowHeaders.push(child.props.hide ? <RowHeaderCell id={child.props.id} /> : child);
      }
    });


    React.Children.forEach(children, (child) => {
      // this can be optimized further
      if (!child) return;

      if (isInstanceOf(child, HeaderCell)) {
        const { width } = child.props;

        columnWidths.push(width !== undefined ? width : defaultColumnWidth);
        columnHeaders.push(child);
      } else if (isInstanceOf(child, TableHeaderCell)) {
        tableHeader = child;
      } else if (isInstanceOf(child, TableCell)) {
        const { row, column } = child.props;
        const rowHeader = rowHeaders.find(rowHeader => (getElementId(rowHeader) === row));
        if (!rowHeader) {
          rowHeaders.push(<RowHeaderCell id={row} hide />);
        }
        cells[`${column}-${row}`] = child;
      } else if (!isInstanceOf(child, RowHeaderCell)) {
        restChildren.push(child);
      }
    });

    if (!tableHeader && rowHeaders.length) {
      // creates a table header so that column headers align
      tableHeader = <TableHeaderCell />;
    }

    return {
      tableHeader,
      columnHeaders,
      columnWidths,
      rowHeaders,
      cells,
      restChildren,
      hideRowHeaders: Boolean(!rowHeaders.find(child => !child.props.hide)), // if there is a single shown row header, show all row headers
    };
  }, [children, defaultColumnWidth]);
}


export default function Table(props) {
  const {
    height,
    width,
    children,
    defaultColumnWidth,
    emptyCellComponent,
    rowHeight,
    className,
    hideColumnHeaders = false,
    hideRowHeaders: hideRowHeadersProp,
    noDataMessage,
    size,
    disableTheme,
    hideEmptyColumns,
    noShadow,
    ...restProps
  } = props;

  const {
    tableHeader,
    columnHeaders: allColumnHeaders,
    rowHeaders,
    cells,
    restChildren,
    hideRowHeaders: hideRowHeadersAuto,
  } = useTableMatrix(children, defaultColumnWidth);

  const isEmptyColumn = useCallback(columnId => Object.values(cells)
    .every((child) => {
      const { column, children: childContent } = child.props;
      return column === columnId ? !childContent && childContent !== 0 : true;
    }), [cells]);

  const columnHeaders = useMemo(() => {
    if (!hideEmptyColumns) return allColumnHeaders;

    return allColumnHeaders.filter(({ props }) => !isEmptyColumn(props.id));
  }, [allColumnHeaders, hideEmptyColumns, isEmptyColumn]);
  // disable filling empty cells if any spanning is used
  const fillEmptyCells = useMemo(() => !React.Children.toArray(children).some(({ props }) => props.colSpan || props.rowSpan), [children]);


  // prioritize props over automatic row header hiding
  const hideRowHeaders = hideRowHeadersProp === undefined ? hideRowHeadersAuto : hideRowHeadersProp;

  const tableJsx = (
    <div style={{ height, width }} className={className}>
      {/* // Add a div to construct the size of the table, do not put it on Paper */}
      <Paper style={{ boxShadow: noShadow ? "none" : undefined }}>
        <MaterialTable size={size} {...restProps}>
          {Boolean(columnHeaders.length) && !hideColumnHeaders && (
            <Header key="header">
              <Row style={{ height: rowHeight }}>
                {hideRowHeaders !== true && tableHeader}
                {columnHeaders}
              </Row>
            </Header>
          )}
          {!isEmpty(cells) && (
            <Body key="body">
              {rowHeaders.map((rowHeader) => {
                const rowId = getElementId(rowHeader);
                return (
                  <Row
                    key={rowId}
                    style={{ height: rowHeight }}
                  >
                    {hideRowHeaders !== true && rowHeader}
                    {columnHeaders.map((column) => {
                      const columnId = getElementId(column);

                      const cellId = `${columnId}-${rowId}`;
                      let cell = cells[cellId];
                      if (!cell && fillEmptyCells) {
                        cell = (
                          <TableCell
                            key={cellId}
                            row={rowId}
                            column={columnId}
                          >
                            {emptyCellComponent}
                          </TableCell>
                        );
                      }
                      return cell;
                    })}
                  </Row>
                );
              })}
            </Body>
          )}
        </MaterialTable>
        {isEmpty(cells) && (
          <div className='flex-center-middle align-center padded-lg'>
            {noDataMessage}
          </div>
        )}
        {restChildren}
      </Paper>
    </div>
  );
  return disableTheme ? tableJsx : (
    <MuiThemeProvider theme={size === 'xsmall' && theme}>
      {tableJsx}
    </MuiThemeProvider>
  );
}

Table.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultColumnWidth: PropTypes.number,
  children: PropTypes.node,
  size: PropTypes.string,
  noDataMessage: PropTypes.string,
};

Table.defaultProps = {
  defaultColumnWidth: 75,
  height: '100%',
  width: '100%',
  noDataMessage: '',
  size: 'small',
  children: null,
};

export {
  RowHeaderCell, // the indexed row cell
  HeaderCell, // the indexed column cell
  TableHeaderCell, // the corner cell between Row Headers and Column Headers
  TableCell,
  Row,
  Body,
  Header,
};
