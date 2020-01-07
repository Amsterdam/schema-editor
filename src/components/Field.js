import React, { useState, useEffect } from 'react'
import './Field.css'

// import { InputComponent } from '@datapunt/asc-ui'

const getField = (data, field) => (data && data.get(field)) ? data.get(field) : ''

const Field = ({ data, field, onUpdate, type, options, readOnly, label, labelText }) => {
  const updateField = (value) => {
    let newData
    if (!value) {
      newData = data.remove(field)
    } else {
      newData = data.set(field, value)
    }

    onUpdate(newData)
  }

  const [currentValue, setCurrentValue] = useState(getField(data, field))

  useEffect(() => {
    setCurrentValue(getField(data, field))
  }, [data, field])

  let labelElement
  if (label || labelText) {
    labelElement = (
      <label>
        {labelText || field}:
      </label>
    )
  }

  let input
  if (type === 'string') {
    input = (
      <input type='text' value={currentValue}
        readOnly={readOnly !== undefined ? readOnly : false}
        onBlur={(event) => updateField(event.target.value)}
        onChange={(event) => setCurrentValue(event.target.value)}
      />
    )
  } else if (type === 'select') {
    input = (
      <select readOnly={readOnly !== undefined ? readOnly : false}
        value={currentValue}
        onBlur={(event) => updateField(event.target.value)}
        onChange={(event) => setCurrentValue(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            { option.label }
          </option>
        ))}
      </select>
    )
  } else {
    throw new Error(`Invalid type: ${type}`)
  }

  return (
    <div className='field'>
      {labelElement}
      {input}
    </div>
  )
}

export default Field
