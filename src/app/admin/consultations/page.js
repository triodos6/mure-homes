'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  MessageSquare, Search, ChevronDown, ChevronUp,
  Mail, Calendar, Clock, CheckCircle2, XCircle, RefreshCw,
  Upload, Send, MapPin, Phone, FileText, ExternalLink, Globe,
  Coins, User, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone/DropZone';
import { formatPrice } from '@/lib/currency/currency-service';
import { EUROPEAN_COUNTRIES } from '@/lib/markets/config';

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [invoiceUrls, setInvoiceUrls] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [fileUploadingId, setFileUploadingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);

  useEffect(() => { fetchConsultations(); }, []);

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      if (!res.ok) throw new Error('Failed to fetch');
      setConsultations(await res.json());
    } catch (error) { 
      console.error('Consultations fetch error:', error); 
      toast.error('Failed to load inquiries'); 
    } finally { 
      setLoading(false); 
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Status updated to ${newStatus}`);
    } catch { 
      toast.error('Failed to update status'); 
    }
  };

  const handleInvoiceUpload = async (id) => {
    const url = invoiceUrls[id]?.trim();
    if (!url) { toast.error('Please enter a valid invoice URL'); return; }

    setUploadingId(id);
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceUrl: url, sendEmail: false })
      });
      if (!res.ok) throw new Error();
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, invoiceUrl: url } : c));
      toast.success('Invoice saved successfully');
    } catch { 
      toast.error('Failed to save invoice');
    } finally { 
      setUploadingId(null); 
    }
  };

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleInvoiceFileUpload = async (id, file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size limit exceeded (${MAX_FILE_SIZE_MB}MB). Please upload a smaller file.`);
      return;
    }

    setFileUploadingId(id);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'invoices');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload error');
      }
      const data = await res.json();
      setInvoiceUrls(prev => ({ ...prev, [id]: data.url }));
      // Auto-save to DB
      await fetch(`/api/consultations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceUrl: data.url, sendEmail: false })
      });
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, invoiceUrl: data.url } : c));
      toast.success('Invoice uploaded and saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload invoice');
    } finally {
      setFileUploadingId(null);
    }
  };

  const handleShareInvoice = async (id) => {
    const c = consultations.find(x => x.id === id);
    if (!c?.invoiceUrl && !invoiceUrls[id]) { toast.error('Please save or upload an invoice first'); return; }

    setSharingId(id);
    try {
      const url = c.invoiceUrl || invoiceUrls[id];
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceUrl: url, sendEmail: true })
      });
      if (!res.ok) throw new Error();
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, invoiceShared: true, status: 'contacted' } : c));
      toast.success('Invoice emailed to client successfully');
    } catch { 
      toast.error('Failed to send invoice email');
    } finally { 
      setSharingId(null); 
    }
  };

  const filteredInquiries = consultations.filter(c =>
    (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.market || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.currency || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const map = {
      pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={10} />, label: 'Pending' },
      contacted: { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Mail size={10} />, label: 'Contacted' },
      completed: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={10} />, label: 'Completed' },
      cancelled: { cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle size={10} />, label: 'Cancelled' },
    };
    const s = map[status] || { cls: 'bg-secondary text-muted-foreground border-border', icon: null, label: status };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${s.cls}`}>
        {s.icon} {s.label}
      </span>
    );
  };

  const getCountryMeta = (code) => {
    if (!code) return { code: 'ES', name: 'España', flag: '🇪🇸' };
    const match = EUROPEAN_COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
    return match || { code: code.toUpperCase(), name: code.toUpperCase(), flag: '🌐' };
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
      <RefreshCw size={36} className="animate-spin" />
      <p className="tracking-widest uppercase text-xs font-bold">Loading Consultations & Orders...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight flex items-center gap-3">
            <MessageSquare className="text-primary opacity-80" />
            Client Consultations & Orders
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
            Order Registry & Client Invoicing
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input 
              type="text" 
              placeholder="Search by client, email, country, currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-80 rounded-xl border border-border bg-white px-10 text-sm focus:border-black focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Market & Region</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ordered Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Invoice</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Expand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground italic">
                    No consultations or orders found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const countryMeta = getCountryMeta(inquiry.market || inquiry.country);
                  const orderCurrency = (inquiry.currency || 'EUR').toUpperCase();
                  const orderLocale = inquiry.locale || 'es';
                  const formattedTotal = formatPrice(inquiry.totalPrice, orderCurrency, orderLocale);

                  return (
                    <React.Fragment key={inquiry.id}>
                      <tr
                        className={`group hover:bg-secondary/5 transition-all cursor-pointer ${expandedId === inquiry.id ? 'bg-secondary/10' : ''}`}
                        onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                      >
                        {/* Client Column */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {inquiry.customerName}
                            </span>
                            <span className="text-xs text-muted-foreground">{inquiry.customerEmail}</span>
                            {inquiry.customerPhone && (
                              <span className="text-xs text-muted-foreground font-mono">{inquiry.customerPhone}</span>
                            )}
                          </div>
                        </td>

                        {/* Market & Region Column */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                              <span className="text-base leading-none">{countryMeta.flag}</span>
                              <span className="font-bold">{countryMeta.code}</span>
                              <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">({countryMeta.name})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="px-1.5 py-0.2 bg-secondary text-[9px] font-mono font-bold uppercase rounded text-muted-foreground">
                                {orderLocale}
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                {orderCurrency}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-foreground flex items-center gap-1.5">
                            <Calendar size={13} className="opacity-40" />
                            {new Date(inquiry.createdAt).toLocaleDateString(orderLocale === 'en' ? 'en-GB' : `${orderLocale}-${orderLocale.toUpperCase()}`, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>

                        {/* Total in Ordered Currency */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-serif text-base font-semibold text-foreground">
                              {formattedTotal}
                            </span>
                            <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground">
                              {orderCurrency}
                            </span>
                          </div>
                        </td>

                        {/* Invoice Column */}
                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          {inquiry.invoiceUrl ? (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${inquiry.invoiceShared ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                <FileText size={9} /> {inquiry.invoiceShared ? 'Shared' : 'Saved'}
                              </span>
                              <a href={inquiry.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">No invoice</span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-5">{getStatusBadge(inquiry.status)}</td>

                        {/* Expand Action */}
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                            {expandedId === inquiry.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedId === inquiry.id && (
                        <tr className="bg-secondary/5 border-t border-border animate-in slide-in-from-top-2 duration-300">
                          <td colSpan="7" className="px-8 py-8">
                            <div className="grid lg:grid-cols-3 gap-8">
                              
                              {/* Items Column */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-black/20 pb-2">
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">
                                    Ordered Pieces ({Array.isArray(inquiry.items) ? inquiry.items.length : 0})
                                  </h4>
                                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 rounded">
                                    {orderCurrency}
                                  </span>
                                </div>
                                
                                {Array.isArray(inquiry.items) && inquiry.items.map((item, idx) => {
                                  const itemUnitPrice = item.unitPriceSnapshot || item.price || 0;
                                  const itemCurrency = item.currency || orderCurrency;
                                  return (
                                    <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-xl border border-border/50 shadow-xs">
                                      <div className="h-10 w-10 rounded bg-secondary/30 overflow-hidden shrink-0">
                                        <Image src={item.images?.[0] || '/images/img1.jpg'} width={40} height={40} className="h-full w-full object-cover" alt={item.productNameSnapshot || item.name || ''} unoptimized />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium truncate text-foreground">{item.productNameSnapshot || item.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{item.brand} | Qty: {item.quantity}</p>
                                      </div>
                                      <div className="text-sm font-serif font-semibold shrink-0 text-foreground">
                                        {formatPrice(itemUnitPrice * item.quantity, itemCurrency, orderLocale)}
                                      </div>
                                    </div>
                                  );
                                })}

                                <div className="pt-2 border-t border-border flex justify-between items-baseline">
                                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Total:</span>
                                  <span className="font-serif text-lg font-bold text-foreground">{formattedTotal}</span>
                                </div>
                              </div>

                              {/* Delivery & Regional Telemetry */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black/20 pb-2">
                                  Region, Currency & Shipping
                                </h4>
                                
                                <div className="bg-white rounded-xl border border-border/50 p-4 space-y-2.5 text-sm shadow-xs">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                      <Globe size={13} className="text-primary" /> Target Market:
                                    </span>
                                    <span className="font-bold text-foreground flex items-center gap-1">
                                      <span>{countryMeta.flag}</span> {countryMeta.name} ({countryMeta.code})
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                      <Coins size={13} className="text-primary" /> Transaction Currency:
                                    </span>
                                    <span className="font-bold text-foreground font-mono">
                                      {orderCurrency}
                                    </span>
                                  </div>

                                  {inquiry.address && (
                                    <div className="flex gap-2 text-muted-foreground pt-1">
                                      <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                                      <div>
                                        <p className="text-foreground font-medium">{inquiry.address}</p>
                                        {inquiry.city && <p>{inquiry.city}</p>}
                                        <p>{inquiry.state}{inquiry.pinCode ? ` — ${inquiry.pinCode}` : ''}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {inquiry.customerPhone && (
                                    <div className="flex gap-2 text-muted-foreground items-center pt-1 border-t border-border/40">
                                      <Phone size={14} className="shrink-0 text-primary" />
                                      <p className="font-mono text-xs">{inquiry.customerPhone}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Status Controls */}
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black/20 pb-2 mt-4">
                                  Update Order Status
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {['pending', 'contacted', 'completed', 'cancelled'].map((s) => (
                                    <button
                                      key={s}
                                      onClick={(e) => { e.stopPropagation(); updateStatus(inquiry.id, s); }}
                                      className={`px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                                        inquiry.status === s
                                          ? 'bg-black text-white border-black'
                                          : 'bg-white text-muted-foreground border-border hover:border-black/40 hover:text-foreground'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Invoice Management */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black/20 pb-2">
                                  Invoice Management
                                </h4>
                                
                                <div className="bg-white rounded-xl border border-border/50 p-4 space-y-3 shadow-xs">
                                  {/* File Upload — Drag & Drop */}
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <DropZone
                                      onFileDrop={(file) => handleInvoiceFileUpload(inquiry.id, file)}
                                      accept="image/*,.pdf"
                                      uploading={fileUploadingId === inquiry.id}
                                      label="Drop invoice PDF or click to browse"
                                      sublabel="PDF, PNG, JPG (Max 10MB)"
                                      aspectClass="h-20"
                                    />
                                  </div>

                                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                                    Or paste external URL (PDF link)
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={invoiceUrls[inquiry.id] ?? inquiry.invoiceUrl ?? ''}
                                    onChange={(e) => { e.stopPropagation(); setInvoiceUrls(prev => ({ ...prev, [inquiry.id]: e.target.value })); }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full h-10 px-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                                  />

                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleInvoiceUpload(inquiry.id); }}
                                    disabled={uploadingId === inquiry.id}
                                    className="w-full h-9 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    <span className="flex items-center justify-center gap-2">
                                      {uploadingId === inquiry.id ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                                      <span>Save Invoice URL</span>
                                    </span>
                                  </button>

                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleShareInvoice(inquiry.id); }}
                                    disabled={sharingId === inquiry.id || (!inquiry.invoiceUrl && !invoiceUrls[inquiry.id])}
                                    className="w-full h-9 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-40 cursor-pointer"
                                  >
                                    <span className="flex items-center justify-center gap-2">
                                      {sharingId === inquiry.id ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                                      <span>Share with Customer</span>
                                    </span>
                                  </button>

                                  {inquiry.invoiceShared && (
                                    <p className="text-[10px] text-emerald-600 text-center font-medium flex items-center justify-center gap-1">
                                      <CheckCircle2 size={11} /> Invoice emailed to customer
                                    </p>
                                  )}
                                </div>

                                <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                                  <a
                                    href={`mailto:${inquiry.customerEmail}?subject=Order #${inquiry.id.slice(-8).toUpperCase()} - MuraHomes`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full h-9 bg-white border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2 hover:border-black hover:text-foreground transition-all"
                                  >
                                    <Mail size={12} /> Contact Client Directly
                                  </a>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
