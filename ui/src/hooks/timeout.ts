import {useState, useEffect, useRef, useLayoutEffect} from "react"

function useTimeout(callback: () => void, delay?: number | null) {
  const savedCallback = useRef(callback)
  const [count, setCount] = useState(delay)
  const useIsomorphicLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (count == null) {
      return
    }
    // Note: if 0 or lesser, callback get trigger right away
    if (count <= 0) {
      savedCallback.current()
      return
    }
    const id = setTimeout(() => savedCallback.current(), count)

    return () => clearTimeout(id)
  }, [count])

  return [setCount]
}

export default useTimeout
