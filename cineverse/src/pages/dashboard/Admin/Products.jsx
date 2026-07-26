import { useState, useEffect, useCallback } from 'react'
import { FaPlus, FaEdit, FaTrash, FaFilm, FaBook, FaDragon, FaSearch } from 'react-icons/fa'
import { FaMasksTheater } from 'react-icons/fa6'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency } from '@/utils/formatCurrency'
import { getProducts, upsertProduct, deleteProduct } from '@/services/products'
import toast from 'react-hot-toast'

const categoryColors = { movie: 'text-red-400', book: 'text-blue-400', manga: 'text-pink-400', comic: 'text-emerald-400' }
const categoryLabels = { movie: 'Movies', book: 'Books', manga: 'Manga', comic: 'Comics' }

const defaultPrices = { movie: 2500, book: 2000, manga: 1800, comic: 2200 }

function AdminProducts() {
  const [activeCategory, setActiveCategory] = useState('movie')
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', category: 'movie', image: '', stock: 0 })

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data, count } = await getProducts({ category: activeCategory, search: search || undefined, page })
      setProducts(data)
      setTotalCount(count)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search, page])

  useEffect(() => { loadProducts() }, [loadProducts])

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ title: '', price: defaultPrices[activeCategory].toString(), category: activeCategory, image: '', stock: 0 })
    setDialogOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({ title: product.title, price: product.price.toString(), category: product.category, image: product.image || '', stock: product.stock || 0 })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) { toast.error('Enter a valid price'); return }

    try {
      const payload = {
        title: form.title.trim(),
        price,
        category: form.category,
        image: form.image || null,
        stock: parseInt(form.stock) || 0,
        slug: editingProduct?.slug || `${form.category}:${Date.now()}`,
        description: editingProduct?.description || '',
        external_id: editingProduct?.external_id || null,
      }
      if (editingProduct) payload.id = editingProduct.id
      await upsertProduct(payload)
      toast.success(editingProduct ? 'Product updated' : 'Product added')
      setDialogOpen(false)
      loadProducts()
    } catch {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      loadProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const categories = [
    { id: 'movie', label: 'Movies', icon: FaFilm, color: 'red' },
    { id: 'book', label: 'Books', icon: FaBook, color: 'blue' },
    { id: 'manga', label: 'Manga', icon: FaDragon, color: 'pink' },
    { id: 'comic', label: 'Comics', icon: FaMasksTheater, color: 'emerald' },
  ]

  const totalPages = Math.ceil(totalCount / 20)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">Product</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{totalCount} products in {categoryLabels[activeCategory]}</p>
          </div>
          <Button onClick={openAdd} className="bg-violet-600 hover:bg-violet-500 text-white">
            <FaPlus className="mr-2" size={14} /> Add Product
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setPage(1); setSearch('') }}
              className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
          <div className="relative ml-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search..."
              className="h-8 w-48 rounded-lg border border-slate-700 bg-slate-800 pl-8 pr-3 text-xs text-white outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />
              ))}
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Stock</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={5} className="text-center text-gray-500 py-10">No products found. Add your first product!</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-slate-800">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="h-full w-full object-cover" onError={(e) => { e.target.src = '' }} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] text-gray-600">N/A</div>
                          )}
                        </div>
                        <span className="text-sm text-white line-clamp-1">{product.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={`text-xs ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-400 text-xs">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(product)} className="text-blue-400 hover:text-blue-300">
                          <FaEdit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300">
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Title *</label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="border-slate-700 bg-slate-800 text-white" placeholder="Product title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Price (NGN) *</label>
                <Input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} className="border-slate-700 bg-slate-800 text-white" placeholder="0" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} className="border-slate-700 bg-slate-800 text-white" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Category</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500">
                <option value="movie">Movie</option>
                <option value="book">Book</option>
                <option value="manga">Manga</option>
                <option value="comic">Comic</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Image URL</label>
              <Input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} className="border-slate-700 bg-slate-800 text-white" placeholder="https://..." />
            </div>
            <Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
              {editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default AdminProducts
