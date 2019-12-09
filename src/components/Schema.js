import React from 'react'
import './Schema.css'

import { Button } from '@datapunt/asc-ui'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function copyToClipboard (text) {
  navigator.clipboard.writeText(text)
}

const Schema = ({ schema }) => {
  const schemaString = JSON.stringify(schema, null, 2)

  return (
    <div className='schema'>
      <Button onClick={() => copyToClipboard(schemaString)}>Copy to clipboard</Button>
      <pre>
        <code>
          <SyntaxHighlighter language='javascript' style={docco}>
            {schemaString}
          </SyntaxHighlighter>
        </code>
      </pre>
    </div>
  )
}

export default Schema
