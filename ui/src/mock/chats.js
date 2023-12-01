const localforage = {
  cache: {
    chats: [{
      id: 'xxx',
      first: 'xxx',
      last: "Lee",
      avatar: "https://placekitten.com/g/200/200",
      twitter: "your_handle",
      notes: "Some notes",
      favorite: false,
      created_at: Date.now()
    },{
      id: 'yyy',
      first: 'yyy',
      last: "Lee",
      avatar: "https://placekitten.com/g/200/200",
      twitter: "your_handle",
      notes: "Some notes",
      favorite: false,
      created_at: Date.now()
    }]
  },
  async getItem(key){
    const value = this.cache[key]
    return value || []
  },
  async setItem(key, value){
    this.cache[key] = value
  }
}

export async function getChats(query) {
  await fakeNetwork(`getChats:${query}`);
  let chats = await localforage.getItem("chats")
  chats = chats || []
  if (query) {
    chats = chats.filter(chat => chat.first.includes(query) || chat.last.includes(query))
  }
  return chats.sort((a, b) => a?.created_at ?? 0 - b?.created_at ?? 0)
}

export async function createChat() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9)
  let chat = {
    id,
    first: id,
    last: "Lee",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: false,
    created_at: Date.now()
  }
  let chats = await getChats();
  chats.unshift(chat);
  await set(chats);
  return chat;
}

export async function getChat(id) {
  await fakeNetwork(`chat:${id}`);
  let chats = await localforage.getItem("chats");
  let chat = chats.find(chat => chat.id === id);
  return chat ?? null;
}

export async function updateChat(id, updates) {
  await fakeNetwork();
  let chats = await localforage.getItem("chats");
  let chat = chats.find(chat => chat.id === id);
  if (!chat) throw new Error("No chat found for", id);
  Object.assign(chat, updates);
  await set(chats);
  return chat;
}

export async function deleteChat(id) {
  let chats = await localforage.getItem("chats");
  let index = chats.findIndex(chat => chat.id === id);
  if (index > -1) {
    chats.splice(index, 1);
    await set(chats);
    return true;
  }
  return false;
}

function set(chats) {
  return localforage.setItem("chats", chats);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}