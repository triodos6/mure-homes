'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Save,
  Trash2,
  Tag,
  DollarSign,
  Box,
  Layers,
  RefreshCw,
  Image as ImageIcon,
  X,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { categories } from '@/data/products';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DropZone from '@/components/DropZone/DropZone';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/i18n/config';
import { formatPrice } from '@/lib/currency/currency-service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState('es');
  const [localeSearch, setLocaleSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    brand: '',
    description: '',
    dimensions: '',
    materials: '',
    images: [],
    thumbnail: '',
    translations: {},
    marketPrices: {
      GBP: '',
      USD: '',
      CHF: '',
      PLN: '',
      SEK: '',
      DKK: '',
      NOK: '',
      CZK: '',
      HUF: '',
      RON: '',
    },
  });

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(setBrands).catch(() => {});
  }, []);

  const generateSlug = (name) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const product = await res.json();
        
        const existingTranslations = product.translations || {};
        const safeTranslations = {};

        SUPPORTED_LOCALES.forEach((loc) => {
          const trans = existingTranslations[loc] || {};
          safeTranslations[loc] = {
            name: trans.name || (loc === 'es' ? product.name : ''),
            slug: trans.slug || (loc === 'es' ? product.slug : ''),
            description: trans.description || (loc === 'es' ? product.description : ''),
            seoTitle: trans.seoTitle || '',
            seoDescription: trans.seoDescription || '',
            status: trans.status || (loc === 'es' || trans.name ? 'published' : 'missing'),
          };
        });

        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          category: product.category || '',
          price: product.price || '',
          brand: product.brand || '',
          description: product.description || '',
          dimensions: product.dimensions || '',
          materials: Array.isArray(product.materials) ? product.materials.join(', ') : (product.materials || ''),
          images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
          thumbnail: product.thumbnail || '',
          translations: safeTranslations,
          marketPrices: product.marketPrices || {},
        });
      } catch (error) {
        toast.error('Failed to load piece details');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const uploadFile = async (file, folder) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      const data = await uploadFile(file, 'products/thumbnails');
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
      toast.success('Thumbnail updated successfully');
    } catch {
      toast.error('Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImages(true);
    try {
      const data = await uploadFile(file, 'products/gallery');
      setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      toast.success('Image added to gallery');
    } catch {
      toast.error('Failed to upload gallery image');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleTranslationChange = (field, value) => {
    setFormData((prev) => {
      const currentLoc = prev.translations[activeTab] || {};
      const updatedLoc = {
        ...currentLoc,
        [field]: value,
        status: currentLoc.status === 'missing' && value ? 'draft' : currentLoc.status,
      };

      if (field === 'name' && (!currentLoc.slug || currentLoc.slug === generateSlug(currentLoc.name || ''))) {
        updatedLoc.slug = generateSlug(value);
      }

      const updatedTranslations = {
        ...prev.translations,
        [activeTab]: updatedLoc,
      };

      const syncBase = activeTab === 'es' ? {
        name: field === 'name' ? value : prev.name,
        slug: field === 'name' ? generateSlug(value) : (field === 'slug' ? value : prev.slug),
        description: field === 'description' ? value : prev.description,
      } : {};

      return {
        ...prev,
        ...syncBase,
        translations: updatedTranslations,
      };
    });
  };

  const handleCopyFromBase = () => {
    const es = formData.translations.es || {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
    };

    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeTab]: {
          name: es.name || prev.name,
          slug: generateSlug(es.name || prev.name),
          description: es.description || prev.description,
          seoTitle: es.seoTitle || '',
          seoDescription: es.seoDescription || '',
          status: 'draft',
        },
      },
    }));

    toast.success(`Copied content from Spanish to ${LOCALE_LABELS[activeTab]?.name || activeTab}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        materials: Array.isArray(formData.materials)
          ? formData.materials
          : (formData.materials ? formData.materials.split(',').map((s) => s.trim()).filter(Boolean) : []),
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Update failed');
      }

      toast.success(`${formData.name} updated successfully across all locales`);
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Deletion failed');
      toast.success(`${formData.name} removed from catalog`);
      router.push('/admin/products');
    } catch (error) {
      toast.error('Deletion failed');
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const translationStats = React.useMemo(() => {
    let published = 0;
    let draft = 0;
    let missing = 0;

    SUPPORTED_LOCALES.forEach((loc) => {
      const t = formData.translations[loc];
      if (t?.status === 'published') published++;
      else if (t?.status === 'draft') draft++;
      else missing++;
    });

    return { published, draft, missing, total: SUPPORTED_LOCALES.length };
  }, [formData.translations]);

  const filteredLocales = SUPPORTED_LOCALES.filter((loc) => {
    const info = LOCALE_LABELS[loc];
    const q = localeSearch.toLowerCase();
    return (
      loc.toLowerCase().includes(q) ||
      info?.name.toLowerCase().includes(q) ||
      info?.nativeName.toLowerCase().includes(q)
    );
  });

  const activeTranslation = formData.translations[activeTab] || {
    name: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'missing',
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={36} className="animate-spin text-primary" />
        <p className="tracking-widest uppercase text-xs">Loading Piece Details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-xs hover:translate-x-[-2px] hover:bg-secondary hover:text-foreground transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Product Studio
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">/{formData.slug}</span>
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight mt-1">
              {formData.name || 'Edit Product'}
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              Manage product storytelling, localized metadata, high-res assets, and global pricing matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-3 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">Delete</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Multi-Language Studio & Imagery */}
        <div className="lg:col-span-2 space-y-6">

          {/* Multi-Language Studio Card */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Header with Stats */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                  <Globe2 size={18} className="text-primary" /> Product Details & Localization
                </h2>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  Configure title, editorial story, and SEO metadata across languages.
                </p>
              </div>

              {/* Translation KPI Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 xl:pt-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs shrink-0">
                  <CheckCircle2 size={12} /> {translationStats.published} Published
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs shrink-0">
                  <Clock size={12} /> {translationStats.draft} Draft
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary/50 text-muted-foreground border border-border/70 shadow-2xs shrink-0">
                  <AlertCircle size={12} /> {translationStats.missing} Missing
                </span>
              </div>
            </div>

            {/* Language Selector Toolbar with Auto-Sized Flex Pills */}
            <div className="space-y-3.5 p-4 bg-secondary/15 rounded-2xl border border-border/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Language ({filteredLocales.length}):
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-44 sm:w-52">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={localeSearch}
                      onChange={(e) => setLocaleSearch(e.target.value)}
                      placeholder="Filter languages..."
                      className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border/80 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  {activeTab !== 'es' && (
                    <button
                      type="button"
                      onClick={handleCopyFromBase}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-white hover:bg-primary/5 rounded-lg border border-primary/20 transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      <Copy size={12} />
                      <span className="hidden sm:inline">Copy from Spanish</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Flex-Wrapping Auto-Width Badges */}
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1 pr-2">
                {filteredLocales.map((loc) => {
                  const info = LOCALE_LABELS[loc];
                  const status = formData.translations[loc]?.status || 'missing';
                  const isActive = activeTab === loc;

                  let statusDot = 'bg-gray-300';
                  if (status === 'published') statusDot = 'bg-emerald-500 ring-2 ring-emerald-200';
                  else if (status === 'draft') statusDot = 'bg-amber-400 ring-2 ring-amber-200';

                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setActiveTab(loc)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs border shrink-0 ${
                        isActive
                          ? 'bg-black text-white border-black shadow-sm ring-2 ring-black/10'
                          : 'bg-white text-foreground border-border/80 hover:border-black/40 hover:bg-secondary/40'
                      }`}
                    >
                      <span className="text-base leading-none">{info?.flag}</span>
                      <span className="font-bold tracking-wide uppercase text-[11px]">{loc}</span>
                      <span className={`text-xs ${isActive ? 'text-white/90' : 'text-muted-foreground font-normal'}`}>
                        {info?.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Language Meta Strip */}
            <div className="flex items-center justify-between bg-[#fcfcfc] p-4 rounded-xl border border-border/60">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{LOCALE_LABELS[activeTab]?.flag}</span>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {LOCALE_LABELS[activeTab]?.name} ({LOCALE_LABELS[activeTab]?.nativeName})
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Locale code: <span className="font-mono font-bold text-foreground">/{activeTab}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status:</span>
                <select
                  value={activeTranslation.status}
                  onChange={(e) => handleTranslationChange('status', e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-border/80 bg-white text-xs font-semibold focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="missing">Missing / Incomplete</option>
                </select>
              </div>
            </div>

            {/* Localized Name & Slug Fields */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Localized Piece Name ({activeTab.toUpperCase()}) {activeTab === 'es' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={activeTab === 'es'}
                  value={activeTranslation.name}
                  onChange={(e) => handleTranslationChange('name', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-colors"
                  placeholder={`e.g. ${activeTab === 'es' ? 'Sofá Modular Veneto' : 'Veneto Modular Sofa'}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Localized URL Slug ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={activeTranslation.slug}
                  onChange={(e) => handleTranslationChange('slug', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs font-mono text-muted-foreground focus:bg-white focus:border-black focus:outline-none transition-colors"
                  placeholder="veneto-modular-sofa"
                />
              </div>
            </div>

            {/* Editorial Story */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Editorial Story & Craftsmanship ({LOCALE_LABELS[activeTab]?.nativeName})
              </label>
              <RichTextEditor
                value={activeTranslation.description}
                onChange={(html) => handleTranslationChange('description', html)}
                placeholder={`Describe the design essence, materials, and tactile luxury in ${LOCALE_LABELS[activeTab]?.name}...`}
              />
            </div>

            {/* SERP Search Preview */}
            <div className="pt-6 border-t border-border/60 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Google Search Engine Preview ({activeTab.toUpperCase()})
                </h3>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-[#fcfcfc] space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 truncate">
                  <span>https://mura-homes.com</span>
                  <span>&gt;</span>
                  <span>{activeTab}</span>
                  <span>&gt;</span>
                  <span>products</span>
                  <span>&gt;</span>
                  <span className="font-semibold">{activeTranslation.slug || formData.slug || 'product'}</span>
                </div>
                <h4 className="text-blue-700 text-sm font-semibold hover:underline cursor-pointer truncate">
                  {activeTranslation.seoTitle || activeTranslation.name || formData.name || 'MuraHomes Product'} | MuraHomes
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {activeTranslation.seoDescription || (activeTranslation.description?.replace(/<[^>]*>?/gm, '') || formData.description) || 'Luxury contemporary furniture and Mediterranean interior design by MuraHomes.'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Meta Title</label>
                  <input
                    type="text"
                    value={activeTranslation.seoTitle || ''}
                    onChange={(e) => handleTranslationChange('seoTitle', e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs focus:outline-none focus:border-black"
                    placeholder="Custom Google title tag..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                  <input
                    type="text"
                    value={activeTranslation.seoDescription || ''}
                    onChange={(e) => handleTranslationChange('seoDescription', e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs focus:outline-none focus:border-black"
                    placeholder="Brief description for search snippets..."
                  />
                </div>
              </div>
            </div>

          </section>

          {/* Media Gallery */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon size={18} className="text-primary" /> Product Imagery
                </h2>
                <p className="text-xs text-muted-foreground font-light">High-resolution gallery assets shared across all languages.</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{formData.images.length} Images</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl border border-border/80 overflow-hidden group shadow-2xs">
                  <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white tracking-wider uppercase">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                    title="Remove Image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <DropZone
                onFileDrop={handleImageUpload}
                uploading={uploadingImages}
                label="Add gallery image"
                sublabel="JPG, PNG, WebP"
              />
            </div>
          </section>

        </div>

        {/* Right Column — Pricing, Classification & Specs */}
        <div className="space-y-6">
          
          {/* ── 1. Pricing & Global Currency Engine ──────────── */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald-600" /> Pricing & Conversion
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Base EUR price. Converts automatically based on exchange rates.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 uppercase border border-emerald-200">
                Base EUR
              </span>
            </div>

            {/* Base Price (€ EUR) Direct Input */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-secondary/15 border border-border/70">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Base Catalog Price (€ EUR) <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Store Anchor</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-lg text-foreground">€</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full h-12 pl-8 pr-4 rounded-xl border border-border/80 bg-white text-lg font-serif font-bold text-foreground focus:border-black focus:outline-none transition-colors shadow-2xs"
                  placeholder="2500"
                />
              </div>
            </div>

            {/* Live International Converted Matrix Preview */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Live Converted Storefront Prices:
                </span>
                <Link 
                  href="/admin/currencies"
                  className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Edit Rates</span>
                  <ArrowRight size={10} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'GBP', label: '🇬🇧 GBP (£)', rate: 0.854 },
                  { code: 'USD', label: '🇺🇸 USD ($)', rate: 1.085 },
                  { code: 'CHF', label: '🇨🇭 CHF', rate: 0.962 },
                  { code: 'PLN', label: '🇵🇱 PLN (zł)', rate: 4.315 },
                  { code: 'SEK', label: '🇸🇪 SEK (kr)', rate: 11.45 },
                  { code: 'DKK', label: '🇩🇰 DKK (kr)', rate: 7.458 },
                  { code: 'NOK', label: '🇳🇴 NOK (kr)', rate: 11.62 },
                  { code: 'CZK', label: '🇨🇿 CZK (Kč)', rate: 25.25 },
                ].map((c) => {
                  const calculated = Math.round((Number(formData.price) || 0) * c.rate * 100) / 100;
                  return (
                    <div key={c.code} className="p-2 rounded-xl border border-border/60 bg-secondary/10 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground">{c.label}</span>
                      <span className="font-serif font-bold text-xs text-foreground mt-0.5">
                        {formatPrice(calculated, c.code, 'es')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>All 18 currencies synced globally</span>
              <span className="text-emerald-700 font-bold">1-Place Management</span>
            </div>
          </section>

          {/* ── 2. Classification & Brand Partner ───────────────── */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif font-semibold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Tag size={16} className="text-primary" /> Classification & House
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category Segment <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/15 text-xs font-semibold focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Artisan Brand <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/15 text-xs font-semibold focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="" disabled>Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Physical Specifications */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-serif font-semibold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Box size={16} className="text-primary" /> Dimensions & Materials
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dimensions</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs focus:outline-none focus:border-black"
                  placeholder="e.g. 280 x 160 x 85 cm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Noble Materials (comma separated)</label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs focus:outline-none focus:border-black"
                  placeholder="Roble macizo, Lino natural, Latón cepillado"
                />
              </div>
            </div>
          </section>

          {/* Thumbnail Dropzone */}
          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Card Thumbnail Image</h3>
            <DropZone
              onFileDrop={handleThumbnailUpload}
              uploading={uploadingThumbnail}
              preview={formData.thumbnail}
              label="Drop thumbnail image"
              sublabel="Square 800x800 recommended"
            />
          </section>

        </div>

      </form>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          itemName={formData.name || 'this product'}
          isDeleting={isDeleting}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Remove Piece from Collection"
          description={`Are you sure you want to permanently remove "${formData.name}"? This action cannot be undone.`}
        />
      )}

    </div>
  );
}
