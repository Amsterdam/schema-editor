import React, { useState, useEffect } from 'react'
import './Field.css'

// import { InputComponent } from '@datapunt/asc-ui'

const Field = ({ data, field, onUpdate, type, options, readOnly, label, labelText }) => {
  const getField = () => (data && data.get(field)) ? data.get(field) : ''

  const [currentValue, setCurrentValue] = useState(getField())

  useEffect(() => {
    setCurrentValue(getField())
  }, [data, field])

  const updateField = () => {
    let newData
    if (!currentValue) {
      newData = data.remove(field)
    } else {
      newData = data.set(field, currentValue)
    }

    onUpdate(newData)
  }

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
        onBlur={updateField}
        onChange={(event) => {
          setCurrentValue(event.target.value)
        }}
      />
    )
  } else if (type === 'select') {
    input = (
      <select readOnly={readOnly !== undefined ? readOnly : false}
        onBlur={updateField}
        onChange={(event) => {
          setCurrentValue(event.target.value)
        }}>
        {options.map((option) => (
          <option key={option.value} value={option.value}
            selected={option.selected}>
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
