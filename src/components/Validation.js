import React, { useContext } from 'react'
import './Validation.css'

import HighlightedJSON from './HighlightedJSON'
import SchemaContext from './SchemaContext'

const Validation = ({ schema }) => {
  const { compiledSchema } = useContext(SchemaContext)

  if (!compiledSchema) {
    return null
  }

  const valid = compiledSchema(schema)

  if (valid) {
    return (
      <div>
        <p className='validation validation-valid'>
          The Amsterdam Schema is correct!
        </p>
      </div>
    )
  } else {
    const errors = compiledSchema.errors

    return (
      <div>
        <p className='validation validation-errors'>
          The Amsterdam Schema contains errors:
        </p>
        <HighlightedJSON json={errors} />
      </div>
    )
  }
}

export default Validation
