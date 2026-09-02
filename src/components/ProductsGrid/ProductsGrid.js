'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Search, Package, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useI18n } from '@/context/I18nContext';

const LIMIT = 12;

export default function ProductsGrid({ category = '', categoryName = '', initialProducts = [], initialTotal = 0, initialTotalPages = 1 }) {
  const { t, locale } = useI18n();
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

  // Sync initialProducts when locale changes
  useEffect(() => {
    setProducts(initialProducts);
    setTotal(initialTotal);
    setTotalPages(initialTotalPages);
  }, [initialProducts, initialTotal, initialTotalPages]);

  // Initialize page and query from URL search parameters on client mount / popstate
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = parseInt(params.get('page') || '1', 10);
      const searchParam = params.get('search') || '';
      
      setPage(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);
      if (searchParam !== search) {
        setSearch(searchParam);
        setQuery(searchParam.trim());
      }
    };

    syncFromUrl();

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    setQuery(debouncedSearch.trim());
  }, [debouncedSearch]);

  const fetchProducts = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: LIMIT, page: p, locale });
      if (category) params.set('category', category);
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
  }, [category, locale]);

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

    // Update URL parameter without full page refresh
    const url = new URL(window.location.href);
    if (newPage > 1) {
      url.searchParams.set('page', newPage);
    } else {
      url.searchParams.delete('page');
    }
    window.history.pushState({}, '', url.toString());

    scrollToGrid();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(search.trim());
    setPage(1);

    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    if (search.trim()) {
      url.searchParams.set('search', search.trim());
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url.toString());
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
    setPage(1);

    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    url.searchParams.delete('page');
    window.history.pushState({}, '', url.toString());
  };

  const getStatusText = () => {
    if (query) {
      return `${t('products.showingResults', { count: total }) || `Mostrando ${total} productos`} ${t('products.filters') ? `· ${query}` : ''}`;
    }
    const resolvedCatName = category ? (t(`categories.${category}`) || categoryName) : '';
    if (resolvedCatName) {
      return `${total} ${resolvedCatName} ${t('common.all') || ''}`;
    }
    return t('products.showingResults', { count: total }) || `${total} piezas en catálogo`;
  };

  return (
    <div ref={containerRef}>
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-10">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              category
                ? (t('products.searchCategoryPlaceholder', { category: t(`categories.${category}`) || categoryName }) || `Buscar en ${t(`categories.${category}`) || categoryName}...`)
                : (t('products.searchPlaceholder') || t('navigation.products') || 'Buscar piezas, marcas, estilos...')
            }
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-border/80 rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label={t('products.resetFilters') || "Limpiar búsqueda"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-black transition-colors rounded-full hover:bg-secondary cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Product Listing Header */}
      <div ref={gridListingRef} className="scroll-mt-28">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2 min-h-[20px]">
            {loading ? (
              <div key="status-loading" className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-amber-500 shrink-0" />
                <span>{t('common.loading') || 'Cargando...'}</span>
              </div>
            ) : (
              <span key="status-loaded">{getStatusText()}</span>
            )}
          </h2>
          {query && (
            <button onClick={clearSearch} className="text-xs text-black underline underline-offset-2 hover:text-muted-foreground transition-colors cursor-pointer">
              {t('products.resetFilters') || 'Limpiar búsqueda'}
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
          <p className="text-muted-foreground italic text-sm">
            {query
              ? (t('products.noProductsFound') || `No se encontraron productos para "${query}".`)
              : (t('products.noProductsFound') || 'No hay productos disponibles.')}
          </p>
          {query && (
            <button onClick={clearSearch} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all cursor-pointer">
              {t('navigation.viewAll') || 'Ver todos los productos'} →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} preload={i < 2} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            aria-label={t('common.back') || 'Página anterior'}
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                } disabled:opacity-50 cursor-pointer`}
              >
                {isPageLoading ? <Loader2 size={14} className="animate-spin" /> : p}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            aria-label="Página siguiente"
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {loadingPage === page + 1 ? <Loader2 size={16} className="animate-spin text-black" /> : <ChevronRight size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
