import React, { useState, useEffect } from 'react'
import useUndo from 'use-undo'
import './App.css'

import axios from 'axios'
import { fromJS } from 'immutable'
import Ajv from 'ajv'

import { ThemeProvider, GlobalStyle,
  Header, Column, Container, Row,
  Button, ButtonBar } from '@datapunt/asc-ui'

import { loadSchema,
         fromAmsterdamSchema,
         toAmsterdamSchema } from './components/Tools'
import Dropzone from './components/Dropzone'
import Dataset from './components/Dataset'
import Validation from './components/Validation'
import HighlightedJSON from './components/HighlightedJSON'
import loadSchemaFromUri from './components/SchemaLoader'

import SchemaContext, { getSchemaUri } from './components/SchemaContext'

const CONFIG_URL = 'config.json'

const emptyDataset = {
  id: '',
  type: 'dataset'
}

let ajv

async function compileSchema (schema) {
  ajv = new Ajv({
    loadSchema: loadSchema
  })

  const validate = await ajv.compileAsync(schema)
  return validate
}


function copyToClipboard (schema, setJustCopied) {
  setJustCopied(true)
  const schemaString = JSON.stringify(schema, null, 2)
  navigator.clipboard.writeText(schemaString)

  window.setTimeout(() => {
    setJustCopied(false)
  }, 1000)
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


function onDropped (schemaUri, data, setDataset) {
  const schema = JSON.parse(data.contents[0])
  const dataset = fromAmsterdamSchema(schemaUri, schema)
  setDataset(dataset)
}

const columnSpan = { small: 1, medium: 2, big: 4, large: 8, xLarge: 8 }
const columnPush = { small: 0, medium: 0, big: 1, large: 2, xLarge: 2 }

const App = () => {
  const [config, setConfig] = useState()
  const [schemaUri, setSchemaUri] = useState()
  const [valid, setValid] = useState()
  const [compiledSchema, setCompiledSchema] = useState()
  const [justCopied, setJustCopied] = useState(false)
  const [remoteSchemaUri, setRemoteSchemaUri] = useState()
  const [previewMode, setPreviewMode] = useState()

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
    if (!schemaUri) {
      return
    }

    axios.get(schemaUri)
      .then((response) => response.data)
      .then((schema) => compileSchema(schema))
      .then((compiledSchema) => {
        setCompiledSchema(() => compiledSchema)
      })
  }, [schemaUri])

  useEffect(() => {
    axios.get(CONFIG_URL)
      .then((response) => response.data)
      .then((config) => {
        setConfig(config)
        setSchemaUri(getSchemaUri(config, 'schema'))
      })
  }, [])


  let validIcon
  if (valid !== undefined) {
    if (valid) {
      validIcon = (
        <a href='#validation' className='emoji-link'>
          <span role='img' aria-label='Validated!'>✅</span>
        </a>
      )
    } else {
      validIcon = (
        <a href='#validation' className='emoji-link'>
          <span role='img' aria-label='Errors found!'>❌</span>
        </a>
      )
    }
  }

  const loaded = config && compiledSchema

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('preview') || '') {
      setRemoteSchemaUri(searchParams.get('preview'));
      setPreviewMode(true)
    } else if (searchParams.get('edit') || '') {
      setRemoteSchemaUri(searchParams.get('edit'))
    }
  }, [])

  useEffect(() => {
    if (!schemaUri || !remoteSchemaUri) {
      return
    }
    loadSchemaFromUri(remoteSchemaUri, schemaUri, setDataset)
  }, [schemaUri, remoteSchemaUri])

  return (
    <ThemeProvider>
      <GlobalStyle />
      <Header
        tall={false}
        title='Amsterdam Schema Editor'
        homeLink='https://github.com/Amsterdam/amsterdam-schema'
        fullWidth={false} navigation={
          <ButtonBar className='centered'>
            <div className='padding header-link'>
              <a href='#amsterdam-schema'>View schema</a>
              {validIcon}
            </div>
            <Button color='primary'
              onClick={() => copyToClipboard(toAmsterdamSchema(schemaUri, presentDataset), setJustCopied)}>
              {justCopied ? 'Copied!' : 'Copy'}</Button>
            <Button color='primary'
              onClick={() => download(toAmsterdamSchema(schemaUri, presentDataset))}>
                Download</Button>
            { previewMode ? null : (<Button
              onClick={undo}
              disabled={!canUndo}>❮ Undo</Button>) }
            { previewMode ? null : (<Button
              onClick={redo}
              disabled={!canRedo}>Redo ❯</Button>) }
            { previewMode ? null : (<Button color='secondary'
              onClick={(event) => onClearClick(event, {setDataset, resetDataset})}
              disabled={!canUndo && !canRedo}>Clear</Button>) }
          </ButtonBar>
        } />
    <Container>
        <Row halign='flex-start'>
          <Column
            wrap
            span={columnSpan}
            push={columnPush} >
        { previewMode ? (
          <h3>Preview of {remoteSchemaUri}</h3>) : null }
        { remoteSchemaUri ? null : (
            <div className='contents'>
              <Dropzone options={{
                pattern: '.json',
                multiple: false,
                placeholder: 'Drop existing Amsterdam Schema JSON file here (or use the form below to create a new one)'
              }} onDropped={(data) => onDropped(schemaUri, data, setDataset)} />
            </div>) }
          </Column>
        </Row>
        <Row halign='flex-start'>
          <Column
            wrap
            span={columnSpan}
            push={columnPush} >
            <div className='contents'>
              <SchemaContext.Provider value={{
                ajv, compiledSchema, config
              }}>
                {
                  loaded ? (
                    <div>
                      <Dataset
                        dataset={presentDataset}
                        previewMode={previewMode}
                        onUpdate={setDataset} />
                    </div>
                  ) : ''
                }
                <p>
                  <strong>Important!</strong> Fields with a <span className='required'><span>yellow background</span></span> are required!
                </p>
                <h2 id='validation'>Validation</h2>
                <Validation schema={toAmsterdamSchema(schemaUri, presentDataset)} onValidated={setValid} />
                <h2 id='amsterdam-schema'>Amsterdam Schema</h2>
                Click the Copy or Download button in the header to copy the Amsterdam Schema to your clipboard or to download a JSON file.
                <HighlightedJSON json={toAmsterdamSchema(schemaUri, presentDataset)} />
                <p>The source code of the Amsterdam Schema Editor is <a href='https://github.com/Amsterdam/schema-editor'>available on GitHub</a>.</p>
              </SchemaContext.Provider>
            </div>
          </Column>
        </Row>
      </Container>
    </ThemeProvider>
  )
}

export default App
