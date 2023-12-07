import React, {createContext, useContext, useEffect} from "react"
import useTimeout from './timeout'
import useLocalStorage from './localStorage'

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN
const APIP_ORIGIN = import.meta.env.VITE_APIP_ORIGIN
const AUTH_URL = `${BACKEND_ORIGIN}/api/users`
const APIP_AUTH_URL = `${APIP_ORIGIN}/authentication-service/v2`

export const UserSessionStatus: Record<string, number> = {
  LOGOUT: 0,
  WIP: 1,
  LOGIN: 2,
  ERROR: 3, // e.g. not in whitelist
}

interface User {
  status?: number
  error_code?: number
  code?: string | string[]
  isid?: string
  sub?: string
  given_name?: string
  family_name?: string
  email?: string
  issued_at?: number
  access_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
  state?: string
  refresh_token?: string
  refresh_token_expires_in?: number
  refresh_count?: number
  divisionName?: string
  divisionId?: string
  photo?: string
}

interface UserSession {
  user: User | null | undefined
  login: () => void
  logout: () => void
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}

type Props = {
  children: React.ReactNode
}

const SessionContext = createContext<UserSession | null>(null)

// with 10 sec allowance
const refreshTime = (user: User | null | undefined): number => {
  return (
    (user?.issued_at ?? 0) + ((user?.expires_in ?? 0) - 10) * 1000 - Date.now()
  )
}

const blobToBase64 = (blob: Blob | null): Promise<string | null> => {
  if (!blob || !blob.size) return Promise.reject(null)
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
  })
}

export const UserSessionProvider: React.FC<Props> = ({children}) => {
  const [user, setUser, userReady] = useLocalStorage<User | null>("user")

  const login = () => {
    window.location.href = `${AUTH_URL}/authorize`
  }

  const logout = () => {
    setUser(null)
  }

  const refresh = () => {
    if (user?.status === UserSessionStatus.WIP) return

    if (
      (user?.issued_at || 0) + (user?.refresh_token_expires_in || 0) * 1000 <
      Date.now()
    ) {
      logout()
      return
    }
    setUser(Object.assign({}, user || {}, {status: UserSessionStatus.WIP}))
    window
      .fetch(`${AUTH_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: user?.refresh_token,
        }),
      })
      .then((res) => res.json())
      .then((body) => {
        console.info("### refreshed")
        if (body?.access_token) {
          setUser(
            Object.assign({}, user || {}, body, {
              status: UserSessionStatus.LOGIN,
            }),
          )
        } else {
          logout()
        }
      })
      .catch((ex) => {
        console.error(ex)
        logout()
      })
  }

  const [setRefreshTick] = useTimeout(refresh)

  const fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const opt = init || {}
    opt.cache = "no-store"
    opt.headers = Object.assign({}, opt.headers || {}, {
      Authorization: `Bearer ${user?.access_token}`,
    })
    try {
      const res = await window.fetch(input, opt)
      if (res.ok) return Promise.resolve(res)
      throw res
    } catch (ex) {
      if (ex instanceof Response && ex.status === 410)
        refresh()
      console.error(ex)
      return Promise.reject(ex)
    }
  }

  const session: UserSession = {
    user,
    login,
    logout,
    fetch,
  }

  useEffect(() => {
    if (!userReady) return
    if (UserSessionStatus.LOGIN !== user?.status) logout()
    const href = new URL(window.location.href)
    const code = href.searchParams.get('code')
    if (!code) return

    setUser(Object.assign({status: UserSessionStatus.WIP, code}, user || {}))
    window
      .fetch(`${AUTH_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
        }),
      })
      .then((res) => {
        if (res.status >= 400) {
          setUser({
            status: UserSessionStatus.ERROR,
            error_code: res.status,
            code,
          })
          throw res.statusText
        }
        return res.json()
      })
      .then((body) => {
        if (body?.access_token) {
          setUser(
            Object.assign(
              {status: UserSessionStatus.LOGIN, code},
              user || {},
              body,
            ),
          )
        } else {
          logout()
        }
      })
      .catch((ex) => {
        console.error(ex)
      })
  }, [userReady])

  useEffect(() => {
    if (!userReady) return
    const refreshCount = refreshTime(user)
    if (user?.access_token) {
      if (refreshCount > 0) {
        setRefreshTick(refreshCount)
        if (!user?.isid) {
          fetch(`${APIP_AUTH_URL}/userinfo`)
            .then((res) => res.json())
            .then((body) => {
              if (body?.isid) {
                setUser(Object.assign({}, user || {}, body))
              } else {
                logout()
              }
            })
        }
      } else {
        refresh()
      }
    }
  }, [user?.access_token, userReady])

  useEffect(() => {
    if (!user?.isid) return
    fetch(`${AUTH_URL}/info`)
      .then((res) => res.json())
      .then((idir) => {
        if (!idir?.divisionName) throw "idir without divisionName"

        fetch(`${AUTH_URL}/photo`)
          .then((res) => (res.ok ? res.blob() : new Blob()))
          .then(blobToBase64)
          .then((photo) => {
            if (!photo || photo.length < 80) return
            setUser(Object.assign({}, user || {}, idir, {photo}))
          })
      })
      .catch((ex) => console.error(ex))
  }, [user?.isid])

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export const useUserSession = (): UserSession => {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error("useUserSession must be used within a UserSessionProvider")
  }
  return session
}