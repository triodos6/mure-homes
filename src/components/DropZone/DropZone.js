'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, RefreshCw, X } from 'lucide-react';

export default function DropZone({
  onFileDrop,
  accept = 'image/*',
  uploading = false,
  label = 'Drop file here or click to browse',
  sublabel,
  preview,
  className = '',
  aspectClass = 'aspect-square',
  children,
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
  }, [onFileDrop]);

  const handleClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileDrop(file);
    e.target.value = '';
  };

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-300 ${
        dragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border bg-secondary/5 hover:border-primary/40'
      } ${aspectClass} ${className}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drag overlay */}
      {dragging && (
        <div className="absolute inset-0 z-30 bg-primary/10 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Upload size={24} className="text-primary animate-bounce" />
          </div>
          <p className="text-sm font-bold text-primary uppercase tracking-widest">Drop to upload</p>
        </div>
      )}

      {/* Content: either preview, children, or default placeholder */}
      {children ? (
        children
      ) : preview ? (
        <div className="relative w-full h-full group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase tracking-widest">
              {uploading ? 'Uploading...' : 'Change'}
            </span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
          {uploading ? (
            <RefreshCw size={32} strokeWidth={1} className="animate-spin" />
          ) : (
            <Upload size={32} strokeWidth={1} />
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
            {uploading ? 'Uploading...' : label}
          </p>
          {sublabel && !uploading && (
            <p className="text-[9px] text-muted-foreground/60 text-center px-4">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
