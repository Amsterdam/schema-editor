import React, { useContext } from 'react'

import SchemaContext, { getSchemaUri } from './SchemaContext'

import { Button, OrderedList, ListItem } from '@datapunt/asc-ui'

import { List, fromJS } from 'immutable'

import Table from './Table'
import BasicProperties from './BasicProperties'
import SchemaProperties from './SchemaProperties'

function updateDataset (dataset, onUpdate) {
  onUpdate(dataset)
}

function addTable (dataset, onUpdate) {
  if (!dataset.get('tables')) {
    dataset = dataset.set('tables', List([]))
  }

  dataset = dataset.updateIn(['tables'], (tables) => tables.push(fromJS({
    type: 'table',
    rows: [
      {
        id: 'id',
        type: 'id'
      },
      {
        id: 'schema',
        type: 'schema'
      },
      {
        id: 'contactPoint',
        type: 'contactPoint'
      }
    ]
  })))
  onUpdate(dataset)
}

function updateTable (dataset, table, index, onUpdate) {
  dataset = dataset.updateIn(['tables'], (tables) => tables.set(index, table))
  onUpdate(dataset)
}

function deleteTable (dataset, index, onUpdate) {
  dataset = dataset.updateIn(['tables'], (tables) => tables.splice(index, 1))
  onUpdate(dataset)
}

const Dataset = ({dataset, previewMode, onUpdate}) => {
  const { ajv, config } = useContext(SchemaContext)
  const datasetSchemaUri = getSchemaUri(config, 'dataset')

  const tables = dataset.get('tables')
  let tableList
  if (tables && tables.size) {
    tableList = (
      <OrderedList className='tables'>
        {tables.toArray().map((table, index) => <ListItem key={index}><h3>Table</h3><Table
          table={table}
          previewMode={previewMode}
          onUpdate={(table) => updateTable(dataset, table, index, onUpdate)}
          onDelete={() => deleteTable(dataset, index, onUpdate)} />
        </ListItem>)}
      </OrderedList>
    )
  }

  const schema = ajv.getSchema(datasetSchemaUri).schema

  return (
    <div>
      { previewMode ? null : (<h2>Dataset</h2>) }
      { previewMode ? null : (<BasicProperties
        data={dataset}
        onUpdate={(dataset) => updateDataset(dataset, onUpdate)} />) }
      { previewMode ? null : (<SchemaProperties
        data={dataset}
        schema={schema}
        omit={['type', 'tables']}
        disabled={['spatialCoordinates', 'keywords']}
        onUpdate={(dataset) => updateDataset(dataset, onUpdate)} />) }
      <div className='tables'>
        <h3>Tables</h3>
        { tableList }
        { previewMode ? null : <Button onClick={() => addTable(dataset, onUpdate)}>Add table</Button> }
      </div>
    </div>
  )
}

export default Dataset
