import { getAll, create, update, getById, remove as removeItem } from '@/lib/storage'

export function getOrders() {
  return getAll('orders')
}

export function getOrdersByUser(userId) {
  return getAll('orders').filter(o => o.userId === userId)
}

export function getOrderById(id) {
  return getById('orders', id)
}

export function createOrder(orderData) {
  return create('orders', {
    ...orderData,
    status: 'pending',
  })
}

export function updateOrderStatus(id, status) {
  return update('orders', id, { status })
}

export function deleteOrder(id) {
  return removeItem('orders', id)
}
