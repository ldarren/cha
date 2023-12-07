/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BACKEND_ORIGIN: string
  readonly VITE_APIP_ORIGIN: string
  readonly VITE_APIP_KEY?: string
  readonly VITE_APIP_SECRET?: string
  readonly VITE_GA4_TRACKING_ID: string
}

type ModelID = 'gpt-35-turbo' | 'gpt-4'

interface ChatHistory {
  id?: uuid
  first?: string
  last?: string
  avatar?: string
  twitter?: string
  notes?: string
  favorite?: boolean
  created_at?: Date
}