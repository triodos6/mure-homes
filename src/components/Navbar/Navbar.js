'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { categories, getCategoryIcon } from '@/data/products';
import { buttonVariants } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/Cart/CartDrawer';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Menu, X, ShoppingBag, LayoutDashboard, LogOut, User, Package,
  Home as HomeIcon, Info, Sparkles, CheckCircle2, MapPin
} from 'lucide-react';
import logo from "@/../public/logo.png";

export default function Navbar({ dbRole, serverUserId }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isLoaded, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const role = user?.role || dbRole;
  const isAdmin = role === 'ADMIN';
  const loggedIn = isLoaded ? isSignedIn : !!serverUserId;

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  return (
    <>
      <header suppressHydrationWarning className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-border/80' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center z-[51]">
            <Image src={logo} alt="MuraHomes" width={160} height={40} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu suppressHydrationWarning>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/about" suppressHydrationWarning>Nosotros</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="uppercase tracking-widest text-sm font-medium" suppressHydrationWarning>Productos</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 w-[600px] p-6 gap-4">
                      <div className="col-span-4 flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg font-medium">Nuestras Colecciones</h3>
                        <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80 uppercase tracking-wider" suppressHydrationWarning>Ver Todo &rarr;</Link>
                      </div>
                      {categories.map((cat) => (
                        <Link key={cat.id} href={`/products/${cat.id}`} className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-secondary/50 transition-colors" suppressHydrationWarning>
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <span className="text-xl">{getCategoryIcon(cat.id)}</span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/brands" suppressHydrationWarning>Nuestras Marcas</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/pedido-online" suppressHydrationWarning>Pedido Online</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/showroom" suppressHydrationWarning>Showroom</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {!isAdmin && (
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Abrir cesta">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <div className="hidden lg:flex items-center gap-4 border-l border-border pl-6">
              {loggedIn ? (
                <div className="relative flex items-center gap-3">
                  {isAdmin && (
                    <Link href="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Panel de Administración">
                      <LayoutDashboard size={20} strokeWidth={1.5} />
                    </Link>
                  )}
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold overflow-hidden border border-border">
                      {user?.image ? (
                        <Image src={user.image} alt={displayName || 'Usuario'} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <span>{displayName.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <span>{displayName || 'Cuenta'}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-border bg-white shadow-lg py-1">
                        {user?.email && <p className="px-4 py-2 text-[10px] text-muted-foreground border-b border-border truncate">{user.email}</p>}
                        <Link href="/account/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                          <User size={14} /> Mi Perfil
                        </Link>
                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                          <Package size={14} /> Mis Pedidos
                        </Link>
                        <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-border mt-1">
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/sign-in" className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
              )}
              <Link href="/showroom" className={buttonVariants({ variant: "default", size: "sm", className: "h-9 px-5" })}>
                Reservar Cita
              </Link>
            </div>

            <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menú de navegación">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Side Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[85vw] sm:max-w-md bg-white p-0 flex flex-col h-full border-r border-border shadow-2xl z-[100]">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-border bg-secondary/10 flex flex-row items-center justify-between">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image src={logo} alt="MuraHomes" width={140} height={36} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
            </Link>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* User Profile Card */}
            {loggedIn ? (
              <div className="bg-secondary/40 rounded-xl p-4 border border-border/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-border shrink-0">
                    {user?.image ? (
                      <Image src={user.image} alt={displayName || 'Usuario'} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <span>{displayName.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-serif font-semibold text-foreground text-sm truncate">{displayName || 'Usuario'}</p>
                    {user?.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                  <Link
                    href="/account/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-secondary text-foreground font-medium transition-colors border border-border/40 shadow-xs"
                  >
                    <User size={14} className="text-amber-500" /> Mi Perfil
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-secondary text-foreground font-medium transition-colors border border-border/40 shadow-xs"
                  >
                    <Package size={14} className="text-amber-500" /> Mis Pedidos
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider justify-center"
                  >
                    <LayoutDashboard size={14} /> Panel de Admin
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-secondary/30 rounded-xl p-4 border border-border/60 text-center">
                <p className="font-serif font-semibold text-foreground text-sm mb-1">Bienvenido a MuraHomes</p>
                <p className="text-xs text-muted-foreground mb-3 font-light">Accede a tu cuenta para gestionar pedidos y perfil.</p>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full bg-black text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}

            {/* Main Navigation Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground px-3 mb-2">Navegación Principal</p>

              {[
                { href: '/', label: 'Inicio', icon: HomeIcon },
                { href: '/about', label: 'Nosotros', icon: Info },
                { href: '/products', label: 'Productos & Colecciones', icon: ShoppingBag },
                { href: '/brands', label: 'Nuestras Marcas', icon: Sparkles },
                { href: '/pedido-online', label: 'Pedido Online', icon: CheckCircle2 },
                { href: '/showroom', label: 'Showroom', icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-black text-white font-semibold shadow-sm'
                        : 'text-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-amber-400' : 'text-muted-foreground'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Categories Shortcuts */}
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground px-3 mb-2">Categorías Destacadas</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products/${cat.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/60 transition-colors text-xs font-medium"
                  >
                    <span>{getCategoryIcon(cat.id)}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t border-border bg-white mt-auto space-y-3">
            <Link
              href="/showroom"
              onClick={() => setMobileOpen(false)}
              className={buttonVariants({ size: 'lg', className: 'w-full uppercase tracking-widest text-xs font-bold py-3.5 shadow-md' })}
            >
              Reservar Cita en Showroom
            </Link>
            {loggedIn && (
              <button
                onClick={() => { setMobileOpen(false); signOut(); }}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 py-2 rounded-lg transition-colors"
              >
                <LogOut size={14} /> Cerrar Sesión
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}
