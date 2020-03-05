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
  status: 'Status',
  homepage: 'Homepage',
  language: 'Language',
  theme: 'Theme',
  objective: 'Objective',
  publisher: 'Publisher',
  owner: 'Owner',
  legalBasis: 'Legal Basis',
  contactPoint: 'Contact Point. Person and (optional) e-mail.',
  authorizationGrantor: 'Authorization Grantor',
  keywords: 'Keywords',
  accrualPeriodicity: 'Accrual Periodicity',
  // spatialDescription: 'Spatial Description',
  // spatialCoordinates: 'Spatial Coordinates',
  // hasBeginning: 'Has Beginning',
  // hasEnd: 'Has End',
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
