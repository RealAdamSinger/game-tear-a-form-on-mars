import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Table, {
  HeaderCell,
  RowHeaderCell,
  TableHeaderCell,
  TableCell,
} from './table';

storiesOf('Core/Table', module)
  .add('Table With No Data', () => (
    <Table
      height={500}
      width={500}
    >
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

    </Table>
  ))
  .add('Basic', () => (
    <Table height={500} width={500}>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <TableHeaderCell id="row">Table Header</TableHeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell row="jan" column="col1">
        Row 1
      </TableCell>
      <TableCell row="jan" column="col2">
        Row 1.2
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col1">
        Row 2
      </TableCell>
      <TableCell row="feb" column="col2">
        Row 2.2
      </TableCell>
    </Table>
  ))
  .add('Basic without Table Header', () => (
    <Table height={500} width={500}>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell row="jan" column="col1">
        Row 1
      </TableCell>
      <TableCell row="jan" column="col2">
        Row 1.2
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col1">
        Row 2
      </TableCell>
      <TableCell row="feb" column="col2">
        Row 2.2
      </TableCell>
    </Table>
  ))
  .add('Basic without Row Headers', () => (
    <Table height={500} width={500}>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <TableCell row={0} column="col1">
        Row 1
      </TableCell>
      <TableCell row={0} column="col2">
        Row 1.2
      </TableCell>

      <TableCell row={1} column="col1">
        Row 2
      </TableCell>
      <TableCell row={1} column="col2">
        Row 2.2
      </TableCell>
    </Table>
  ))
  .add('With Sparse Cells', () => (
    <Table height={500} width={500}>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <HeaderCell id="col3">Col 3</HeaderCell>
      <HeaderCell id="col4">Col 4</HeaderCell>

      <TableHeaderCell id="row">Row Header</TableHeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell row="jan" column="col1">
        Row 1
      </TableCell>
      <TableCell row="jan" column="col3">
        Row 1.3
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col2">
        Row 2.2
      </TableCell>
      <TableCell row="feb" column="col4">
        Row 2.4
      </TableCell>
    </Table>
  ))
  .add('With Sparse Cells with hover and color changes', () => (
    <Table height={500} width={500}>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <HeaderCell id="col3">Col 3</HeaderCell>
      <HeaderCell id="col4">Col 4</HeaderCell>

      <TableHeaderCell id="row">Row Header</TableHeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell
        backgroundColor="red"
        row="jan"
        column="col1"
        highlightOnHover
      >
        Some bad value
      </TableCell>
      <TableCell row="jan" column="col3">
        Row 1.3
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col2">
        Row 2.2
      </TableCell>
      <TableCell
        row="feb"
        column="col4"
        backgroundColor="lightgreen"
        highlightOnHover
      >
        some good value
      </TableCell>
    </Table>
  ))
  .add('Without Row Headers', () => (
    <Table height={500} width={500} hideRowHeaders>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <HeaderCell id="col3">Col 3</HeaderCell>
      <HeaderCell id="col4">Col 4</HeaderCell>

      <TableHeaderCell id="row">Row Header</TableHeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell
        backgroundColor="red"
        row="jan"
        column="col1"
        highlightOnHover
      >
        Some bad value
      </TableCell>
      <TableCell row="jan" column="col3">
        Row 1.3
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col2">
        Row 2.2
      </TableCell>
      <TableCell
        row="feb"
        column="col4"
        backgroundColor="lightgreen"
        highlightOnHover
      >
        some good value
      </TableCell>
    </Table>
  ))
  .add('With Spanned Cells', () => (
    <Table height={500} width={500} hideRowHeaders>
      <HeaderCell id="col1">Dessert (100g serving)</HeaderCell>
      <HeaderCell id="col2">Col 2</HeaderCell>

      <HeaderCell id="col3">Col 3</HeaderCell>

      <TableHeaderCell id="row">Row Header</TableHeaderCell>

      <RowHeaderCell id="jan"> Jan </RowHeaderCell>
      <TableCell
        backgroundColor="red"
        row="jan"
        column="col1"
        colSpan={2}
        highlightOnHover
      >
        Some bad value
      </TableCell>
      <TableCell row="jan" column="col3">
        Row 1.3
      </TableCell>

      <RowHeaderCell id="feb"> Deb </RowHeaderCell>
      <TableCell row="feb" column="col1">
        Row 2.2
      </TableCell>
      <TableCell
        row="feb"
        column="col2"
        backgroundColor="lightgreen"
        colSpan={2}
        highlightOnHover
      >
        some good value
      </TableCell>
    </Table>
  ));
