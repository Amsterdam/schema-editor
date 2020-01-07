import React, { useContext } from 'react'

import SchemaContext from './SchemaContext'

import Field from './Field'

const labels = {
  id: 'ID',
  type: 'Type',
  title: 'Title',
  description: 'Description'
}

const BasicProperties = ({data, onUpdate}) => {
  const { compiledSchema } = useContext(SchemaContext)
  const basicProperties = compiledSchema.schema.definitions.basicProperties.properties

  return (
    <div>
      {Object.entries(basicProperties).map(([property, definition]) => (
        <Field type='string' labelText={labels[property] || property}
          field={property} key={property} readOnly={property === 'type'}
          data={data} onUpdate={onUpdate} />))}
    </div>
  )
}

export default BasicProperties
