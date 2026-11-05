import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import './index.css';

type Language = 'en' | 'fr' | 'ar';

const games = [
  {
    id: 1,
    name: 'Grand Theft Auto V',
    price: 149,
    category: 'ACTION',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  },
  {
    id: 2,
    name: 'Red Dead Redemption 2',
    price: 199,
    category: 'ADVENTURE',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',
  },
  {
    id: 3,
    name: 'Cyberpunk 2077',
    price: 179,
    category: 'RPG',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
  },
  {
    id: 4,
    name: 'Elden Ring',
    price: 249,
    category: 'ACTION',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg',
  },
  {
    id: 5,
    name: 'Hogwarts Legacy',
    price: 199,
    category: 'ADVENTURE',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg',
  },
  {
    id: 6,
    name: 'Forza Horizon 5',
    price: 229,
    category: 'RACING',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg',
  },
];

const words = {
  en: {
    home: 'Home',
    games: 'Games',
    cart: 'My Cart',
    login: 'Login',
    register: 'Create Account',
    logout: 'Logout',
    hero: 'YOUR GAMING DESTINATION',
    title1: 'PLAY MORE.',
    title2: 'PAY LESS.',
    subtitle: 'Discover amazing PC games and start your next adventure.',
    explore: 'EXPLORE GAMES',
    trending: 'Trending Games',
    search: 'Search your game...',
    all: 'ALL',
    action: 'ACTION',
    adventure: 'ADVENTURE',
    rpg: 'RPG',
    racing: 'RACING',
    details: 'View Details',
    add: '+ Add',
    empty: 'Your cart is empty.',
    remove: 'Remove',
    total: 'Total',
    checkout: 'Checkout',
    name: 'Full name',
    email: 'Email address',
    password: 'Password',
    welcome: 'Welcome',
    account: 'My Account',
    close: 'Close',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    wait: 'Please wait...',
    footer: 'Your next adventure starts here.',
  },
  fr: {
    home: 'Accueil',
    games: 'Jeux',
    cart: 'Mon panier',
    login: 'Connexion',
    register: 'Créer un compte',
    logout: 'Déconnexion',
    hero: 'VOTRE UNIVERS GAMING',
    title1: 'JOUEZ PLUS.',
    title2: 'PAYEZ MOINS.',
    subtitle: 'Découvrez les meilleurs jeux PC.',
    explore: 'DÉCOUVRIR',
    trending: 'Jeux populaires',
    search: 'Rechercher...',
    all: 'TOUS',
    action: 'ACTION',
    adventure: 'AVENTURE',
    rpg: 'RPG',
    racing: 'COURSE',
    details: 'Détails',
    add: '+ Ajouter',
    empty: 'Votre panier est vide.',
    remove: 'Supprimer',
    total: 'Total',
    checkout: 'Commander',
    name: 'Nom complet',
    email: 'E-mail',
    password: 'Mot de passe',
    welcome: 'Bienvenue',
    account: 'Mon compte',
    close: 'Fermer',
    noAccount: 'Pas encore de compte ?',
    haveAccount: 'Déjà un compte ?',
    wait: 'Patientez...',
    footer: 'Votre prochaine aventure commence ici.',
  },
  ar: {
    home: 'الرئيسية',
    games: 'الألعاب',
    cart: 'سلتي',
    login: 'دخول',
    register: 'إنشاء حساب',
    logout: 'خروج',
    hero: 'عالم الألعاب بين يديك',
    title1: 'العب أكثر.',
    title2: 'ادفع أقل.',
    subtitle: 'اكتشف أفضل ألعاب الكمبيوتر.',
    explore: 'اكتشف الألعاب',
    trending: 'الألعاب الشائعة',
    search: 'ابحث عن لعبة...',
    all: 'الكل',
    action: 'أكشن',
    adventure: 'مغامرات',
    rpg: 'تمثيل الأدوار',
    racing: 'سباق',
    details: 'التفاصيل',
    add: '+ أضف',
    empty: 'سلتك فارغة.',
    remove: 'حذف',
    total: 'المجموع',
    checkout: 'إتمام الطلب',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    welcome: 'مرحباً',
    account: 'حسابي',
    close: 'إغلاق',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    wait: 'يرجى الانتظار...',
    footer: 'مغامرتك القادمة تبدأ من هنا.',
  },
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [cart, setCart] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const t = words[language];
  const rtl = language === 'ar';

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const filtered = games.filter(
    (game) =>
      game.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'ALL' || game.category === category)
  );

  const total = cart.reduce(
    (sum, id) => sum + (games.find((g) => g.id === id)?.price ?? 0),
    0
  );
  const chosen = games.find((g) => g.id === selected);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        alert('Account created. Check your email if confirmation is enabled.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
      setAuthOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  }

  return (
    <div className="app" dir={rtl ? 'rtl' : 'ltr'}>
      <header className="navbar">
        <a className="logo" href="#">
          GAMEZONE<span>.</span>
        </a>
        <nav>
          <a href="#">{t.home}</a>
          <a href="#games">{t.games}</a>
          <a href="#cart">{t.cart}</a>
        </nav>
        <div className="nav-actions">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">🇬🇧 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="ar">🇲🇦 AR</option>
          </select>
          <a className="cart" href="#cart">
            🛒 {t.cart} <b>{cart.length}</b>
          </a>
          {user ? (
            <button className="account-button" onClick={logout}>
              {t.logout}
            </button>
          ) : (
            <button
              className="account-button"
              onClick={() => {
                setMode('login');
                setAuthOpen(true);
                setError('');
              }}
            >
              {t.login}
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="tag">{t.hero}</p>
          <h1>
            {t.title1}
            <br />
            <span>{t.title2}</span>
          </h1>
          <p className="description">{t.subtitle}</p>
          <a className="hero-button" href="#games">
            {t.explore} ↗
          </a>
        </div>
      </section>

      <main id="games">
        <div className="section-title">
          <div>
            <p className="tag">HANDPICKED FOR YOU</p>
            <h2>{t.trending}</h2>
          </div>
          <input
            type="search"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          {['ALL', 'ACTION', 'ADVENTURE', 'RPG', 'RACING'].map((value) => (
            <button
              key={value}
              className={category === value ? 'filter active' : 'filter'}
              onClick={() => setCategory(value)}
            >
              {t[value.toLowerCase() as keyof typeof t] ?? value}
            </button>
          ))}
        </div>

        <div className="games">
          {filtered.map((game) => (
            <article className="game" key={game.id}>
              <div className="cover" onClick={() => setSelected(game.id)}>
                <img src={game.image} alt={game.name} />
              </div>
              <div className="game-info">
                <span className="category">{game.category}</span>
                <h3>{game.name}</h3>
                <button
                  className="details-button"
                  onClick={() => setSelected(game.id)}
                >
                  {t.details}
                </button>
                <div className="bottom">
                  <strong>{game.price} DH</strong>
                  <button onClick={() => setCart((old) => [...old, game.id])}>
                    {t.add}
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p>No games found.</p>}
        </div>

        <section className="cart-section" id="cart">
          <div className="cart-heading">
            <div>
              <p className="tag">YOUR SHOPPING CART</p>
              <h2>
                {t.cart} ({cart.length})
              </h2>
            </div>
            <strong className="total-price">{total} DH</strong>
          </div>
          {cart.length === 0 ? (
            <p className="empty-cart">{t.empty}</p>
          ) : (
            cart.map((id, index) => {
              const game = games.find((g) => g.id === id);
              if (!game) return null;
              return (
                <div className="cart-item" key={`${id}-${index}`}>
                  <img src={game.image} alt={game.name} />
                  <div className="cart-item-info">
                    <h3>{game.name}</h3>
                    <span>{game.price} DH</span>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() =>
                      setCart((old) => old.filter((_, i) => i !== index))
                    }
                  >
                    {t.remove}
                  </button>
                </div>
              );
            })
          )}
          <div className="cart-footer">
            <span>
              {t.total}: <strong>{total} DH</strong>
            </span>
            <button
              disabled={!cart.length}
              onClick={() => alert('Checkout coming soon!')}
            >
              {t.checkout} →
            </button>
          </div>
        </section>
      </main>

      {chosen && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelected(null)}>
              ×
            </button>
            <img src={chosen.image} alt={chosen.name} />
            <span className="category">{chosen.category}</span>
            <h2>{chosen.name}</h2>
            <p>{chosen.price} DH</p>
            <button onClick={() => setCart((old) => [...old, chosen.id])}>
              {t.add}
            </button>
          </div>
        </div>
      )}

      {authOpen && (
        <div
          className="modal-overlay"
          onClick={() => !loading && setAuthOpen(false)}
        >
          <div
            className="game-modal auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => !loading && setAuthOpen(false)}
            >
              ×
            </button>
            <div className="auth-heading">
              <h2>
                GAMEZONE<span>.</span>
              </h2>
              <p>{mode === 'login' ? t.login : t.register}</p>
            </div>
            <form className="auth-form" onSubmit={handleAuth}>
              {mode === 'register' && (
                <label>
                  {t.name}
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </label>
              )}
              <label>
                {t.email}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                {t.password}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? t.wait : mode === 'login' ? t.login : t.register}
              </button>
            </form>
            <p className="auth-switch">
              {mode === 'login' ? t.noAccount : t.haveAccount}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
              >
                {mode === 'login' ? t.register : t.login}
              </button>
            </p>
          </div>
        </div>
      )}

      <footer>
        <h2>
          GAMEZONE<span>.</span>
        </h2>
        <p>{t.footer}</p>
        <small>© 2026 GAMEZONE STORE. All rights reserved.</small>
      </footer>
    </div>
  );
}
