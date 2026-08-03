'use client';

import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Upload,
  Save,
  Trash,
  Tag,
  DollarSign,
  Box,
  Layers,
  RefreshCw,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { categories } from '@/data/products';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DropZone from '@/components/DropZone/DropZone';

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
  const thumbnailInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    brand: '',
    description: '',
    dimensions: '',
    materials: '',
    images: [],
    thumbnail: ''
  });

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(setBrands).catch(() => {});
  }, []);

  // Load existing product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const product = await res.json();
        
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price,
          brand: product.brand,
          description: product.description,
          dimensions: product.dimensions || '',
          materials: product.materials?.join(', ') || '',
          images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
          thumbnail: product.thumbnail || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Update failed');
      
      toast.success(`Successfully updated ${formData.name}`);
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to sync changes with collection');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file, folder) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form
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
      toast.success('Thumbnail uploaded');
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
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Piece removed from collection');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Deletion failed');
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={40} className="animate-spin" />
        <p className="tracking-widest uppercase text-xs">Restoring Mediterranean Artifact...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:translate-x-[-4px] hover:bg-secondary hover:text-foreground transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">Refine Piece</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Synchronizing registry with live collection layer.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white transition-all duration-300 shadow-sm"
          >
            <Trash size={16} />
            Destroy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            Commit Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3 pb-24">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Box size={22} className="text-primary opacity-80" />
              Manifest Information
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Designation</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 text-lg font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                  placeholder="e.g. Nuvola Grand Sofa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">The Narrative</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData({...formData, description: html})}
                  placeholder="Describe the Mediterranean essence of this piece..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Layers size={22} className="text-primary opacity-80" />
              Dimensions & Constitution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Volume Details</label>
                <input 
                  type="text" 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 placeholder:opacity-50"
                  placeholder="320cm x 110cm x 85cm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Core Materials</label>
                <input 
                  type="text" 
                  value={formData.materials}
                  onChange={(e) => setFormData({...formData, materials: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 placeholder:opacity-50"
                  placeholder="Oak, Linen, Brass..."
                />
              </div>
            </div>
          </section>

          {/* Gallery Images */}
          <section className="rounded-2xl border border-border bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <ImageIcon size={22} className="text-primary opacity-80" />
              Gallery Images
            </h2>
            <p className="text-xs text-muted-foreground">Upload multiple high-resolution images for the product gallery.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl border border-border overflow-hidden group">
                  <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Add Image — Drag & Drop */}
              <DropZone
                onFileDrop={handleImageUpload}
                uploading={uploadingImages}
                label="Drop or click to add"
                sublabel="JPG, PNG, WebP"
              />
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
            <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
              <Tag size={22} className="text-primary opacity-80" />
              Taxonomy
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Registry Category</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 appearance-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="" disabled>Select Segment</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Listing Price ($ USD)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full h-14 pl-12 pr-5 rounded-xl border border-border bg-secondary/10 text-lg font-serif focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                    placeholder="2500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Artisan/Brand</label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 appearance-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="" disabled>Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Thumbnail Preview */}
          <section className="rounded-2xl border border-border bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Product Thumbnail</h3>
            <p className="text-xs text-muted-foreground -mt-4">Square image used for product cards and listings.</p>
            
            <DropZone
              onFileDrop={handleThumbnailUpload}
              uploading={uploadingThumbnail}
              preview={formData.thumbnail}
              label="Drop or click to upload"
              sublabel="800x800px recommended"
              className="w-full"
            />
            <p className="text-[9px] text-center text-muted-foreground italic tracking-wide">Recommended: 800×800px, square crop.</p>
          </section>
        </div>
      </form>

      {isModalOpen && (
        <DeleteModal
          itemName={formData.name || 'this product'}
          isDeleting={isDeleting}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
