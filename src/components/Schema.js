import React from 'react'
import './Schema.css'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const Schema = ({ schema }) => {
  const schemaString = JSON.stringify(schema, null, 2)

  return (
    <div className='schema'>
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
