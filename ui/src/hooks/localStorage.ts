import {useState, useEffect} from "react"

export default function useLocalStorage<T>(key: string) {
  const [value, setValue] = useState<T | null>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const cache = window.localStorage.getItem(key)
    if (!cache || !cache.charAt || cache.at(0) !== "{") {
      setValue(null)
      return
    }
    try {
      const json = JSON.parse(cache)
      setValue(json)
    } catch (ex) {
      setValue(null)
      console.warn(ex)
    }
  }, [])

  useEffect(() => {
    if (value === undefined) return
    window.localStorage.setItem(key, JSON.stringify(value))
    setReady(true)
  }, [key, value])

  return [value, setValue, ready] as const
}
