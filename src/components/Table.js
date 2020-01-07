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

const Table = ({table, onUpdate, onDelete}) => {
  const rows = table.get('rows') || fromJS([])

  return (
    <div className='table'>
      <BasicProperties
        data={table} onUpdate={onUpdate} />
      <h3>Rows</h3>
      <Rows rows={rows}
        onUpdate={(rows) => updateRows(table, rows, onUpdate)} />
      <div className='right'>
        <Button onClick={onDelete} color='secondary' >Delete table</Button>
      </div>
    </div>
  )
}

export default Table
