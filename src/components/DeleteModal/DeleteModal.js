import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteModal({ itemName, onCancel, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-destructive/10 p-6 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-serif text-2xl font-medium text-foreground">Confirm Deletion</h3>
            <p className="text-sm font-light text-muted-foreground px-4">
              Are you sure you want to permanently remove <span className="font-semibold text-foreground">&quot;{itemName}&quot;</span> from the database? This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 bg-secondary/20 p-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-4 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-destructive/90 transition-all font-sans disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
              <Trash2 size={16} />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
