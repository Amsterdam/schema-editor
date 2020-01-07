import React from 'react'

export const BASE_URL = 'https://schemas.data.amsterdam.nl'
export const VERSION = 'v1.0'
export const SCHEMA_URL = `${BASE_URL}/schema@${VERSION}`

const SchemaContext = React.createContext()

export default SchemaContext
