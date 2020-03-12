import React from 'react'
import { fromJS } from 'immutable'
import './Table.css'

import { Button } from '@datapunt/asc-ui'

import BasicProperties from './BasicProperties'
import Rows from './Rows'

function updateRows (table, rows, onUpdate) {
  table = table.set('rows', rows)
  onUpdate(table)
}

const Table = ({table, previewMode, onUpdate, onDelete}) => {
  const rows = table.get('rows') || fromJS([])

  return (
    <div className='table'>
      <BasicProperties
        data={table}
        previewMode={previewMode}
        onUpdate={onUpdate} />
      <h3>Rows</h3>
      <Rows rows={rows}
            previewMode={previewMode}
            onUpdate={(rows) => updateRows(table, rows, onUpdate)} />
      { previewMode ? '' : (
      <div className='right'>
        <Button onClick={onDelete} color='secondary' >Delete table</Button>
      </div>) }
    </div>
  )
}

export default Table
