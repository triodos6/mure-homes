'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash, 
  Edit2, 
  Tag, 
  Box,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=1000');
      if (!res.ok) throw new Error('Failed to fetch collection');
      const { products: data } = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Error loading luxury collection');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/products/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${deleteData.name} removed from registry`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsDeleting(false);
      setDeleteData(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          Product Collection
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-48 sm:w-64 rounded-md border border-border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
          <Link 
            href="/admin/products/new"
            className="flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Piece</span>
          </Link>
          <button 
            onClick={fetchProducts}
            className="p-2 rounded-md border border-border bg-white text-muted-foreground hover:bg-secondary transition-colors"
            title="Refresh Registry"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Product</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Brand</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Price</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">Restoring data layer...</td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">No pieces found in collection matching your search.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/50 shadow-sm relative">
                          <Image 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'} 
                            alt={product.name || 'Producto'} 
                            width={48}
                            height={48}
                            className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                            unoptimized
                          />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 capitalize text-muted-foreground font-light tracking-wide">
                        <Tag size={14} className="opacity-70" />
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-light tracking-wide">
                        <Box size={14} className="opacity-70" />
                        {product.brand}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground outline-none">
                          <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-lg bg-white border border-border shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            className="flex items-center gap-2.5 text-sm py-2 px-3 rounded-md text-foreground cursor-pointer focus:bg-secondary/80 focus:text-primary transition-all"
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                          >
                            <Edit2 size={15} />
                            Edit Piece
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2.5 text-sm py-2 px-3 rounded-md text-destructive focus:text-white cursor-pointer focus:bg-destructive transition-all"
                            onClick={() => setDeleteData({ id: product.id, name: product.name })}
                          >
                            <Trash size={15} />
                            Remove Piece
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {!loading && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-2">
          <span>Displaying {filteredProducts.length} pieces of santiago bros collection</span>
          <div className="flex items-center gap-1">
            <button className="px-4 py-1.5 border border-border rounded-md hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all" disabled>Prev</button>
            <button className="px-4 py-1.5 border border-border rounded-md hover:bg-secondary disabled:opacity-30 transition-all font-bold">Next</button>
          </div>
        </div>
      )}

      {deleteData && (
        <DeleteModal
          itemName={deleteData.name}
          isDeleting={isDeleting}
          onCancel={() => setDeleteData(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
