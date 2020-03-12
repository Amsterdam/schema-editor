import { loadSchema, fromAmsterdamSchema } from './Tools'

function loadSchemaFromUri (uri, amsterdamSchemaUri, setDataset, setRemoteSchemaUriError, setLoading) {
    setLoading(true)
  loadSchema(uri).then(
    (data) => {
        setDataset(fromAmsterdamSchema(amsterdamSchemaUri, data))
        setLoading(false)
    }
  ).catch(error => {
      setRemoteSchemaUriError(error)
      setLoading(false)
  })
}

export default loadSchemaFromUri
