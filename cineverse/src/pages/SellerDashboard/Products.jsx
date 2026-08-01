import { useState, useEffect, useCallback } from 'react'
import { FaPlus, FaEdit, FaTrash, FaFilm } from 'react-icons/fa'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import FileUpload from '@/components/Seller/FileUpload'
import { useAuth } from '@/context/AuthContext'
import { getSellerProducts, getPublicImageUrl } from '@/services/seller'
import { upsertProduct, deleteProduct } from '@/services/products'
import { formatCurrency } from '@/utils/formatCurrency'
import toast from 'react-hot-toast'

const defaultPrices = { movie: 2500, book: 2000, manga: 1800, comic: 2200 }

const statusBadge = {
  pending: <Badge variant="warning">Pending Review</Badge>,
  active: <Badge variant="success">Active</Badge>,
  rejected: <Badge variant="destructive">Rejected</Badge>,
}

function SellerProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', category: 'movie', image: '', video_url: '', stock: 0, description: '' })

  const loadProducts = useCallback(async () => {
    if (!user) return
    try {
      setProducts(await getSellerProducts(user.id))
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { loadProducts() }, [loadProducts]) // eslint-disable-line react-hooks/set-state-in-effect

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ title: '', price: defaultPrices.movie.toString(), category: 'movie', image: '', video_url: '', stock: 0, description: '' })
    setDialogOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      video_url: product.video_url || '',
      stock: product.stock || 0,
      description: product.description || '',
    })
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
        video_url: form.video_url || null,
        stock: parseInt(form.stock) || 0,
        description: form.description.trim(),
        slug: editingProduct?.slug || `${form.category}:${crypto.randomUUID()}`,
        seller_id: user.id,
      }
      if (editingProduct) payload.id = editingProduct.id
      await upsertProduct(payload)
      toast.success(editingProduct ? 'Product updated — it goes back to review' : 'Product submitted for review')
      setDialogOpen(false)
      loadProducts()
    } catch (e) {
      toast.error(e.message || 'Failed to save product')
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">My</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Products</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">{products.length} products · every edit goes back to review</p>
          </div>
          <Button onClick={openAdd} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90">
            <FaPlus className="mr-2" size={14} /> Post Product
          </Button>
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800/50 shimmer" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <FaFilm className="mx-auto mb-3 text-4xl text-amber-400/60" />
              <p className="text-gray-400">No products yet — post your first local movie!</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Sales</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-slate-800">
                        {product.image ? (
                          <img src={getPublicImageUrl(product.image)} alt={product.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[8px] text-gray-600">N/A</div>
                        )}
                      </div>
                      <span className="text-sm text-white line-clamp-1">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(product.price)}</TableCell>
                  <TableCell>{statusBadge[product.status] || statusBadge.pending}</TableCell>
                  <TableCell className="text-sm text-gray-400">{product.sales_count || 0}</TableCell>
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
              ))}
            </TableBody>
          </Table>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Post a Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Title *</label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="border-slate-700 bg-slate-800 text-white" placeholder="e.g. My Village Wedding (Nollywood)" />
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
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-amber-500">
                <option value="movie">Movie (local film)</option>
                <option value="book">Book</option>
                <option value="manga">Manga</option>
                <option value="comic">Comic</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Cover image</label>
              {user && (
                <FileUpload bucket="product-images" userId={user.id} accept="image/*" label="Upload cover image (JPG/PNG)" isImage onUploaded={(url) => setForm(f => ({ ...f, image: url }))} value={form.image} />
              )}
              {form.image && (
                <img src={form.image} alt="cover preview" className="mt-2 h-24 rounded-lg object-cover ring-1 ring-slate-700" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Movie file (video)</label>
              {user && (
                <FileUpload bucket="product-files" userId={user.id} accept="video/*" label="Upload your movie file (MP4)" onUploaded={(path) => setForm(f => ({ ...f, video_url: path }))} value={form.video_url} />
              )}
              <p className="mt-1 text-[10px] text-gray-600">Buyers get a download link after paying. Keep the file under ~500MB.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                placeholder="Tell buyers about your movie..."
              />
            </div>
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90">
              {editingProduct ? 'Update Product' : 'Submit for Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default SellerProducts
