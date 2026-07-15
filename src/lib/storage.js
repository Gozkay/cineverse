const DB_PREFIX = 'cineverse_'

function getCollection(name) {
  try {
    const data = localStorage.getItem(`${DB_PREFIX}${name}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCollection(name, data) {
  localStorage.setItem(`${DB_PREFIX}${name}`, JSON.stringify(data))
}

export function getAll(collection) {
  return getCollection(collection)
}

export function getById(collection, id) {
  const items = getCollection(collection)
  return items.find(item => item.id === id) || null
}

export function create(collection, item) {
  const items = getCollection(collection)
  const newItem = { ...item, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  items.push(newItem)
  saveCollection(collection, items)
  return newItem
}

export function update(collection, id, updates) {
  const items = getCollection(collection)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
  saveCollection(collection, items)
  return items[index]
}

export function remove(collection, id) {
  const items = getCollection(collection)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  saveCollection(collection, items)
  return true
}

export function query(collection, predicate) {
  const items = getCollection(collection)
  return items.filter(predicate)
}

export function clearCollection(collection) {
  localStorage.removeItem(`${DB_PREFIX}${collection}`)
}

export function getNextId(collection) {
  const items = getCollection(collection)
  return items.length > 0 ? Math.max(...items.map(i => parseInt(i.id) || 0)) + 1 : 1
}
