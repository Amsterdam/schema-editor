import React, { useState, useEffect } from 'react'
import useUndo from 'use-undo'
import './App.css'

import axios from 'axios'
import { fromJS } from 'immutable'
import Ajv from 'ajv'

import { ThemeProvider, GlobalStyle,
  Header, Column, Container, Row,
  Button, ButtonBar } from '@datapunt/asc-ui'

import Dropzone from './components/Dropzone'
import Dataset from './components/Dataset'
import Validation from './components/Validation'
import HighlightedJSON from './components/HighlightedJSON'

import SchemaContext, {SCHEMA_URL} from './components/SchemaContext'

const emptyDataset = {
  id: '',
  type: 'dataset'
}

function loadSchema (uri) {
  return axios.get(uri)
    .then((response) => response.data)
}

let ajv
let compiledSchema

async function compileSchema (schema) {
  ajv = new Ajv({
    loadSchema: loadSchema
  })

  const validate = await ajv.compileAsync(schema)
  return validate
}

function propertyToRow ([id, schema]) {
  let type

  if (schema.$ref === `${SCHEMA_URL}#/definitions/id`) {
    type = 'id'
  } else if (schema.$ref === `${SCHEMA_URL}#/definitions/table`) {
    type = 'table'
  } else if (schema.$ref === `${SCHEMA_URL}#/definitions/dataset`) {
    type = 'dataset'
  } else if (schema.type === 'string' && schema.format === 'date-time') {
    type = 'date-time'
  } else if (schema.type === 'string' && schema.format === 'uri') {
    type = 'uri'
  } else if (schema.type === 'string' && !schema.format) {
    type = 'string'
  } else if (schema.type === 'integer') {
    type = 'integer'
  } else if (schema.type === 'number') {
    type = 'number'
  } else if (schema.type === 'boolean') {
    type = 'boolean'
  } else if (schema.$ref === 'https://geojson.org/schema/Geometry.json') {
    type = 'geometry'
  } else if (schema.$ref === 'https://geojson.org/schema/Polygon.json') {
    type = 'polygon'
  } else if (schema.$ref === 'https://geojson.org/schema/LineString.json') {
    type = 'linestring'
  } else if (schema.$ref === 'https://geojson.org/schema/Point.json') {
    type = 'point'
  } else {
    throw new Error(`Can't create row from: ${JSON.stringify(schema)}`)
  }

  return {
    id,
    ...schema,
    type,
    $ref: undefined,
    format: undefined
  }
}

function rowToProperty (row) {
  let type
  if (row.type === 'id') {
    type = {
      $ref: `${SCHEMA_URL}#/definitions/id`
    }
  } else if (row.type === 'table') {
    type = {
      $ref: `${SCHEMA_URL}#/definitions/table`
    }
  } else if (row.type === 'dataset') {
    type = {
      $ref: `${SCHEMA_URL}#/definitions/dataset`
    }
  } else if (row.type === 'string') {
    type = {
      type: 'string'
    }
  } else if (row.type === 'integer') {
    type = {
      type: 'string'
    }
  } else if (row.type === 'number') {
    type = {
      type: 'number'
    }
  } else if (row.type === 'date-time') {
    type = {
      type: 'string',
      format: 'date-time'
    }
  } else if (row.type === 'uri') {
    type = {
      type: 'string',
      format: 'uri'
    }
  } else if (row.type === 'boolean') {
    type = {
      type: 'boolean'
    }
  } else if (row.type === 'geometry') {
    type = {
      $ref: 'https://geojson.org/schema/Geometry.json'
    }
  } else if (row.type === 'polygon') {
    type = {
      $ref: 'https://geojson.org/schema/Polygon.json'
    }
  } else if (row.type === 'linestring') {
    type = {
      $ref: 'https://geojson.org/schema/LineString.json'
    }
  } else if (row.type === 'point') {
    type = {
      $ref: 'https://geojson.org/schema/Point.json'
    }
  }

  return [
    row.id,
    {
      ...row,
      $ref: undefined,
      type: undefined,
      id: undefined,
      ...type
    }
  ]
}

function fromAmsterdamSchema (schema) {
  const dataset = {
    ...schema,
    tables: (schema.tables || []).map((table) => ({
      ...table,
      schema: undefined,
      rows: Object.entries((table.schema && table.schema.properties) || {})
        .map(propertyToRow)
    }))
  }

  return fromJS(dataset)
}

function toAmsterdamSchema (dataset) {
  const emptyRowMetaSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    required: [
      'id',
      'dataset',
      'table'
    ]
  }

  const schema = dataset.toJS()

  return {
    ...schema,
    tables: (schema.tables || []).map((table) => ({
      ...table,
      rows: undefined,
      schema: {
        ...emptyRowMetaSchema,
        properties: table.rows && Object.fromEntries(table.rows.map(rowToProperty))
      }
    }))
  }
}

function copyToClipboard (schema) {
  const schemaString = JSON.stringify(schema, null, 2)
  navigator.clipboard.writeText(schemaString)
}

function download (schema) {
  const datasetId = schema.id || 'dataset'

  const schemaString = JSON.stringify(schema, null, 2)
  const data = new window.Blob([schemaString], {type: 'application/json'})
  const url = window.URL.createObjectURL(data)

  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'

  a.href = url
  a.download = `${datasetId}.json`
  a.click()

  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

function onClearClick (event, {setDataset, resetDataset}) {
  if (event.shiftKey) {
    resetDataset(fromJS(emptyDataset))
  } else {
    setDataset(fromJS(emptyDataset))
  }
}

function onDropped (data, setDataset) {
  const schema = JSON.parse(data.contents[0])
  const dataset = fromAmsterdamSchema(schema)
  setDataset(dataset)
}

const columnSpan = { small: 1, medium: 2, big: 4, large: 8, xLarge: 8 }
const columnPush = { small: 0, medium: 0, big: 1, large: 2, xLarge: 2 }

const App = () => {
  const [loaded, setLoaded] = useState(false)

  const [
    datasetState, {
      set: setDataset,
      reset: resetDataset,
      undo,
      redo,
      canUndo,
      canRedo
    }
  ] = useUndo(fromJS(emptyDataset))

  const { present: presentDataset } = datasetState

  useEffect(() => {
    axios.get(SCHEMA_URL)
      .then((response) => response.data)
      .then((schema) => compileSchema(schema))
      .then((_compiledSchema) => {
        compiledSchema = _compiledSchema
        setLoaded(true)
      })
  }, [])

  return (
    <ThemeProvider>
      <GlobalStyle />
      <Header
        tall={false}
        title='Amsterdam Schema Editor'
        homeLink='https://github.com/Amsterdam/amsterdam-schema'
        fullWidth={false} navigation={
          <ButtonBar>
            <Button color='primary'
              onClick={() => copyToClipboard(toAmsterdamSchema(presentDataset))}>
                Copy</Button>
            <Button color='primary'
              onClick={() => download(toAmsterdamSchema(presentDataset))}>
                Download</Button>
            <Button
              onClick={undo}
              disabled={!canUndo}>Undo</Button>
            <Button
              onClick={redo}
              disabled={!canRedo}>Redo</Button>
            <Button color='secondary'
              onClick={(event) => onClearClick(event, {setDataset, resetDataset})}
              disabled={!canUndo && !canRedo}>Clear</Button>
          </ButtonBar>
        } />
      <Container>
        <Row halign='flex-start'>
          <Column
            wrap
            span={columnSpan}
            push={columnPush} >
            <div className='contents'>
              <Dropzone options={{
                pattern: '.json',
                multiple: false,
                placeholder: 'Drop existing Amsterdam Schema JSON file here (or use the form below to create a new one)'
              }} onDropped={(data) => onDropped(data, setDataset)} />
            </div>
          </Column>
        </Row>
        <Row halign='flex-start'>
          <Column
            wrap
            span={columnSpan}
            push={columnPush} >
            <div className='contents'>
              <SchemaContext.Provider value={{
                ajv, compiledSchema
              }}>
                {
                  loaded ? (
                    <div>
                      <Dataset
                        dataset={presentDataset}
                        onUpdate={setDataset} />
                    </div>
                  ) : ''
                }
                <p>
                  <strong>Important!</strong> Fields with a <span className='required'><span>yellow background</span></span> are required!
                </p>
                <h2>Validation</h2>
                <Validation schema={toAmsterdamSchema(presentDataset)} />
                <h2>Amsterdam Schema</h2>
                Click the Copy or Download button in the header to copy the Amsterdam Schema to your clipboard or to download a JSON file.
                <HighlightedJSON json={toAmsterdamSchema(presentDataset)} />
              </SchemaContext.Provider>
            </div>
          </Column>
        </Row>
      </Container>
    </ThemeProvider>
  )
}

export default App
