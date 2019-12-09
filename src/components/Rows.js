import React from 'react'
import { fromJS } from 'immutable'

import { Button } from '@datapunt/asc-ui'

import Row from './Row'

// const ROWS_SCHEMA_URL = 'https://static.amsterdam.nl/schemas/row-meta-schema@v1.0'

function addRow (rows, onUpdate) {
  rows = rows.push(fromJS({}))
  onUpdate(rows)
}

function updateRow (rows, row, index, onUpdate) {
  rows = rows.set(index, row)
  onUpdate(rows)
}

function deleteRow (rows, index, onUpdate) {
  rows = rows.splice(index, 1)
  onUpdate(rows)
}

const Rows = ({ rows, onUpdate }) => {
  // const { ajv } = useContext(SchemaContext)

  let rowList
  if (rows && rows.size) {
    rowList = rows.toArray().map((row, index) => (
      <Row key={index} row={row}
        onUpdate={(row) => updateRow(rows, row, index, onUpdate)}
        onDelete={() => deleteRow(rows, index, onUpdate)} />
    ))
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Title</th>
            <th>Description</th>
            <th>Auth.</th>
            <th>Prov.</th>
          </tr>
        </thead>
        <tbody>
          { rowList }
          <tr>
            <td colSpan='4'>
              <Button onClick={() => addRow(rows, onUpdate)}>Voeg rij toe</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Rows
