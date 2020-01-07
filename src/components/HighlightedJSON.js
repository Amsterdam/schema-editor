import React from 'react'
import './HighlightedJSON.css'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const HighlightedJSON = ({ json }) => {
  const jsonString = JSON.stringify(json, null, 2)

  return (
    <div className='schema'>
      <pre>
        <code>
          <SyntaxHighlighter language='javascript' style={docco}>
            {jsonString}
          </SyntaxHighlighter>
        </code>
      </pre>
    </div>
  )
}

export default HighlightedJSON
