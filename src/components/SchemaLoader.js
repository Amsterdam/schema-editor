import { loadSchema, fromAmsterdamSchema } from './Tools'

function loadSchemaFromUri (uri, amsterdamSchemaUri, setDataset) {
  loadSchema(uri).then(
    (data) => setDataset(fromAmsterdamSchema(amsterdamSchemaUri, data))
  )
}

export default loadSchemaFromUri
