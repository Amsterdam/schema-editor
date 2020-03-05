import React, { useContext } from 'react'

import SchemaContext from './SchemaContext'
import SchemaProperties from './SchemaProperties'

const BasicProperties = ({data, onUpdate, omit, previewMode}) => {
  const { compiledSchema } = useContext(SchemaContext)
  const schema = compiledSchema.schema.definitions.basicProperties

  return <SchemaProperties
    data={data}
    schema={schema}
    previewMode={previewMode}
    omit={omit}
    onUpdate={onUpdate} />
}

export default BasicProperties
