import React from 'react'
import './Rows.css'

import { fromJS } from 'immutable'

import { Button } from '@datapunt/asc-ui'

import Row from './Row'

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

const Rows = ({ rows, previewMode, onUpdate }) => {
  let rowList
  if (rows && rows.size) {
    rowList = rows.toArray().map((row, index) => (
      <Row
        key={index}
        row={row}
        previewMode={previewMode}
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
            <th>Desc.</th>
            <th>Title</th>
            { previewMode ? null :(<th>Auth.</th>) }
            { previewMode ? null : (<th>Prov.</th>) }
            { previewMode ? null : (<th>Relation</th>) }
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          { rowList }
          { previewMode ? null : (
          <tr>
            <td colSpan='4'>
              <Button onClick={() => addRow(rows, onUpdate)}>Add row</Button>
            </td>
          </tr>
          )}
        </tbody>
      </table>
      { previewMode ? (<hr/>) : (
      <p>
        <strong>Important!</strong> Each table is expected to have at least two rows:
      </p>) }
      { previewMode ? null : (<ol className='override-asc-ui-list'>
        <li>ID <code>"id"</code> with type <strong>Identifier</strong>;</li>
        <li>ID <code>"schema"</code> with type <strong>Schema</strong>.</li>
      </ol>) }
    </div>
  )
}

export default Rows
