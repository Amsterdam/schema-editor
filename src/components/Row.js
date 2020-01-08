import React, { useContext } from 'react'

import { Button } from '@datapunt/asc-ui'
import { Close } from '@datapunt/asc-assets'

import SchemaContext, { getSchemaUri } from './SchemaContext'

import Field from './Field'

const rowTypes = [
  {label: 'Identifier', value: 'id'},
  {label: 'Table', value: 'table'},
  {label: 'Dataset', value: 'dataset'},

  {label: 'String', value: 'string'},
  {label: 'Integer', value: 'integer'},
  {label: 'Number', value: 'number'},
  {label: 'Date & Time (ISO 8601)', value: 'date-time'},
  {label: 'URI', value: 'uri'},
  {label: 'Boolean', value: 'boolean'},

  {label: 'Geometry', value: 'geometry'},
  {label: 'Polygon', value: 'polygon'},
  {label: 'LineString', value: 'linestring'},
  {label: 'Point', value: 'point'}
]

const Row = ({row, onUpdate, onDelete}) => {
  const { ajv, config } = useContext(SchemaContext)
  const rowMetaSchemaUri = getSchemaUri(config, 'row-meta-schema')
  const schema = ajv.getSchema(rowMetaSchemaUri).schema
  const rootProperty = schema.definitions.rootProperty
  const required = rootProperty.required

  return (
    <tr>
      <td>
        <Field type='string' field='id' required
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='select' field='type' options={rowTypes}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='description'
          required={required.includes('description')}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='title'
          required={required.includes('title')}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='auth'
          required={required.includes('auth')}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='prov'
          required={required.includes('prov')}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Button onClick={onDelete}
          size={25} variant='blank' iconSize={20} icon={<Close />} />
      </td>
    </tr>
  )
}

export default Row
