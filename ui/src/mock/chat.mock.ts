import { defineMock } from 'vite-plugin-mock-dev-server'

interface FakeStorage {
  cache: Record<string, ChatHistory[]>
  getItems: (key: string) => Promise<ChatHistory[]>
  setItem: (key: string, value: ChatHistory[]) => Promise<void>
}

const fakeStorage = {
  cache: {
    chats: [{
      id: 'xxx',
      first: 'xxx',
      last: "Lee",
      avatar: "https://placekitten.com/g/200/200",
      twitter: "your_handle",
      notes: "Some notes",
      favorite: false,
      created_at: new Date()
    },{
      id: 'yyy',
      first: 'yyy',
      last: "Lee",
      avatar: "https://placekitten.com/g/200/200",
      twitter: "your_handle",
      notes: "Some notes",
      favorite: false,
      created_at: new Date()
    }]
  },
  async getItems(key: string){
    const value = this.cache[key]
    return value || []
  },
  async setItem(key: string, value: ChatHistory[]){
    this.cache[key] = value
  }
} as FakeStorage

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {}

async function fakeNetwork(key: string = '') {
  if (!key) {
    fakeCache = {}
  }

  if (fakeCache[key]) return
  fakeCache[key] = true

  return new Promise(res => {
    setTimeout(res, Math.random() * 1000);
  })
}

async function getChats(query?: string) {
  await fakeNetwork(`getChats:${query}`);
  let chats = await fakeStorage.getItems("chats")
  chats = chats || []
  if (query) {
    chats = chats.filter(chat => chat?.first?.includes(query) || chat?.last?.includes(query))
  }
  return chats.sort((a, b) => (a?.created_at?.getTime() ?? 0) - (b?.created_at?.getTime() ?? 0))
}

async function createChat() {
  await fakeNetwork()
  const id = Math.random().toString(36).substring(2, 9)
  const chat = {
    id,
    first: id,
    last: "Lee",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: false,
    created_at: new Date()
  }
  const chats = await getChats()
  chats.unshift(chat)
  await set(chats)
  return chat
}

async function getChat(id: string) {
  await fakeNetwork(`chat:${id}`)
  const chats = await fakeStorage.getItems("chats")
  const chat = chats.find(chat => chat.id === id)
  return chat ?? null
}

async function updateChat(id: string, updates: ChatHistory) {
  await fakeNetwork()
  const chats = await fakeStorage.getItems("chats")
  const chat = chats.find(chat => chat.id === id)
  if (!chat) throw new Error(`No chat found for ${id}`)
  Object.assign(chat, updates)
  await set(chats)
  return chat
}

async function deleteChat(id: string) {
  const chats = await fakeStorage.getItems("chats")
  const index = chats.findIndex(chat => chat.id === id)
  if (index > -1) {
    chats.splice(index, 1)
    await set(chats)
    return true
  }
  return false
}

function set(chats: ChatHistory[]) {
  return fakeStorage.setItem("chats", chats)
}

export default defineMock([{
  url: '/api/chats',
  method: 'GET',
  async response(req, res){
    const q = req.query['q']
    const chats = await getChats(q)
    res.end(JSON.stringify(chats))
  }
},{
  url: '/api/chats/:chatId/meta',
  method: 'GET',
  async response(req, res){
    const chat = await getChat(req.params.chatId)
    if (!chat) {
      res.statusCode = 404
      res.statusMessage = 'Not Found'
      res.end()
      return
    }
    res.end(JSON.stringify(chat))
  }
},{
  url: '/api/chats',
  method: 'POST',
  type: 'json',
  async response(_req, res){
    const chat = await createChat()
    res.statusCode = 201
    res.end(JSON.stringify(chat))
  }
},{
  url: '/api/chats/:chatId/meta',
  method: 'PUT',
  type: 'json',
  async response(req, res){
    const update = req.body as ChatHistory
    const chat = await updateChat(req.params.chatId, update)
    res.end(JSON.stringify(chat))
  }
},{
  url: '/api/chats/:chatId/favorite',
  method: 'PUT',
  type: 'json',
  async response(req, res){
    const chat = await updateChat(req.params.chatId, {
      favorite: req.body.get('favorite') === 'true'
    })
    res.end(JSON.stringify(chat))
  }
},{
  url: '/api/chats/:chatId/meta',
  method: 'DELETE',
  async response(req, res){
    await deleteChat(req.params.chatId)
    res.statusCode = 204
    res.end()
  }
}])