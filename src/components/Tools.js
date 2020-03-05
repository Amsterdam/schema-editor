import axios from 'axios'
import { fromJS } from 'immutable'

export function loadSchema (uri) {
  return axios.get(uri).then((response)=> response.data)
}

export function fromAmsterdamSchema (schemaUri, schema) {
  const dataset = {
    ...schema,
    tables: (schema.tables || []).map((table) => ({
      ...table,
      schema: undefined,
      rows: Object.entries((table.schema && table.schema.properties) || {})
                  .map((property) => propertyToRow(schemaUri, property))
    }))
  }

  return fromJS(dataset)
}

export function toAmsterdamSchema (schemaUri, dataset) {
  const emptyRowMetaSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    required: [
      'id',
      'schema'
    ]
  }

  const schema = dataset.toJS()

  return {
    ...schema,
    tables: (schema.tables || []).map((table) => ({
      ...table,
      rows: undefined,
      schema: {
        ...emptyRowMetaSchema,
        properties: table.rows && Object.fromEntries(table.rows.map((row) => rowToProperty(schemaUri, row)))
      }
    }))
  }
}




function propertyToRow (schemaUri, [id, schema]) {

  let type

  if (schema.$ref === `${schemaUri}#/definitions/id`) {
    type = 'id'
  } else if (schema.$ref === `${schemaUri}#/definitions/schema`) {
    type = 'schema'
  } else if (schema.type === 'string' && schema.format === 'date-time') {
    type = 'date-time'
  } else if (schema.type === 'string' && schema.format === 'time') {
    type = 'time'
  } else if (schema.type === 'string' && schema.format === 'date') {
    type = 'date'
  } else if (schema.type === 'string' && schema.format === 'uri') {
    type = 'uri'
  } else if (schema.type === 'string' && schema.format === 'uri-reference') {
    type = 'uri-reference'
  } else if (schema.type === 'string' && !schema.format) {
    type = 'string'
  } else if (schema.type === 'integer') {
    type = 'integer'
  } else if (schema.type === 'number') {
    type = 'number'
  } else if (schema.type === 'boolean') {
    type = 'boolean'
  } else if (schema.$ref === 'https://geojson.org/schema/Geometry.json') {
    type = 'geometry'
  } else if (schema.$ref === 'https://geojson.org/schema/Polygon.json') {
    type = 'polygon'
  } else if (schema.$ref === 'https://geojson.org/schema/LineString.json') {
    type = 'linestring'
  } else if (schema.$ref === 'https://geojson.org/schema/Point.json') {
    type = 'point'
  } else {
    throw new Error(`Can't create row from: ${JSON.stringify(schema)} ${schemaUri}`)
  }

  return {
    id,
    ...schema,
    type,
    $ref: undefined,
    format: undefined
  }
}

function rowToProperty (schemaUri, row) {
  let type
  if (row.type === 'id') {
    type = {
      $ref: `${schemaUri}#/definitions/id`
    }
  } else if (row.type === 'schema') {
    type = {
      $ref: `${schemaUri}#/definitions/schema`
    }
  } else if (row.type === 'string') {
    type = {
      type: 'string'
    }
  } else if (row.type === 'integer') {
    type = {
      type: 'string'
    }
  } else if (row.type === 'number') {
    type = {
      type: 'number'
    }
  } else if (row.type === 'date-time') {
    type = {
      type: 'string',
      format: 'date-time'
    }
  } else if (row.type === 'date') {
    type = {
      type: 'string',
      format: 'date'
    }
  } else if (row.type === 'time') {
    type = {
      type: 'string',
      format: 'time'
    }
  } else if (row.type === 'uri') {
    type = {
      type: 'string',
      format: 'uri'
    }
  } else if (row.type === 'uri-reference') {
    type = {
      type: 'string',
      format: 'uri-reference'
    }
  } else if (row.type === 'boolean') {
    type = {
      type: 'boolean'
    }
  } else if (row.type === 'geometry') {
    type = {
      $ref: 'https://geojson.org/schema/Geometry.json'
    }
  } else if (row.type === 'polygon') {
    type = {
      $ref: 'https://geojson.org/schema/Polygon.json'
    }
  } else if (row.type === 'linestring') {
    type = {
      $ref: 'https://geojson.org/schema/LineString.json'
    }
  } else if (row.type === 'point') {
    type = {
      $ref: 'https://geojson.org/schema/Point.json'
    }
  }

  return [
    row.id,
    {
      ...row,
      $ref: undefined,
      type: undefined,
      id: undefined,
      ...type
    }
  ]
}
