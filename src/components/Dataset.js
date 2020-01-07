import React, { useContext } from 'react'

import './Dataset.css'

import SchemaContext, {BASE_URL, VERSION} from './SchemaContext'

import { Button, OrderedList, ListItem } from '@datapunt/asc-ui'

import { List, fromJS } from 'immutable'

import Table from './Table'
import BasicProperties from './BasicProperties'
import SchemaProperties from './SchemaProperties'

const DATASET_SCHEMA_URL = `${BASE_URL}/dataset@${VERSION}`

function updateDataset (dataset, onUpdate) {
  onUpdate(dataset)
}

function addTable (dataset, onUpdate) {
  if (!dataset.get('tables')) {
    dataset = dataset.set('tables', List([]))
  }

  dataset = dataset.updateIn(['tables'], (tables) => tables.push(fromJS({
    type: 'table'
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

const Dataset = ({dataset, onUpdate}) => {
  const { ajv } = useContext(SchemaContext)

  const tables = dataset.get('tables')
  let tableList
  if (tables && tables.size) {
    tableList = (
      <OrderedList className='tables'>
        {tables.toArray().map((table, index) => <ListItem key={index}><Table
          table={table}
          onUpdate={(table) => updateTable(dataset, table, index, onUpdate)}
          onDelete={() => deleteTable(dataset, index, onUpdate)} />
        </ListItem>)}
      </OrderedList>
    )
  }

  const schema = ajv.getSchema(DATASET_SCHEMA_URL).schema

  return (
    <div>
      <h2>Dataset</h2>
      <BasicProperties data={dataset}
        onUpdate={(dataset) => updateDataset(dataset, onUpdate)} />
      <SchemaProperties data={dataset} schema={schema} omit={['type', 'tables']}
        onUpdate={(dataset) => updateDataset(dataset, onUpdate)} />
      <div className='tables'>
        <h3>Tables</h3>
        { tableList }
        <Button onClick={() => addTable(dataset, onUpdate)}>Add table</Button>
      </div>
    </div>
  )
}

export default Dataset
