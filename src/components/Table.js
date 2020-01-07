import React from 'react'
import { fromJS } from 'immutable'
import './Table.css'

import { Button } from '@datapunt/asc-ui'

import BasicProperties from './BasicProperties'
import Rows from './Rows'

// const TABLE_SCHEMA_URL = 'https://static.amsterdam.nl/schemas/table@v1.0'

function updateRows (table, rows, onUpdate) {
  table = table.set('rows', rows)
  onUpdate(table)
}

const Table = ({table, onUpdate, onDelete}) => {
  const rows = table.get('rows') || fromJS([])

  return (
    <div>
      <BasicProperties
        data={table} onUpdate={onUpdate} />
      <h3>Rows</h3>
      <Rows rows={rows}
        onUpdate={(rows) => updateRows(table, rows, onUpdate)} />
      <Button onClick={onDelete} color='secondary' >Delete table</Button>
    </div>
  )
}

export default Table
