'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Search, Package, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 12;

export default function ProductsGrid({ initialProducts = [], initialTotal = 0, initialTotalPages = 1 }) {
  const containerRef = useRef(null);
  const gridListingRef = useRef(null);
  const isInitialMount = useRef(true);
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
    setQuery(debouncedSearch.trim());
  }, [debouncedSearch]);

  const fetchProducts = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: LIMIT, page: p });
      if (q) params.set('search', q);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
      setLoadingPage(null);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchProducts(query, page);
  }, [query, page, fetchProducts]);

  const shouldScrollRef = useRef(false);

  const scrollToGrid = useCallback(() => {
    const target = gridListingRef.current || containerRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (shouldScrollRef.current && !loading) {
      shouldScrollRef.current = false;
      requestAnimationFrame(() => {
        scrollToGrid();
      });
    }
  }, [loading, scrollToGrid]);

  const handlePageChange = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages || loading) return;
    shouldScrollRef.current = true;
    setLoadingPage(newPage);
    setPage(newPage);
    scrollToGrid();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
    setPage(1);
  };

  const getStatusText = () => {
    let text = `${total} artículo${total !== 1 ? 's' : ''}`;
    if (query) text += ` para "${query}"`;
    if (totalPages > 1) text += ` · Página ${page} de ${totalPages}`;
    return text;
  };

  return (
    <div ref={containerRef} className="scroll-mt-24">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-lg">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca o categoría..."
            className="w-full h-12 pl-11 pr-10 border border-border bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Product Listing Header (Scroll Target) */}
      <div ref={gridListingRef} className="scroll-mt-28">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2 min-h-[20px]">
            {loading ? (
              <div key="status-loading" className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-amber-500 shrink-0" />
                <span>Actualizando catálogo...</span>
              </div>
            ) : (
              <span key="status-loaded">{getStatusText()}</span>
            )}
          </h2>
          {query && (
            <button onClick={clearSearch} className="text-xs text-black underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-secondary/40 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <Package size={28} className="text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground italic">
            {query ? `No se encontraron productos para "${query}".` : 'No hay productos disponibles.'}
          </p>
          {query && (
            <button onClick={clearSearch} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all">
              Ver todos los productos →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            aria-label="Página anterior"
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loadingPage === page - 1 ? <Loader2 size={16} className="animate-spin text-black" /> : <ChevronLeft size={16} />}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isEllipsis =
              totalPages > 7 &&
              p !== 1 &&
              p !== totalPages &&
              (p < page - 2 || p > page + 2);
            const isPrevEllipsis =
              totalPages > 7 && p === 2 && page > 4;
            const isNextEllipsis =
              totalPages > 7 && p === totalPages - 1 && page < totalPages - 3;

            if (isEllipsis && !isPrevEllipsis && !isNextEllipsis) return null;
            if (isEllipsis)
              return (
                <span key={p} className="h-10 w-10 flex items-center justify-center text-muted-foreground text-sm">
                  …
                </span>
              );

            const isPageLoading = loadingPage === p;

            return (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                disabled={loading}
                aria-label={`Página ${p}`}
                className={`h-10 w-10 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-black text-white border-black'
                    : 'border-border hover:bg-secondary'
                } disabled:opacity-50`}
              >
                {isPageLoading ? <Loader2 size={14} className="animate-spin" /> : p}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            aria-label="Página siguiente"
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loadingPage === page + 1 ? <Loader2 size={16} className="animate-spin text-black" /> : <ChevronRight size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
