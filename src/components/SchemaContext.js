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

export const BASE_URL = 'https://schemas.data.amsterdam.nl'
export const VERSION = 'v1.0'
export const SCHEMA_URL = `${BASE_URL}/schema@${VERSION}`

const SchemaContext = React.createContext()

export default SchemaContext
