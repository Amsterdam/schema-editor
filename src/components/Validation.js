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
      <div className='validation-valid'>
        Geen fouten!
      </div>
    )
  } else {
    const errors = compiledSchema.errors

    return (
      <div className='validation-errors'>
        Fouten:
        <HighlightedJSON json={errors} />
      </div>
    )
  }
}

export default Validation
