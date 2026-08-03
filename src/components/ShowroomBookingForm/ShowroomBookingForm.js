'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { event } from '@/lib/pixel';

export default function ShowroomBookingForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          appointmentDate: form.date,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      event('Lead', { content_name: 'Showroom Appointment' });
      toast.success('Solicitud de Cita Enviada', {
        description: 'Nuestro equipo de diseño se pondrá en contacto contigo pronto para confirmar tu visita.',
      });
      setForm({ name: '', email: '', phone: '', date: '', message: '' });
    } catch {
      toast.error('Algo salió mal', { description: 'Por favor, inténtalo de nuevo o contáctanos directamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book" className="bg-white rounded-3xl border border-border shadow-xl p-8 lg:p-10 scroll-mt-24">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 block mb-3">Consulta Privada</span>
        <h2 className="font-serif text-3xl font-semibold mb-2">Reservar una <span className="text-amber-500">Cita</span></h2>
        <p className="text-sm text-muted-foreground font-light">
          Programa una sesión privada con uno de nuestros diseñadores de interiores sénior.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Nombre Completo *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre completo" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Email *</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@ejemplo.com" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Teléfono</Label>
            <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
          </div>
          <div>
            <Label htmlFor="date" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Fecha Preferida *</Label>
            <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
          </div>
        </div>
        <div>
          <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Detalles del Proyecto</Label>
          <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Cuéntanos sobre los espacios que deseas amueblar..." rows={4} className="bg-[#f9f7f4] border-border/60 focus-visible:ring-black resize-none" />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-13 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando Solicitud...' : <>Solicitar Consulta <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Confirmaremos tu cita en 24 horas por email.
        </p>
      </form>
    </div>
  );
}
