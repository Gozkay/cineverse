import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaFilm, FaBook, FaDragon } from 'react-icons/fa'
import { FaMasksTheater } from 'react-icons/fa6'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency } from '@/utils/formatCurrency'
import { useTrendingMovies } from '@/hooks/useTrendingMovies'
import { useBooks } from '@/hooks/useBooks'
import { useManga } from '@/hooks/useManga'
import { useComics } from '@/hooks/useComics'
import toast from 'react-hot-toast'


const categoryColors = { movie: 'text-red-400', book: 'text-blue-400', manga: 'text-pink-400', comic: 'text-emerald-400' }

function AdminProducts() {
  const [activeCategory, setActiveCategory] = useState('movie')
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: movies } = useTrendingMovies()
  const { data: books } = useBooks()
  const { data: manga } = useManga()
  const { data: comics } = useComics()

  useEffect(() => {
    const dataMap = { movie: movies, book: books, manga, comic: comics }
    const items = (dataMap[activeCategory] || []).map((item, i) => ({
      id: item.id || `item_${i}`,
      title: item.title || item.name || 'Unknown',
      price: item.price || Math.floor(Math.random() * 4000) + 1500,
      image: item.image || item.poster_path || item.images?.jpg?.image_url || '',
      category: activeCategory,
      rating: item.vote_average || item.averageRating || item.score || 0,
    }))
    setProducts(items) // eslint-disable-line react-hooks/set-state-in-effect
  }, [activeCategory, movies, books, manga, comics])

  const handleDelete = (id) => {
    setProducts(p => p.filter(item => item.id !== id))
    toast.success('Product removed')
  }

  const handleSave = () => {
    toast.success(editingProduct?.id ? 'Product updated' : 'Product added')
    setDialogOpen(false)
    setEditingProduct(null)
  }

  const categories = [
    { id: 'movie', label: 'Movies', icon: FaFilm, color: 'red' },
    { id: 'book', label: 'Books', icon: FaBook, color: 'blue' },
    { id: 'manga', label: 'Manga', icon: FaDragon, color: 'pink' },
    { id: 'comic', label: 'Comics', icon: FaMasksTheater, color: 'emerald' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              <span className="text-white">Product</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Management</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)} className="bg-violet-600 hover:bg-violet-500 text-white">
                <FaPlus className="mr-2" size={14} /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Title</label>
                  <Input defaultValue={editingProduct?.title} className="border-slate-700 bg-slate-800 text-white" placeholder="Product title" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Price (₦)</label>
                  <Input type="number" defaultValue={editingProduct?.price} className="border-slate-700 bg-slate-800 text-white" placeholder="0" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Category</label>
                  <select className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500">
                    <option value="movie">Movie</option>
                    <option value="book">Book</option>
                    <option value="manga">Manga</option>
                    <option value="comic">Comic</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Image URL</label>
                  <Input defaultValue={editingProduct?.image} className="border-slate-700 bg-slate-800 text-white" placeholder="https://..." />
                </div>
                <Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-500 text-white">{editingProduct ? 'Update' : 'Add'} Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.slice(0, 20).map((product) => (
                <TableRow key={product.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 overflow-hidden rounded bg-slate-800">
                        <img src={product.image || ''} alt={product.title} className="h-full w-full object-cover" onError={(e) => { e.target.src = '' }} />
                      </div>
                      <span className="text-sm text-white line-clamp-1">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs capitalize ${categoryColors[product.category]}`}>{product.category}</span>
                  </TableCell>
                  <TableCell className="text-white">{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <span className="text-yellow-400 text-xs">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setEditingProduct(product); setDialogOpen(true) }} className="text-blue-400 hover:text-blue-300">
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
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminProducts
