import React from 'react'
import { omit as ramdaOmit } from 'ramda'

import Field from './Field'
import { displayLabel } from './SchemaContext'

const SchemaProperties = ({data, onUpdate, schema, omit, disabled}) => {
  const required = schema.required
  let properties = schema.properties

  if (omit && omit.length) {
    properties = ramdaOmit(omit, properties)
  }

  return (
    <div>
      {Object.entries(properties).map(([property, definition]) => (
        <Field type='string' labelText={displayLabel(property)} required={required.includes(property)}
          field={property} key={property}
          readOnly={(disabled && disabled.includes(property)) || property === 'type'}
          data={data} onUpdate={onUpdate} />))}
    </div>
  )
}

export default SchemaProperties
