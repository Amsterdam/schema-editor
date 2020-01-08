import React, { useContext, useEffect } from 'react'
import './Validation.css'

import HighlightedJSON from './HighlightedJSON'
import SchemaContext from './SchemaContext'

const Validation = ({ schema, onValidated }) => {
  let valid
  const { compiledSchema } = useContext(SchemaContext)

  if (compiledSchema) {
    valid = compiledSchema(schema)
  }

  useEffect(() => {
    if (onValidated) {
      onValidated(valid)
    }
  }, [valid, onValidated])

  if (!compiledSchema) {
    return null
  } else if (valid) {
    return (
      <div>
        <p className='validation validation-valid'>
          <span role='img' aria-label='Validated!'>✅</span>
          The Amsterdam Schema is correct!
        </p>
      </div>
    )
  } else {
    const errors = compiledSchema.errors

    return (
      <div>
        <p className='validation validation-errors'>
          <span role='img' aria-label='Errors found!'>❌</span>
          The Amsterdam Schema contains errors:
        </p>
        <HighlightedJSON json={errors} />
      </div>
    )
  }
}

export default Validation
