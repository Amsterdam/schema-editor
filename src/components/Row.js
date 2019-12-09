import React from 'react'

import { Button } from '@datapunt/asc-ui'
import { Close } from '@datapunt/asc-assets'

import Field from './Field'

const rowTypes = [
  {label: 'Identifier', value: 'id'},
  {label: 'String', value: 'string'},
  {label: 'Integer', value: 'integer'},
  {label: 'Number', value: 'number'},
  {label: 'Date & Time (ISO 8601)', value: 'date-time'},
  {label: 'URI', value: 'uri'},
  {label: 'Boolean', value: 'boolean'}
]

const Row = ({row, onUpdate, onDelete}) => {
  return (
    <tr>
      <td>
        <Field type='string' field='id'
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='select' field='type' options={rowTypes}
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='title'
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='description'
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='auth'
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Field type='string' field='prov'
          data={row} onUpdate={onUpdate} />
      </td>
      <td>
        <Button onClick={onDelete}
          size={30} variant='blank' iconSize={30} icon={<Close />} />
      </td>
    </tr>
  )
}

export default Row
