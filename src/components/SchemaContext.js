import React from 'react'

const labels = {
  id: 'ID',
  type: 'Type',
  title: 'Title',
  license: 'License',
  description: 'Description',
  dateCreated: 'Date created',
  dateModified: 'Date modified',
  version: 'Version',
  homepage: 'Homepage',
  language: 'Language',
  // accrualPeriodicity:
  // spatialDescription:
  // spatialCoordinates:
  theme: 'Theme',
  publisher: 'Publisher',
  owner: 'Owner',
  keywords: 'Keywords',
  // hasBeginning:
  // hasEnd:
  crs: 'CRS'
}

export function displayLabel (text) {
  return labels[text] || text
}

export function getSchemaUri (config, path) {
  return `${config.baseUri}/${path}@${config.version}`
}

const SchemaContext = React.createContext()

export default SchemaContext
