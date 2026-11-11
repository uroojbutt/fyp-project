import { useCallback, useEffect, useState } from 'react'

// Runs an async function on mount and tracks loading / error state.
// `fetcher` must be a stable reference (a module-level function).
// `setData` is exposed so pages can do optimistic updates.
const useFetch = (fetcher) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetcher())
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    load()
  }, [load])

  return { data, setData, loading, error, reload: load }
}

export default useFetch