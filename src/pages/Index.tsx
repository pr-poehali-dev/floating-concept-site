import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/6504d41f-afa4-4861-8d4f-a6152fbab810/files/262845e0-af68-4174-bace-d4ba5751d1a9.jpg";
const ABOUT_IMG = "https://cdn.poehali.dev/projects/6504d41f-afa4-4861-8d4f-a6152fbab810/files/eb612795-c29f-4b11-b8eb-74fe1085fe72.jpg";
const PROD_IMG = "https://cdn.poehali.dev/projects/6504d41f-afa4-4861-8d4f-a6152fbab810/files/28fca2a4-da7b-43e2-8452-bec626d8a7b2.jpg";

const products = [
  { id: 1, name: "Керамическая ваза", price: "3 200 ₽", category: "Декор", img: PROD_IMG },
  { id: 2, name: "Аромасвеча", price: "1 800 ₽", category: "Аромат", img: HERO_IMG },
  { id: 3, name: "Льняной плед", price: "5 400 ₽", category: "Текстиль", img: ABOUT_IMG },
  { id: 4, name: "Деревянный поднос", price: "2 600 ₽", category: "Декор", img: PROD_IMG },
  { id: 5, name: "Стеклянный графин", price: "4 100 ₽", category: "Кухня", img: HERO_IMG },
  { id: 6, name: "Хлопковый халат", price: "6 800 ₽", category: "Текстиль", img: ABOUT_IMG },
];

const categories = ["Все", "Декор", "Аромат", "Текстиль", "Кухня"];

type Page = "home" | "catalog" | "about";

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = activeCategory === "Все"
    ? products
    : products.filter(p => p.category === activeCategory);

  const nav = (p: Page) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-background font-golos text-foreground">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => nav("home")}
            className="font-cormorant text-2xl font-light tracking-[0.15em] hover:opacity-70 transition-opacity"
          >
            MAISON
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {(["home", "catalog", "about"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => nav(p)}
                className={`text-sm tracking-widest uppercase transition-all duration-300 ${
                  page === p
                    ? "text-foreground border-b border-foreground pb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "home" ? "Главная" : p === "catalog" ? "Каталог" : "О нас"}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 hover:opacity-70 transition-opacity"
              onClick={() => alert("Корзина — функция будет настроена")}
            >
              <Icon name="ShoppingBag" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-6 flex flex-col gap-5 animate-fade-in">
            {(["home", "catalog", "about"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => nav(p)}
                className="text-left text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {p === "home" ? "Главная" : p === "catalog" ? "Каталог" : "О нас"}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* ===== HOME PAGE ===== */}
        {page === "home" && (
          <>
            <section className="relative h-[90vh] overflow-hidden">
              <img
                src={HERO_IMG}
                alt="Hero"
                className="w-full h-full object-cover animate-fade-in-slow"
              />
              <div className="absolute inset-0 bg-foreground/25" />
              <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-20">
                <div className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
                  <p className="text-background/80 text-xs tracking-[0.3em] uppercase mb-4">
                    Новая коллекция 2026
                  </p>
                  <h1 className="font-cormorant text-5xl md:text-7xl font-light text-background leading-[1.1] mb-8 max-w-xl">
                    Красота<br /><em>в деталях</em>
                  </h1>
                  <button
                    onClick={() => nav("catalog")}
                    className="bg-background text-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-background/90 transition-all duration-300"
                  >
                    Смотреть каталог
                  </button>
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: "Package", title: "Ручная работа", text: "Каждый предмет создан мастерами с вниманием к деталям" },
                { icon: "Truck", title: "Доставка по России", text: "Бережная упаковка и доставка в любой город" },
                { icon: "RotateCcw", title: "Возврат 30 дней", text: "Если что-то не подошло — вернём без лишних вопросов" },
              ].map((f) => (
                <div key={f.title} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-border">
                    <Icon name={f.icon} size={20} />
                  </div>
                  <h3 className="font-cormorant text-xl font-medium mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                </div>
              ))}
            </section>

            <div className="max-w-6xl mx-auto px-6">
              <div className="border-t border-border" />
            </div>

            <section className="max-w-6xl mx-auto px-6 py-24">
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Избранное</p>
                  <h2 className="font-cormorant text-4xl md:text-5xl font-light">
                    Популярные<br /><em>товары</em>
                  </h2>
                </div>
                <button
                  onClick={() => nav("catalog")}
                  className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Все товары <Icon name="ArrowRight" size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.slice(0, 3).map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={i * 0.1}
                    onAdd={() => setCartCount(c => c + 1)}
                  />
                ))}
              </div>

              <div className="mt-10 md:hidden text-center">
                <button
                  onClick={() => nav("catalog")}
                  className="text-sm tracking-widest uppercase border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  Все товары
                </button>
              </div>
            </section>

            <section className="bg-foreground text-background py-24 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Специальное предложение</p>
                <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-6">
                  Скидка 15%<br /><em>на первый заказ</em>
                </h2>
                <p className="text-background/60 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                  Подпишитесь на рассылку и получите промокод на скидку для первой покупки
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-1 bg-transparent border border-background/30 text-background placeholder:text-background/40 px-5 py-3 text-sm focus:outline-none focus:border-background/70 transition-colors"
                  />
                  <button className="bg-background text-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-background/90 transition-all whitespace-nowrap">
                    Подписаться
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ===== CATALOG PAGE ===== */}
        {page === "catalog" && (
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Наши товары</p>
              <h1 className="font-cormorant text-5xl md:text-6xl font-light">Каталог</h1>
            </div>

            <div className="flex gap-2 flex-wrap mb-12 border-b border-border pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={i * 0.05}
                  onAdd={() => setCartCount(c => c + 1)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center text-muted-foreground">
                <p className="font-cormorant text-3xl mb-2">Нет товаров</p>
                <p className="text-sm">В данной категории пока пусто</p>
              </div>
            )}
          </section>
        )}

        {/* ===== ABOUT PAGE ===== */}
        {page === "about" && (
          <>
            <section className="max-w-6xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Наша история</p>
                  <h1 className="font-cormorant text-5xl md:text-6xl font-light leading-tight mb-8">
                    О<br /><em>магазине</em>
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Мы создаём пространство, где каждая вещь — это история. С 2018 года мы отбираем предметы,
                    которые делают повседневную жизнь чуть красивее и осмысленнее.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-10">
                    Наши партнёры — мастера и небольшие мастерские со всей России, которые создают
                    предметы с душой и вниманием к каждой детали.
                  </p>
                  <button
                    onClick={() => nav("catalog")}
                    className="border border-foreground text-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    Перейти в каталог
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={ABOUT_IMG}
                    alt="О магазине"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-background border border-border p-6 hidden md:block">
                    <p className="font-cormorant text-4xl font-light">8</p>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">лет на рынке</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 mt-16">
              <div className="border-t border-border" />
            </div>

            <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { num: "500+", label: "Товаров в каталоге" },
                { num: "12 000", label: "Довольных покупателей" },
                { num: "47", label: "Мастеров-партнёров" },
                { num: "98%", label: "Положительных отзывов" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-cormorant text-4xl md:text-5xl font-light mb-2">{s.num}</p>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">{s.label}</p>
                </div>
              ))}
            </section>

            <div className="max-w-6xl mx-auto px-6">
              <div className="border-t border-border" />
            </div>

            <section className="max-w-6xl mx-auto px-6 py-24">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">Наши ценности</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { title: "Качество", text: "Каждый товар проходит личную проверку перед появлением в каталоге. Только то, что понравилось нам самим." },
                  { title: "Устойчивость", text: "Работаем с производителями, которые используют экологичные материалы и заботятся о природе." },
                  { title: "Сообщество", text: "Мы строим не просто магазин, а сообщество людей с похожим взглядом на красоту и стиль жизни." },
                ].map((v) => (
                  <div key={v.title}>
                    <h3 className="font-cormorant text-2xl font-medium mb-4">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="border-t border-border bg-background">
          <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <p className="font-cormorant text-2xl tracking-[0.15em] mb-4">MAISON</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Предметы для дома с историей. Каждая вещь выбрана вручную.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-5">Навигация</p>
              <div className="flex flex-col gap-3">
                {(["home", "catalog", "about"] as Page[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => nav(p)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {p === "home" ? "Главная" : p === "catalog" ? "Каталог" : "О нас"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-5">Контакты</p>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">hello@maison.ru</p>
                <p className="text-sm text-muted-foreground">+7 (999) 000-00-00</p>
                <div className="flex gap-3 mt-2">
                  <button className="w-8 h-8 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300">
                    <Icon name="Instagram" size={14} />
                  </button>
                  <button className="w-8 h-8 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300">
                    <Icon name="Send" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 py-5 border-t border-border">
            <p className="text-xs text-muted-foreground">© 2026 MAISON. Все права защищены.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function ProductCard({
  product,
  delay,
  onAdd,
}: {
  product: { id: number; name: string; price: string; category: string; img: string };
  delay: number;
  onAdd: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group animate-fade-in"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square bg-secondary mb-4">
        <img
          src={product.img}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />
        <button
          onClick={handleAdd}
          className={`absolute bottom-0 left-0 right-0 py-3.5 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
            added
              ? "bg-foreground text-background translate-y-0"
              : hovered
              ? "bg-background text-foreground translate-y-0"
              : "translate-y-full bg-background text-foreground"
          }`}
        >
          {added ? "Добавлено ✓" : "В корзину"}
        </button>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">{product.category}</p>
          <h3 className="font-cormorant text-lg font-medium">{product.name}</h3>
        </div>
        <p className="font-golos text-sm font-medium mt-5">{product.price}</p>
      </div>
    </div>
  );
}