import React, { useContext } from 'react'

import SchemaContext from './SchemaContext'

import Field from './Field'

// const AMSTERDAM_SCHEMA_URL = 'https://static.amsterdam.nl/schemas/schema@v1.0'

const BasicProperties = ({data, onUpdate}) => {
  const { compiledSchema } = useContext(SchemaContext)
  const basicProperties = compiledSchema.schema.definitions.basicProperties.properties

  return (
    <div>
      {Object.entries(basicProperties).map(([property, definition]) => (
        <Field type='string' label
          field={property} key={property} readOnly={property === 'type'}
          data={data} onUpdate={onUpdate} />))}
    </div>
  )
}

export default BasicProperties
