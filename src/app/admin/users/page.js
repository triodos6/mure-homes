'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Search, RefreshCw, Mail, Shield, UserCircle2, Crown, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch (error) {
      console.error('Users fetch error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
    return name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
  });

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const userCount = users.filter(u => u.role === 'USER').length;

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
      <RefreshCw size={36} className="animate-spin" />
      <p className="tracking-widest uppercase text-xs font-bold">Loading Users...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight flex items-center gap-3">
            <Users className="text-primary opacity-80" />
            Registered Users
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
            {users.length} total · {adminCount} admin{adminCount !== 1 ? 's' : ''} · {userCount} customer{userCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 w-72 rounded-xl border border-border bg-white px-10 text-sm focus:border-black focus:outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground italic">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name ?? ''}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                            unoptimized
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <UserCircle2 size={20} className="text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : <span className="text-muted-foreground italic">No name</span>}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${user.email}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail size={13} className="text-primary shrink-0" />
                        {user.email}
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <a
                          href={`tel:${user.phone}`}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Phone size={13} className="text-primary shrink-0" />
                          {user.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {user.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
                          <Crown size={10} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground">
                          <Shield size={10} /> Customer
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
