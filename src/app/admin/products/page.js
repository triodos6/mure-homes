'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Tag, 
  Box, 
  RefreshCw, 
  Globe2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/i18n/config';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc, name-asc
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=1000');
      if (!res.ok) throw new Error('Failed to fetch collection');
      const { products: data } = await res.json();
      setProducts(data || []);
    } catch (error) {
      toast.error('Error loading product collection');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/products/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${deleteData.name} removed from catalog`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsDeleting(false);
      setDeleteData(null);
    }
  };

  // Extract unique categories
  const categoriesList = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // KPIs
  const stats = useMemo(() => {
    const total = products.length;
    const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const avgPrice = total > 0 ? Math.round(totalValue / total) : 0;
    const brandsCount = new Set(products.map(p => p.brand).filter(Boolean)).size;
    return { total, avgPrice, brandsCount, totalValue };
  }, [products]);

  // Filter and Sort
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name?.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              Catalog Management
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-muted-foreground">Catalog Overview</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mt-1">
            Product Collection
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Manage your luxury furniture catalog, product details, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={fetchProducts}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border/80 bg-white text-xs font-semibold text-foreground hover:bg-secondary/60 transition-all shadow-xs cursor-pointer"
            title="Refresh product list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link 
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add New Piece</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pieces</span>
            <Box size={16} className="text-primary opacity-80" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground pt-1">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground font-light">Published & active in catalog</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Artisan Brands</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground pt-1">{stats.brandsCount}</p>
          <p className="text-[11px] text-muted-foreground font-light">Partner workshops & houses</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Valuation</span>
            <Tag size={16} className="text-primary" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground pt-1">€{stats.avgPrice.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground font-light">Base EUR catalog price</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Storefronts</span>
            <Globe2 size={16} className="text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-700 pt-1">Active</p>
          <p className="text-[11px] text-muted-foreground font-light">Global customer reach</p>
        </div>

      </div>

      {/* ── Filters, Search & View Controls ───────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border/80 bg-white shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search by piece name, brand, category, slug..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/80 bg-secondary/15 pl-10 pr-10 text-xs font-medium text-foreground focus:bg-white focus:border-black focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Controls (Sort & View Mode) */}
          <div className="flex items-center gap-2.5">
            
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-secondary/15 text-xs text-muted-foreground">
              <ArrowUpDown size={12} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value="newest">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-secondary/40 p-1 rounded-xl border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dense Table View"
              >
                <List size={15} />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

          </div>
        </div>

        {/* Category Filter Flex Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-secondary/30 text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground hover:border-border'
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categoriesList.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-secondary/30 text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground hover:border-border'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table View Mode ───────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  Piece Details
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hidden md:table-cell">
                  Category & Brand
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  Base Price (€)
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hidden sm:table-cell">
                  Languages
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 text-center text-xs text-muted-foreground">
                      <div className="h-5 bg-secondary/60 rounded-md max-w-sm mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Box size={32} className="mx-auto text-muted-foreground/50" />
                      <p className="text-sm font-semibold text-foreground">No pieces found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search query or category filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const translations = product.translations || {};
                  
                  // Calculate translation coverage
                  const translatedLocales = SUPPORTED_LOCALES.filter(
                    loc => loc === 'es' || translations[loc]?.status === 'published' || translations[loc]?.name
                  );
                  const coveragePercent = Math.round((translatedLocales.length / SUPPORTED_LOCALES.length) * 100);

                  return (
                    <tr key={product.id} className="group hover:bg-secondary/15 transition-colors">
                      
                      {/* Product Name & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-secondary/30 relative shadow-2xs">
                            <Image 
                              src={product.images?.[0] || product.thumbnail || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'} 
                              alt={product.name || 'Product'} 
                              width={56}
                              height={56}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              unoptimized
                            />
                          </div>
                          <div className="space-y-0.5">
                            <Link 
                              href={`/admin/products/${product.id}`}
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors block line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] font-mono text-muted-foreground block">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/40 text-xs capitalize font-medium text-foreground border border-border/60">
                            <Tag size={11} className="text-muted-foreground" />
                            {product.category || 'General'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/70 text-xs font-medium text-foreground bg-white shadow-2xs">
                            <Box size={11} className="text-muted-foreground" />
                            {product.brand || 'MuraHomes'}
                          </span>
                        </div>
                      </td>

                      {/* Base Price */}
                      <td className="px-5 py-4">
                        <span className="font-serif font-bold text-base text-foreground">
                          €{Number(product.price || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Translation Matrix Coverage */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="space-y-1.5 max-w-[190px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-muted-foreground">
                              {translatedLocales.length}/{SUPPORTED_LOCALES.length} Languages
                            </span>
                            <span className="font-bold text-emerald-700 text-[10px]">
                              {coveragePercent}%
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                              style={{ width: `${coveragePercent}%` }}
                            />
                          </div>

                          {/* Flag previews */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            {['es', 'en', 'fr', 'de', 'it', 'nl'].map(loc => (
                              <span key={loc} title={LOCALE_LABELS[loc]?.name}>
                                {LOCALE_LABELS[loc]?.flag}
                              </span>
                            ))}
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              +{SUPPORTED_LOCALES.length - 6} more
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Storefront Preview */}
                          <Link
                            href={`/products/${product.category || 'sofas'}/${product.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                            title="View on Live Storefront"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          {/* Direct Edit Studio */}
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-white text-xs font-semibold text-foreground hover:bg-secondary/60 hover:border-black/30 transition-all shadow-2xs cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit Piece</span>
                          </Link>

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => setDeleteData({ id: product.id, name: product.name })}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Remove from catalog"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Grid View Mode ────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const translations = product.translations || {};
            const translatedLocales = SUPPORTED_LOCALES.filter(
              loc => loc === 'es' || translations[loc]?.status === 'published' || translations[loc]?.name
            );
            const coveragePercent = Math.round((translatedLocales.length / SUPPORTED_LOCALES.length) * 100);

            return (
              <div 
                key={product.id}
                className="group rounded-2xl border border-border/80 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-4/3 w-full bg-secondary/30 overflow-hidden">
                    <Image
                      src={product.images?.[0] || product.thumbnail || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                        {product.category || 'General'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-serif font-bold text-foreground shadow-2xs">
                        €{Number(product.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {product.brand || 'MuraHomes'}
                      </span>
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="font-serif text-lg font-semibold text-foreground hover:text-primary transition-colors block mt-0.5 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        /{product.slug}
                      </p>
                    </div>

                    {/* Translation Coverage */}
                    <div className="p-3 rounded-xl border border-border/60 bg-secondary/15 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                          <Globe2 size={12} className="text-primary" /> {translatedLocales.length}/{SUPPORTED_LOCALES.length} Languages
                        </span>
                        <span className="font-bold text-emerald-700 text-[10px]">
                          {coveragePercent}% Translated
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${coveragePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-border/60 bg-secondary/10 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${product.category || 'sofas'}/${product.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>Storefront</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDeleteData({ id: product.id, name: product.name })}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete piece"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-black/85 transition-all shadow-xs"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── Table Footer Summary ──────────────────────────────── */}
      {!loading && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <p>
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of <span className="font-semibold text-foreground">{products.length}</span> pieces in collection
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">Catalog Synchronized</span>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      {deleteData && (
        <DeleteModal 
          isOpen={Boolean(deleteData)} 
          onClose={() => setDeleteData(null)} 
          onConfirm={confirmDelete}
          itemName={deleteData?.name}
          title="Remove Piece from Collection"
          description={`Are you sure you want to permanently remove "${deleteData?.name}" from your catalog? This will also remove all associated translations.`}
          isDeleting={isDeleting}
        />
      )}

    </div>
  );
}
