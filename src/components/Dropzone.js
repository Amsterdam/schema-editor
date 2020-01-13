import React, { useState } from 'react'

import './Dropzone.css'

function getContents (file) {
  return new Promise((resolve) => {
    if (!file || !file.size || file.size === 0) {
      resolve()
    }

    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      resolve(event.target.result)
    }

    fileReader.readAsText(file)
  })
}

function formatFileSize (size) {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  } else {
    return `${Math.round(size / 1024 / 1024)} MB`
  }
}

function summarizeFiles (files) {
  return files
    .map((file) => `${file.name} (${formatFileSize(file.size)})`)
    .join('')
}

function filesFromDrop (event, options) {
  // Code adapted from:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  event.preventDefault()
  event.stopPropagation()

  if (event.dataTransfer.items && !options.multiple && event.dataTransfer.items.length !== 1) {
    throw new Error('Please drop one file at a time!')
  }

  if (event.dataTransfer.items) {
    const files = []
    for (const transferItem of event.dataTransfer.items) {
      if (transferItem.kind === 'file') {
        const file = transferItem.getAsFile()

        if (options.maxSize && file.size > options.maxSize) {
          throw new Error(`File too large. Maximum size is ${this.formatFileSize(options.maxSize)}.`)
        }

        if (options.pattern && !file.name.endsWith(options.pattern)) {
          throw new Error(`Filename "${file.name}" does not match pattern: ${options.pattern}`)
        }

        files.push(file)
      } else {
        throw new Error('Transfered item should be a file!')
      }
    }

    return files
  } else {
    throw new Error('DataTransfer not supported yet!')
  }
}

function onDragOver (event) {
  event.stopPropagation()
  event.preventDefault()
}

async function onDrop (event, options, setState, onDropped) {
  event.stopPropagation()
  event.preventDefault()

  try {
    const files = filesFromDrop(event, options)
    const contents = await getAllContents(files)

    const message = summarizeFiles(files)

    setState({
      state: 'dropped',
      message
    })

    if (onDropped) {
      const data = {
        files,
        contents
      }
      onDropped(data)
    }
  } catch (err) {
    setState({
      state: 'error',
      message: err.message
    })
  }
}

async function getAllContents (files) {
  let allContents = []
  for (const file of files) {
    const fileContents = await getContents(file)
    allContents.push(fileContents)
  }

  return allContents
}

const Dropzone = (props) => {
  const [state, setState] = useState({
    state: 'empty',
    message: undefined
  })

  let options = props.options || {}
  const defaultPlaceholder = options.multiple ? 'Drop files here…' : 'Drop file here…'
  const placeholder = options.placeholder || defaultPlaceholder

  options = {
    ...options,
    placeholder
  }

  return (
    <div className={`dropzone state-${state.state}`}
      onDrop={(event) => onDrop(event, options, setState, props.onDropped)}
      onDragOver={onDragOver}>
      <div className='dropzone-files'>
        <div>{ state.message || options.placeholder }</div>
        {/* { options.pattern ? <div style={{opacity: 0.5}}><code>{ options.pattern }</code></div> : '' } */}
        { options.maxSize ? <div style={{opacity: 0.5}}>max. {formatFileSize(options.maxSize)}</div> : '' }
      </div>
    </div>
  )
}

export default Dropzone
