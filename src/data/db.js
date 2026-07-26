import { getAll, create } from '@/lib/storage'

const SEED_KEY = 'cineverse_seeded'

const defaultAdmin = {
  id: 'admin_001',
  name: 'Admin User',
  email: 'admin@cineverse.com',
  password: 'admin123',
  role: 'admin',
  avatar: null,
  banned: false,
  createdAt: new Date().toISOString(),
}

const defaultManager = {
  id: 'manager_001',
  name: 'Manager User',
  email: 'manager@cineverse.com',
  password: 'manager123',
  role: 'manager',
  avatar: null,
  banned: false,
  createdAt: new Date().toISOString(),
}

const defaultStaff = [
  {
    id: 'staff_001',
    name: 'Staff One',
    email: 'staff1@cineverse.com',
    password: 'staff123',
    role: 'staff',
    avatar: null,
    banned: false,
    suspended: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'staff_002',
    name: 'Staff Two',
    email: 'staff2@cineverse.com',
    password: 'staff123',
    role: 'staff',
    avatar: null,
    banned: false,
    suspended: false,
    createdAt: new Date().toISOString(),
  },
]

const defaultCustomer = {
  id: 'customer_001',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'customer123',
  role: 'customer',
  avatar: null,
  banned: false,
  createdAt: new Date().toISOString(),
}

export function initializeDatabase() {
  if (localStorage.getItem(SEED_KEY)) return

  const users = getAll('users')
  if (users.length === 0) {
    create('users', defaultAdmin)
    create('users', defaultManager)
    defaultStaff.forEach(s => create('users', s))
    create('users', defaultCustomer)
  }

  const orders = getAll('orders')
  if (orders.length === 0) {
    create('orders', {
      userId: 'customer_001',
      items: [
        { productId: 'seed_movie_1', title: 'Inception', price: 3500, quantity: 1, image: '', category: 'movie' },
      ],
      totalAmount: 3500,
      status: 'delivered',
      shippingInfo: { fullName: 'John Doe', address: '123 Main St', city: 'Lagos', state: 'Lagos', zip: '100001', phone: '+2348000000001' },
      paymentMethod: 'card',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    })
    create('orders', {
      userId: 'customer_001',
      items: [
        { productId: 'seed_book_1', title: 'The Great Gatsby', price: 2500, quantity: 2, image: '', category: 'book' },
      ],
      totalAmount: 5000,
      status: 'processing',
      shippingInfo: { fullName: 'John Doe', address: '123 Main St', city: 'Lagos', state: 'Lagos', zip: '100001', phone: '+2348000000001' },
      paymentMethod: 'transfer',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    })
  }

  localStorage.setItem(SEED_KEY, 'true')
}
