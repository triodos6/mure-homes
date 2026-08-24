'use client';

import React, { useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Plus,
  Layers,
  RefreshCw,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Search,
  Sparkles,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone/DropZone';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/i18n/config';

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('es');
  const [localeSearch, setLocaleSearch] = useState('');

  // Initialize translations object for all 22 European locales
  const initialTranslations = {};
  SUPPORTED_LOCALES.forEach((loc) => {
    initialTranslations[loc] = {
      name: '',
      slug: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
      status: loc === 'es' ? 'published' : 'missing',
    };
  });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
    translations: initialTranslations,
  });

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

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'brands/logos');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed');
      }
      const data = await res.json();

      setFormData((prev) => ({ ...prev, logo: data.url }));
      toast.success('Emblem uploaded successfully');
    } catch (error) {
      console.error('Brand logo upload error:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
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

  const copyFromBaseLanguage = () => {
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

    toast.success(`Copied narrative from Spanish to ${LOCALE_LABELS[activeTab]?.name || activeTab}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.translations?.es?.name) {
      toast.error('Please specify a brand name in the default language (Spanish).');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Creation failed');
      }

      toast.success(`${formData.name || formData.translations.es.name} registered to catalog!`);
      router.push('/admin/brands');
    } catch (err) {
      toast.error(err.message || 'Failed to register brand partner');
    } finally {
      setSaving(false);
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

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/brands"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-xs hover:translate-x-[-2px] hover:bg-secondary hover:text-foreground transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                New Artisan House
              </span>
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight mt-1">
              {formData.name || 'New Brand Partner'}
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              Register an artisanal workshop and configure brand details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
            Register Brand
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Brand Studio */}
        <div className="lg:col-span-2 space-y-6">

          <section className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Header with Stats */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                  <Globe2 size={18} className="text-primary" /> Brand Story & Localization
                </h2>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  Configure brand narrative, craft heritage, and metadata across languages.
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
                      onClick={copyFromBaseLanguage}
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
                    Language prefix: <span className="font-mono font-bold text-foreground">/{activeTab}</span>
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

            {/* Name & Slug */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Brand Name ({activeTab.toUpperCase()}) {activeTab === 'es' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={activeTab === 'es'}
                  value={activeTranslation.name}
                  onChange={(e) => handleTranslationChange('name', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-colors"
                  placeholder="e.g. Porada, Minotti, Molteni..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  URL Identifier (Slug)
                </label>
                <input
                  type="text"
                  value={activeTranslation.slug}
                  onChange={(e) => handleTranslationChange('slug', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/10 text-xs font-mono text-muted-foreground focus:bg-white focus:border-black focus:outline-none transition-colors"
                  placeholder="brand-identifier"
                />
              </div>
            </div>

            {/* Editorial Story */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Artisanal Story & Heritage Narrative ({LOCALE_LABELS[activeTab]?.nativeName})
              </label>
              <RichTextEditor
                value={activeTranslation.description}
                onChange={(html) => handleTranslationChange('description', html)}
                placeholder={`Describe the heritage, craftsmanship, and design philosophy in ${LOCALE_LABELS[activeTab]?.name}...`}
              />
            </div>

          </section>

        </div>

        {/* Right Column — Brand Emblem / Logo & Identity */}
        <div className="space-y-6">

          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-serif font-semibold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <ImageIcon size={16} className="text-primary" /> Visual Identity & Logo
            </h2>

            <p className="text-xs text-muted-foreground font-light">
              High-resolution vector emblem or transparent PNG shown on brand cards and collection pages.
            </p>

            <DropZone
              onFileDrop={handleFileUpload}
              uploading={uploading}
              preview={formData.logo}
              label="Drop brand logo or click to browse"
              sublabel="SVG, PNG with transparent background"
              aspectClass="h-44"
            />

            {formData.logo && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                  className="w-full py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Remove Logo
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border/80 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <Sparkles size={15} className="text-amber-500" /> Catalog Integration
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Once registered, this brand partner will immediately become available in the artisan selector when adding or editing pieces in the product studio.
            </p>
          </section>

        </div>

      </form>
    </div>
  );
}
