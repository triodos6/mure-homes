'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Layers,
  RefreshCw,
  Globe2,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ArrowUpRight
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

export default function AdminBrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brands');
      if (!res.ok) throw new Error('Failed to fetch brands');
      const data = await res.json();
      setBrands(data || []);
    } catch (error) {
      toast.error('Error loading brand registry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/brands/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${deleteData.name} removed from registry`);
      fetchBrands();
    } catch (error) {
      toast.error('Failed to remove brand');
    } finally {
      setIsDeleting(false);
      setDeleteData(null);
    }
  };

  // KPI stats
  const stats = useMemo(() => {
    const total = brands.length;
    const withLogo = brands.filter(b => b.logo).length;
    const fullyLocalized = brands.filter(b => {
      if (!b.translations) return false;
      const transCount = Object.keys(b.translations).filter(k => b.translations[k]?.name || b.translations[k]?.description).length;
      return transCount >= 20;
    }).length;

    return { total, withLogo, fullyLocalized };
  }, [brands]);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const q = searchQuery.toLowerCase();
      const matchName = (b.name || '').toLowerCase().includes(q);
      const matchSlug = (b.slug || '').toLowerCase().includes(q);
      const matchDesc = (b.description || '').toLowerCase().includes(q);
      return matchName || matchSlug || matchDesc;
    });
  }, [brands, searchQuery]);

  const copySlug = (slug) => {
    navigator.clipboard.writeText(slug);
    toast.success(`Copied slug: ${slug}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              Artisan Catalog
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-muted-foreground">{brands.length} Partners</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mt-1">
            Brand Registry
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Manage luxury artisanal partner houses, brand stories, and collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/admin/brands/new"
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Brand Partner</span>
          </Link>
          <button 
            onClick={fetchBrands}
            className="p-3 rounded-xl border border-border/80 bg-white text-muted-foreground hover:bg-secondary hover:text-foreground transition-all shadow-2xs cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Brands</span>
            <Layers size={16} className="text-primary opacity-80" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground">Registered design houses & workshops</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Visual Identity</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground">{stats.withLogo} / {stats.total}</p>
          <p className="text-[11px] text-muted-foreground">Brands with custom emblem</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Languages</span>
            <Globe2 size={16} className="text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground">Global</p>
          <p className="text-[11px] text-muted-foreground">Localized brand profiles</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search brands by name, narrative or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/80 bg-secondary/15 pl-10 pr-4 text-xs font-medium focus:border-black focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary/40 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
            >
              <List size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Cards Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl border border-border/80 bg-white p-6 animate-pulse space-y-4">
                <div className="h-16 w-16 rounded-xl bg-secondary/60 mx-auto" />
                <div className="h-4 w-32 bg-secondary/60 mx-auto rounded" />
                <div className="h-12 bg-secondary/40 rounded-xl" />
              </div>
            ))
          ) : filteredBrands.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border bg-white space-y-4">
              <Layers size={40} className="mx-auto text-muted-foreground/50" />
              <p className="font-serif text-lg font-medium text-foreground">No brand partners found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search criteria or add a new brand partner.</p>
              <Link
                href="/admin/brands/new"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                <Plus size={14} /> Add Brand
              </Link>
            </div>
          ) : (
            filteredBrands.map((brand) => {
              const trans = brand.translations || {};
              const transCount = Object.keys(trans).filter(k => trans[k]?.name || trans[k]?.description).length;

              return (
                <div 
                  key={brand.id}
                  className="rounded-2xl border border-border/80 bg-white p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-black/30 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Top strip */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Globe2 size={11} /> {transCount > 0 ? `${transCount} Languages` : 'Default'}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/brands/${brand.id}`} className="cursor-pointer">
                              <Edit3 size={14} className="mr-2" /> Edit Brand
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copySlug(brand.slug)} className="cursor-pointer">
                            <Copy size={14} className="mr-2" /> Copy Slug
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteData(brand)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl border border-border/80 bg-secondary/10 flex items-center justify-center p-2.5 shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {brand.logo ? (
                          <Image 
                            src={brand.logo} 
                            alt={brand.name} 
                            width={56} 
                            height={56} 
                            className="max-h-full max-w-full object-contain"
                            unoptimized 
                          />
                        ) : (
                          <span className="font-serif text-2xl font-bold text-foreground">
                            {brand.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {brand.name}
                        </h3>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          /{brand.slug}
                        </p>
                      </div>
                    </div>

                    {/* Narrative snippet */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
                      {brand.description || 'No editorial story provided for this artisan house.'}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-4">
                    <Link
                      href={`/brands`}
                      target="_blank"
                      className="text-[11px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Public Store</span>
                      <ArrowUpRight size={12} />
                    </Link>

                    <Link
                      href={`/admin/brands/${brand.id}`}
                      className="text-[11px] font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <Edit3 size={11} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Brand Table View */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Brand House</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Narrative / Story</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Localized Locales</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 opacity-50" />
                      <p className="text-xs uppercase tracking-widest">Loading registry...</p>
                    </td>
                  </tr>
                ) : filteredBrands.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-xs">
                      No brands match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBrands.map((brand) => {
                    const trans = brand.translations || {};
                    const transCount = Object.keys(trans).filter(k => trans[k]?.name || trans[k]?.description).length;

                    return (
                      <tr key={brand.id} className="hover:bg-secondary/15 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg border border-border/70 bg-secondary/10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {brand.logo ? (
                                <Image 
                                  src={brand.logo} 
                                  alt={brand.name} 
                                  width={36} 
                                  height={36} 
                                  className="max-h-full max-w-full object-contain" 
                                  unoptimized 
                                />
                              ) : (
                                <span className="font-serif text-sm font-bold text-foreground">
                                  {brand.name?.charAt(0)?.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <Link 
                                href={`/admin/brands/${brand.id}`}
                                className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors block"
                              >
                                {brand.name}
                              </Link>
                              <span className="text-[11px] font-mono text-muted-foreground block">
                                /{brand.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                            {brand.description || 'No description provided.'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/60">
                            <Globe2 size={12} />
                            {transCount > 0 ? `${transCount} Languages` : 'Default'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link 
                              href={`/admin/brands/${brand.id}`}
                              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                              title="Edit Brand"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <button
                              onClick={() => setDeleteData(brand)}
                              className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                              title="Delete Brand"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteData && (
        <DeleteModal
          isOpen={!!deleteData}
          itemName={deleteData.name || 'this brand partner'}
          isDeleting={isDeleting}
          onClose={() => setDeleteData(null)}
          onConfirm={confirmDelete}
          title="Remove Brand Partner"
          description={`Are you sure you want to remove "${deleteData.name}" from the official brand registry? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
