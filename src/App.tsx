import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlay,
  Compass,
  Facebook,
  Gamepad2,
  Instagram,
  Menu,
  Pause,
  Play,
  Search,
  Shield,
  Sparkles,
  Twitter,
  X,
  Youtube,
} from 'lucide-react';
import { games, getGame, imageAssets, newsItems, type Game, type GameStatus } from '@/data';

type Route = { path: string; slug?: string };

function currentRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/games/') && path !== '/games') return { path: '/games/:slug', slug: path.split('/')[2] };
  return { path };
}

function go(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openDialog(id: string): void {
  const dialog = document.getElementById(id) as HTMLDialogElement | null;
  dialog?.showModal();
}

function closeDialog(id: string): void {
  const dialog = document.getElementById(id) as HTMLDialogElement | null;
  dialog?.close();
}

function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#090b10] text-[#f5f6fa]">
      <Header route={route} />
      {route.path === '/' && <Home />}
      {route.path === '/games' && <GamesCatalog />}
      {route.path === '/games/:slug' && route.slug && <GameDetail slug={route.slug} />}
      {!['/', '/games', '/games/:slug'].includes(route.path) && <SimplePage route={route.path} />}
      <Footer />
    </div>
  );
}

function Header({ route }: { route: Route }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: 'Games', path: '/games' },
    { label: 'Studio', path: '/about' },
    { label: 'Journal', path: '/news' },
    { label: 'Community', path: '/community' },
  ];
  const navigate = (path: string) => { setMobileOpen(false); go(path); };
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/[.08] bg-[#090b10]/40 backdrop-blur-md">
      <div className="container-shell flex h-[82px] items-center justify-between">
        <button className="flex items-center gap-3" onClick={() => navigate('/')} aria-label="Soft Pixel Studio home">
          <span className="grid h-8 w-8 place-items-center border border-[#477bff]/70 bg-[#477bff]/10 text-[#8eacff]"><span className="text-sm font-bold">S</span></span>
          <span className="hidden text-[12px] font-bold tracking-[.22em] sm:block">SOFT PIXEL <span className="text-[#8c96aa]">/ STUDIO</span></span>
        </button>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {links.map((link) => <button key={link.path} onClick={() => navigate(link.path)} className={`relative text-[11px] font-semibold uppercase tracking-[.16em] transition-colors hover:text-[#8eacff] ${route.path === link.path || (link.path === '/games' && route.path === '/games/:slug') ? 'text-white' : 'text-[#8c96aa]'}`}>
            {link.label}{route.path === link.path && <span className="absolute -bottom-[31px] left-0 h-px w-full bg-[#477bff]" />}
          </button>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/account')} className="hidden border border-white/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[.16em] transition hover:border-[#477bff] hover:text-[#8eacff] sm:block">Player account</button>
          <button onClick={() => setMobileOpen((value) => !value)} className="grid h-10 w-10 place-items-center border border-white/15 text-[#c9cfdb] lg:hidden" aria-label="Toggle menu">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {mobileOpen && <div className="border-t border-white/10 bg-[#0c0f16] px-5 py-6 lg:hidden"><div className="container-shell flex flex-col gap-5">{links.map((link) => <button className="text-left text-xs font-semibold uppercase tracking-[.2em] text-[#c9cfdb]" key={link.path} onClick={() => navigate(link.path)}>{link.label}</button>)}<button className="text-left text-xs font-semibold uppercase tracking-[.2em] text-[#c9cfdb]" onClick={() => navigate('/account')}>Player account</button></div></div>}
    </header>
  );
}

function Button({ children, onClick, variant = 'primary', type = 'button' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'quiet'; type?: 'button' | 'submit' }) {
  const styles = variant === 'primary' ? 'bg-[#477bff] text-white hover:bg-[#5d8bff]' : variant === 'outline' ? 'border border-white/25 text-white hover:border-[#8eacff] hover:text-[#b8c8ff]' : 'text-[#aeb7c8] hover:text-white';
  return <button type={type} onClick={onClick} className={`group inline-flex min-h-12 items-center justify-center gap-3 px-5 text-[10px] font-bold uppercase tracking-[.18em] transition-all duration-300 ${styles}`}>{children}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></button>;
}

function StatusPill({ status }: { status: GameStatus }) {
  const color = status === 'Released' ? 'text-[#90d3ad] border-[#90d3ad]/30 bg-[#90d3ad]/10' : status === 'Upcoming' ? 'text-[#b8c8ff] border-[#477bff]/30 bg-[#477bff]/10' : 'text-[#d5b17b] border-[#d5b17b]/30 bg-[#d5b17b]/10';
  return <span className={`inline-flex border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.16em] ${color}`}>{status}</span>;
}

function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [newsletter, setNewsletter] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const featured = games.filter((game) => game.featured || game.status === 'Upcoming');
  const heroGame = featured[heroIndex % featured.length];
  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (newsletter.includes('@')) { localStorage.setItem('softpixel-newsletter', newsletter); setSubscribed(true); } };
  return <main>
    <section className="relative flex min-h-[720px] items-end overflow-hidden md:min-h-[850px]">
      <img src={heroGame.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#090b10_4%,rgba(9,11,16,.7)_42%,rgba(9,11,16,.06)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#090b10_0%,transparent_38%,rgba(9,11,16,.22)_100%)]" />
      <div className="container-shell relative z-10 pb-20 pt-36 md:pb-28">
        <div className="max-w-2xl fade-in" key={heroGame.slug}>
          <p className="eyebrow mb-5 flex items-center gap-3"><span className="h-px w-8 bg-[#477bff]" /> Featured world / 0{heroIndex + 1}</p>
          <h1 className="display-font max-w-[760px] text-6xl leading-[.92] tracking-[-.04em] text-white sm:text-8xl lg:text-[116px]">{heroGame.title}</h1>
          <p className="mt-6 max-w-md text-lg font-medium leading-relaxed text-[#e2e6ee]">{heroGame.tagline}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => go(`/games/${heroGame.slug}`)}>Explore game</Button><Button variant="outline" onClick={() => openDialog('hero-trailer')}><Play size={13} fill="currentColor" /> Watch trailer</Button></div>
        </div>
        <div className="mt-16 flex items-end justify-between gap-8"><div className="hidden max-w-xs text-sm leading-relaxed text-[#aeb7c8] md:block">We make games for the space between what you expect and what you remember.</div><div className="ml-auto flex items-center gap-3"><span className="eyebrow mr-2">Select a world</span>{featured.slice(0, 3).map((game, index) => <button key={game.slug} aria-label={`Show ${game.title}`} onClick={() => setHeroIndex(index)} className={`h-1 transition-all ${index === heroIndex ? 'w-14 bg-white' : 'w-7 bg-white/35 hover:bg-white/70'}`} />)}</div></div>
      </div>
      <dialog id="hero-trailer" className="w-[min(800px,calc(100%-32px))] border border-white/15 bg-[#10141d] p-0 text-white backdrop:bg-[#000]/80"><div className="relative aspect-video bg-[#171d28]"><button onClick={() => closeDialog('hero-trailer')} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center border border-white/20 bg-black/40"><X size={16} /></button><div className="grid h-full place-items-center"><div className="text-center"><CirclePlay size={42} className="mx-auto mb-4 text-[#8eacff]" /><p className="eyebrow">Demo trailer player</p><p className="mt-2 text-sm text-[#aeb7c8]">Video hosting will be connected in the backend phase.</p></div></div></div></dialog>
    </section>

    <section className="section-space border-b border-white/[.07] bg-[#0c0f16]"><div className="container-shell grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow mb-6">01 / The studio</p><h2 className="display-font text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl">Small team.<br /><span className="text-[#8c96aa]">Large worlds.</span></h2></div><div className="max-w-xl"><p className="text-xl leading-relaxed text-[#d8dde8]">Soft Pixel Studio is an independent game studio creating atmospheric worlds with a human pulse.</p><p className="mt-6 max-w-lg leading-relaxed text-[#8c96aa]">We care about the moments players carry with them after the screen goes dark: a choice, a place, a sound, a feeling. Every project starts there.</p><button className="mt-9 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8eacff]" onClick={() => go('/about')}>Our approach <ArrowDownRight size={15} /></button></div></div></section>

    <section className="section-space"><div className="container-shell"><SectionHeading index="02" title="Worlds in progress" action="View all games" onAction={() => go('/games')} /><div className="mt-12 grid gap-5 md:grid-cols-2">{games.slice(0, 2).map((game, index) => <LargeGameCard game={game} key={game.slug} featured={index === 0} />)}</div></div></section>

    <section className="border-y border-white/[.07] bg-[#0d1119] py-20"><div className="container-shell grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center"><div><p className="eyebrow mb-5">A note from the team</p><p className="display-font max-w-2xl text-4xl leading-tight text-[#e9ecf3] sm:text-5xl">“A game is a place you can visit, even when you’re nowhere near it.”</p></div><div className="md:pl-16"><div className="mb-5 flex gap-1">{[1,2,3,4,5].map((item) => <span key={item} className="h-1 w-8 bg-[#477bff]" />)}</div><p className="max-w-sm text-sm leading-relaxed text-[#aeb7c8]">Our games move between the intimate and the impossible. We build both with the same care.</p></div></div></section>

    <section className="section-space"><div className="container-shell"><SectionHeading index="03" title="From the journal" action="Read all updates" onAction={() => go('/news')} /><div className="mt-12 grid gap-6 md:grid-cols-3">{newsItems.map((item) => <article key={item.title} className="group cursor-pointer" onClick={() => go('/news')}><div className="aspect-[1.5] overflow-hidden bg-[#151a24]"><img src={item.image} alt="" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /></div><p className="eyebrow mt-5">{item.category}</p><h3 className="mt-3 text-lg font-semibold leading-snug text-[#e9ecf3] transition group-hover:text-[#8eacff]">{item.title}</h3><p className="mt-4 text-xs text-[#6f7a8e]">{item.date}</p></article>)}</div></div></section>

    <section className="border-t border-white/[.07] bg-[#0c0f16] py-20"><div className="container-shell grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center"><div><p className="eyebrow mb-5">Stay in the world</p><h2 className="display-font text-4xl text-white sm:text-5xl">A quiet signal<br />from the studio.</h2></div><div><p className="mb-6 max-w-md text-sm leading-relaxed text-[#8c96aa]">Occasional development notes, new worlds, and things we cannot keep to ourselves. No noise. Unsubscribe whenever you want.</p>{subscribed ? <div className="flex items-center gap-3 border border-[#90d3ad]/30 bg-[#90d3ad]/10 p-4 text-sm text-[#b8e5ca]"><Check size={17} /> You’re on the studio list. Demo signup confirmed.</div> : <form onSubmit={submitNewsletter} className="flex max-w-lg border border-white/15 bg-[#151a24] focus-within:border-[#477bff]"><input required type="email" value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#657085]" /><button className="bg-[#477bff] px-5 text-[10px] font-bold uppercase tracking-[.16em] hover:bg-[#5d8bff]" type="submit">Subscribe</button></form>}</div></div></section>
  </main>;
}

function SectionHeading({ index, title, action, onAction }: { index: string; title: string; action: string; onAction: () => void }) { return <div className="flex items-end justify-between gap-5"><div><p className="eyebrow mb-4">{index} / Soft Pixel Studio</p><h2 className="display-font text-4xl tracking-[-.025em] sm:text-6xl">{title}</h2></div><button onClick={onAction} className="hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#8eacff] sm:flex">{action}<ArrowRight size={15} /></button></div>; }

function LargeGameCard({ game, featured = false }: { game: Game; featured?: boolean }) { return <article className={`group relative min-h-[420px] cursor-pointer overflow-hidden bg-[#151a24] ${featured ? 'md:min-h-[550px]' : ''}`} onClick={() => go(`/games/${game.slug}`)}><img src={game.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/15 to-transparent" /><div className="absolute left-6 top-6"><StatusPill status={game.status} /></div><div className="absolute inset-x-0 bottom-0 p-6 md:p-8"><p className="eyebrow" style={{ color: game.accent }}>{game.genre.join(' · ')}</p><h3 className="display-font mt-3 text-4xl sm:text-5xl">{game.title}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-[#c4cad6]">{game.tagline}</p><span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-white">View game <ArrowUpRightIcon /></span></div></article>; }
function ArrowUpRightIcon() { return <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />; }

function GamesCatalog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | GameStatus>('All');
  const filtered = useMemo(() => games.filter((game) => (filter === 'All' || game.status === filter) && `${game.title} ${game.genre.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [filter, search]);
  return <main className="pt-[82px]"><section className="border-b border-white/[.07] bg-[#0c0f16] py-24"><div className="container-shell"><p className="eyebrow mb-5">The catalogue / 2026</p><h1 className="display-font max-w-3xl text-6xl leading-[.95] tracking-[-.04em] sm:text-8xl">Games that stay<br /><span className="text-[#8c96aa]">with you.</span></h1><p className="mt-8 max-w-lg text-base leading-relaxed text-[#aeb7c8]">Six projects, one studio. Explore the worlds we have released, and the ones still taking shape.</p></div></section><section className="section-space"><div className="container-shell"><div className="flex flex-col justify-between gap-5 border-b border-white/[.1] pb-6 md:flex-row md:items-center"><div className="flex flex-wrap gap-2">{(['All', 'Released', 'Upcoming', 'In Development', 'Early Access'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`border px-3 py-2 text-[9px] font-semibold uppercase tracking-[.13em] transition ${filter === item ? 'border-[#477bff] bg-[#477bff]/10 text-[#b8c8ff]' : 'border-white/10 text-[#7f899c] hover:border-white/30 hover:text-white'}`}>{item}</button>)}</div><label className="flex items-center gap-3 border border-white/10 bg-[#10141d] px-3 py-2 text-[#7f899c] focus-within:border-[#477bff]"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search worlds" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#657085] md:w-44" /></label></div>{filtered.length ? <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((game) => <CatalogCard game={game} key={game.slug} />)}</div> : <div className="grid min-h-[300px] place-items-center text-center"><Compass size={32} className="mb-4 text-[#477bff]" /><p className="text-lg">No worlds found</p><p className="mt-2 text-sm text-[#7f899c]">Try a different search or reset the filters.</p></div>}</div></section></main>;
}
function CatalogCard({ game }: { game: Game }) { return <article className="group cursor-pointer" onClick={() => go(`/games/${game.slug}`)}><div className="relative aspect-[1.25] overflow-hidden bg-[#151a24]"><img src={game.cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#090b10]/80 to-transparent" /><div className="absolute left-4 top-4"><StatusPill status={game.status} /></div><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between"><span className="eyebrow text-white/80">{game.price === 'Free' ? 'Free to play' : 'Sample paid title'}</span><span className="grid h-8 w-8 place-items-center border border-white/30 bg-black/20 transition group-hover:border-[#8eacff] group-hover:bg-[#477bff]"><ArrowUpRightIcon /></span></div></div><div className="pt-5"><div className="flex items-center justify-between gap-3"><h2 className="display-font text-3xl">{game.title}</h2><span className="text-[10px] text-[#7f899c]">{game.release}</span></div><p className="mt-3 text-sm leading-relaxed text-[#8c96aa]">{game.tagline}</p><div className="mt-4 flex gap-2 text-[9px] uppercase tracking-[.1em] text-[#6f7a8e]">{game.genre.map((genre) => <span key={genre}>{genre}</span>)}</div></div></article>; }

function GameDetail({ slug }: { slug: string }) {
  const game = getGame(slug);
  const [registered, setRegistered] = useState(() => localStorage.getItem(`softpixel-preregister-${slug}`) === 'true');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [message, setMessage] = useState('');
  if (!game) return <SimplePage route="/games" />;
  const submitRegistration = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (email && consent) { localStorage.setItem(`softpixel-preregister-${slug}`, 'true'); setRegistered(true); setMessage('You are on the list. This demo does not send a real email.'); } };
  return <main><section className="relative flex min-h-[660px] items-end overflow-hidden pt-[82px]"><img src={game.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" /><div className="absolute inset-0 bg-[linear-gradient(90deg,#090b10_5%,rgba(9,11,16,.6)_55%,rgba(9,11,16,.12)),linear-gradient(0deg,#090b10_0%,transparent_55%)]" /><div className="container-shell relative z-10 pb-20"><button onClick={() => go('/games')} className="mb-14 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#aeb7c8] hover:text-white"><ArrowLeft size={14} /> Back to games</button><div className="max-w-3xl"><StatusPill status={game.status} /><p className="eyebrow mt-7" style={{ color: game.accent }}>{game.eyebrow}</p><h1 className="display-font mt-4 text-7xl leading-[.9] tracking-[-.05em] sm:text-[112px]">{game.title}</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-[#e2e6ee]">{game.tagline}</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => document.getElementById('game-action')?.scrollIntoView({ behavior: 'smooth' })}>{game.status === 'Released' ? 'View download' : 'Pre-register'}</Button><Button variant="outline" onClick={() => openDialog('detail-trailer')}><Play size={13} fill="currentColor" /> Watch trailer</Button></div></div></div><div className="absolute bottom-7 right-8 hidden items-center gap-2 md:flex"><span className="eyebrow">{game.title} / {game.status}</span><span className="h-px w-12 bg-white/30" /></div><dialog id="detail-trailer" className="w-[min(800px,calc(100%-32px))] border border-white/15 bg-[#10141d] p-0 text-white backdrop:bg-[#000]/80"><div className="relative aspect-video"><button onClick={() => closeDialog('detail-trailer')} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center border border-white/20 bg-black/40"><X size={16} /></button><div className="grid h-full place-items-center"><div className="text-center"><CirclePlay size={42} className="mx-auto mb-4 text-[#8eacff]" /><p className="eyebrow">Demo trailer player</p><p className="mt-2 text-sm text-[#aeb7c8]">Video hosting will be connected in the backend phase.</p></div></div></div></dialog></section>
    <section className="section-space"><div className="container-shell grid gap-16 lg:grid-cols-[1.2fr_.8fr]"><div><p className="eyebrow mb-5">The premise</p><p className="max-w-2xl text-3xl leading-tight text-[#e2e6ee] sm:text-4xl">{game.description}</p><div className="mt-12 grid grid-cols-2 gap-x-7 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4">{[['Developer','Soft Pixel Studio'], ['Genre',game.genre.join(' · ')], ['Platforms',game.platforms.join(' · ')], ['Mode',game.mode]].map(([label, value]) => <div key={label}><p className="eyebrow">{label}</p><p className="mt-3 text-sm leading-relaxed text-[#d8dde8]">{value}</p></div>)}</div></div><div className="border-l border-white/10 pl-7 lg:pl-12"><p className="eyebrow mb-5">At a glance</p><ul className="space-y-4">{game.features.map((feature, index) => <li key={feature} className="flex items-center gap-4 border-b border-white/[.08] pb-4 text-sm text-[#d8dde8]"><span className="mono text-[10px] text-[#477bff]">0{index + 1}</span>{feature}</li>)}</ul></div></div></section>
    <section className="border-y border-white/[.07] bg-[#0c0f16] py-20"><div className="container-shell"><div className="mb-10 flex items-end justify-between"><div><p className="eyebrow mb-4">Field notes / gallery</p><h2 className="display-font text-4xl sm:text-5xl">Inside the world</h2></div><div className="flex gap-2"><button onClick={() => setGalleryIndex((index) => (index - 1 + game.gallery.length) % game.gallery.length)} className="grid h-10 w-10 place-items-center border border-white/15 hover:border-[#477bff]"><ArrowLeft size={15} /></button><button onClick={() => setGalleryIndex((index) => (index + 1) % game.gallery.length)} className="grid h-10 w-10 place-items-center border border-white/15 hover:border-[#477bff]"><ArrowRight size={15} /></button></div></div><div className="grid gap-4 md:grid-cols-[1.5fr_.5fr]"><div className="aspect-[1.8] overflow-hidden"><img src={game.gallery[galleryIndex]} alt={`${game.title} gallery`} className="h-full w-full object-cover" /></div><div className="grid grid-cols-2 gap-4 md:grid-cols-1">{game.gallery.map((image, index) => <button key={image} onClick={() => setGalleryIndex(index)} className={`overflow-hidden border ${index === galleryIndex ? 'border-[#477bff]' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={image} alt="" className="h-full min-h-[90px] w-full object-cover" /></button>)}</div></div></div></section>
    <section id="game-action" className="section-space"><div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow mb-5">Your next step</p><h2 className="display-font text-5xl leading-none sm:text-6xl">{game.status === 'Released' ? 'Enter the house.' : 'Stay close.'}</h2><p className="mt-6 max-w-sm text-sm leading-relaxed text-[#8c96aa]">{game.note}</p></div><div className="border border-white/10 bg-[#10141d] p-6 sm:p-9">{game.status === 'Released' ? <div><p className="eyebrow mb-5">Available now / demo access</p><h3 className="text-2xl font-semibold">Download {game.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#8c96aa]">Choose a platform to preview the download flow. No file is hosted in this frontend demo.</p><div className="mt-8 flex flex-wrap gap-3">{game.platforms.map((platform) => <button key={platform} onClick={() => setMessage(`${platform} download access is ready for backend connection.`)} className="border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[.14em] hover:border-[#477bff]">{platform}</button>)}</div>{message && <p className="mt-5 flex items-center gap-2 text-sm text-[#b8e5ca]"><Check size={15} /> {message}</p>}</div> : registered ? <div className="py-5"><div className="mb-5 grid h-12 w-12 place-items-center border border-[#90d3ad]/30 bg-[#90d3ad]/10 text-[#90d3ad]"><Check size={20} /></div><p className="eyebrow">Registration confirmed</p><h3 className="mt-3 text-2xl font-semibold">You’re on the list.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-[#8c96aa]">{message || 'This game has been added to your local player profile. No real email was sent.'}</p></div> : <form onSubmit={submitRegistration}><p className="eyebrow mb-5">Early signal / pre-registration</p><h3 className="text-2xl font-semibold">Be first through the door.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-[#8c96aa]">Register your interest for {game.title}. We will use this local demo to prepare your player account.</p><div className="mt-7 flex border border-white/15 bg-[#151a24] focus-within:border-[#477bff]"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[#657085]" /><button type="submit" className="bg-[#477bff] px-4 text-[10px] font-bold uppercase tracking-[.15em] hover:bg-[#5d8bff]">Register</button></div><label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-[#8c96aa]"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-[#477bff]" /> I agree to receive demo updates about this project.</label></form>}</div></div></section>
    <section className="border-t border-white/[.07] py-20"><div className="container-shell"><p className="eyebrow mb-10">Continue exploring</p><div className="grid gap-5 sm:grid-cols-3">{games.filter((item) => item.slug !== game.slug).slice(0, 3).map((item) => <CatalogCard key={item.slug} game={item} />)}</div></div></section>
  </main>;
}

function SimplePage({ route }: { route: string }) { const title = route === '/about' ? 'The studio' : route === '/news' ? 'The journal' : route === '/community' ? 'Find your way in' : route === '/account' ? 'Player account' : 'A new page is taking shape'; const description = route === '/about' ? 'Soft Pixel Studio is an independent team building games with atmosphere, intention, and a little mystery.' : route === '/news' ? 'Development notes and stories from the worlds we are making.' : route === '/community' ? 'Community links are placeholder destinations in this frontend-only demo.' : 'This part of the studio experience is prepared for the next build milestone.'; return <main className="grid min-h-[72vh] place-items-center px-6 pt-[82px]"><div className="max-w-xl text-center"><Sparkles className="mx-auto mb-7 text-[#477bff]" size={30} /><p className="eyebrow mb-5">Soft Pixel Studio / {route.replace('/', '') || 'home'}</p><h1 className="display-font text-6xl leading-none sm:text-8xl">{title}</h1><p className="mt-7 text-base leading-relaxed text-[#8c96aa]">{description}</p><Button onClick={() => go('/games')}><Gamepad2 size={14} /> Explore games</Button></div></main>; }

function Footer() { return <footer className="border-t border-white/[.08] bg-[#090b10] py-12"><div className="container-shell"><div className="flex flex-col justify-between gap-10 md:flex-row"><div><button onClick={() => go('/')} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center border border-[#477bff]/70 text-[#8eacff]">S</span><span className="text-[12px] font-bold tracking-[.2em]">SOFT PIXEL</span></button><p className="mt-5 max-w-xs text-xs leading-relaxed text-[#6f7a8e]">Independent games for curious people. Sample studio site with editable demo content.</p></div><div className="grid grid-cols-2 gap-x-14 gap-y-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#8c96aa]"><button className="text-left hover:text-white" onClick={() => go('/games')}>Games</button><button className="text-left hover:text-white" onClick={() => go('/about')}>Studio</button><button className="text-left hover:text-white" onClick={() => go('/support')}>Support</button><button className="text-left hover:text-white" onClick={() => go('/privacy')}>Privacy</button></div><div className="flex items-start gap-3 text-[#7f899c]"><a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={16} /></a><a href="https://www.youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer"><Youtube size={16} /></a><a href="https://www.twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><Twitter size={16} /></a></div></div><div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/[.07] pt-5 text-[9px] uppercase tracking-[.14em] text-[#596476] sm:flex-row"><span>© 2026 Soft Pixel Studio / Sample content</span><span>Built for the worlds ahead</span></div></div></footer>; }

export default App;
