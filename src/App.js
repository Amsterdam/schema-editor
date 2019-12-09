import React, { useState, useEffect } from 'react'
import useUndo from 'use-undo'
import './App.css'

import axios from 'axios'
import { fromJS } from 'immutable'
import Ajv from 'ajv'

import { ThemeProvider, GlobalStyle,
  Header, Column, Container, Row,
  Button } from '@datapunt/asc-ui'

import Dropzone from './components/Dropzone'
import Dataset from './components/Dataset'
import Schema from './components/Schema'

import SchemaContext from './components/SchemaContext'

const AMSTERDAM_SCHEMA_URL = 'https://static.amsterdam.nl/schemas/schema@v1.0'

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

function fromAmsterdamSchema (schema) {
  const dataset = {
    ...schema,
    tables: (schema.tables || []).map((table) => ({
      ...table,
      schema: undefined,
      rows: Object.entries((table.schema && table.schema.properties) || {})
        .map(([id, schema]) => ({
          ...schema,
          id
        }))
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
        properties: table.rows && Object.fromEntries(table.rows.map((row) => ([
          row.id,
          {
            ...row,
            id: undefined
          }
        ])))
      }
    }))
  }
}

function onDropped (data, setDataset) {
  const schema = JSON.parse(data.contents[0])
  const dataset = fromAmsterdamSchema(schema)
  setDataset(dataset)
}

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
    axios.get(AMSTERDAM_SCHEMA_URL)
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
        title='Amsterdam Schema-editor'
        homeLink='https://github.com/Amsterdam/amsterdam-schema'
        fullWidth={false} />
      <Container>
        <Row halign='flex-start'>
          <Column
            wrap
            span={{ small: 1, medium: 2, big: 4, large: 8, xLarge: 8 }}
            push={{ small: 0, medium: 0, big: 1, large: 2, xLarge: 2 }} >
            <div className='contents'>
              <Dropzone options={{
                pattern: '.json',
                multiple: false,
                placeholder: 'Drop Amsterdam Schema here…'
              }} onDropped={(data) => onDropped(data, setDataset)} />
            </div>
          </Column>
        </Row>
        <Row halign='flex-start'>
          <Column
            wrap
            span={{ small: 12, medium: 1, big: 1, large: 1, xLarge: 1 }}
            push={{ small: 0, medium: 2, big: 2, large: 2, xLarge: 2 }} >
            <div>
              <Button
                onClick={undo}
                disabled={!canUndo}>Undo</Button>
              <Button
                onClick={redo}
                disabled={!canRedo}>Redo</Button>
              <Button
                onClick={() => resetDataset(fromJS(emptyDataset))}
                disabled={!canUndo && !canRedo}>Clear</Button>
            </div>
          </Column>
          <Column
            wrap
            span={{ small: 12, medium: 7, big: 7, large: 7, xLarge: 7 }}
            push={{ small: 0, medium: 0, big: 0, large: 0, xLarge: 0 }} >
            <div className='contents'>
              <SchemaContext.Provider value={{
                ajv,
                compiledSchema
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
                <h2>Amsterdam Schema</h2>
                <Schema schema={toAmsterdamSchema(presentDataset)} />
              </SchemaContext.Provider>
            </div>
          </Column>
        </Row>
      </Container>
    </ThemeProvider>
  )
}

export default App
