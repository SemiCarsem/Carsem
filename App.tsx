import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Cable,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock3,
  CreditCard,
  Headphones,
  Lock,
  LogIn,
  Minus,
  Navigation,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Usb,
  Wifi,
  X,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase, supabaseConfigured } from "./lib/supabase";

type OfferId = "solo" | "duo";

const offers: Record<OfferId, {
  name: string;
  label: string;
  description: string;
  price: number;
  compareAt: number;
  badge?: string;
  includes: string[];
}> = {
  solo: {
    name: "CarSem Link",
    label: "1 adaptateur",
    description: "Pour une voiture déjà compatible CarPlay ou Android Auto filaire.",
    price: 39.9,
    compareAt: 69.9,
    includes: ["Adaptateur sans-fil", "USB-A intégré", "Guide de connexion rapide", "Support email 7j/7"]
  },
  duo: {
    name: "Pack Duo CarSem Link",
    label: "2 adaptateurs",
    description: "Pour équiper deux voitures ou offrir un second adaptateur.",
    price: 69.9,
    compareAt: 139.8,
    badge: "Économisez 50%",
    includes: ["2 adaptateurs sans-fil", "Livraison offerte", "Garantie 2 ans", "Support prioritaire", "Idéal couple ou second véhicule"]
  }
};

const benefits = [
  ["Plus aucun câble à brancher", "Montez dans votre voiture, démarrez, votre téléphone se connecte tout seul.", Wifi],
  ["Votre écran d’origine reste intact", "Vous gardez le système OEM de la voiture, sans démontage ni modification.", Car],
  ["Trajets plus fluides", "Maps, appels, musique et messages reviennent automatiquement à chaque conduite.", Navigation],
  ["Installation en moins d’une minute", "Branchez l’adaptateur sur le port USB CarPlay/Android Auto, puis appairez votre téléphone.", Clock3]
];

const fitChecks = [
  "Votre voiture possède déjà CarPlay ou Android Auto filaire d’origine",
  "Vous branchez aujourd’hui votre téléphone avec un câble USB pour l’utiliser",
  "Vous voulez garder l’écran d’origine du véhicule",
  "Vous utilisez un iPhone ou un smartphone Android compatible"
];

const reviews = [
  ["Sarah L.", "Mercedes Classe A", "Je monte dans la voiture et tout se connecte sans réfléchir. C’est exactement le confort qui manquait."],
  ["Yanis T.", "Volkswagen Golf", "Petit boîtier, gros changement. Je ne supportais plus le câble qui traînait partout."],
  ["Alex M.", "BMW Série 3", "Je voulais garder l’écran d’origine. L’adaptateur rend l’expérience beaucoup plus moderne."]
];

const faqs = [
  ["Est-ce compatible avec toutes les voitures ?", "Non. Il faut que votre véhicule dispose déjà de CarPlay ou Android Auto filaire d’origine. L’adaptateur transforme ce filaire en sans-fil, il n’ajoute pas CarPlay à une voiture qui ne l’a pas."],
  ["Est-ce que cela fonctionne avec iPhone et Android ?", "Oui, le positionnement produit couvre iPhone et Android, à condition que le véhicule et le téléphone soient déjà compatibles CarPlay ou Android Auto filaire."],
  ["Dois-je installer une application ?", "Non. Vous branchez l’adaptateur sur le port USB de la voiture, vous l’appairez une première fois, puis la connexion devient automatique."],
  ["Y a-t-il une latence ?", "Comme tout adaptateur sans-fil, une légère latence peut exister au démarrage ou sur certaines commandes. Pour la navigation, la musique et les appels, l’usage quotidien reste fluide."],
  ["Quels délais annoncer en dropshipping ?", "Annonce 7 à 12 jours ouvrés avec suivi si ton client commande depuis AliExpress. Évite les promesses 48h sans stock local."]
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

function Rating() {
  return (
    <div className="rating" aria-label="4,8 sur 5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={16} fill="currentColor" />
      ))}
      <span>4,8/5 · 1 200+ conducteurs</span>
    </div>
  );
}

type AdminTab = "dashboard" | "orders" | "products" | "stock" | "customers";

const adminMenu: { id: AdminTab; label: string; number: string }[] = [
  { id: "dashboard", label: "Dashboard", number: "01" },
  { id: "orders", label: "Commandes", number: "02" },
  { id: "products", label: "Produits", number: "03" },
  { id: "stock", label: "Stocks", number: "04" },
  { id: "customers", label: "Clients", number: "05" }
];

const adminOrders = [
  { id: "#CS-1048", customer: "Sarah L.", product: "1 adaptateur", amount: "39,90 €", status: "Payée", date: "17/07" },
  { id: "#CS-1047", customer: "Yanis T.", product: "2 adaptateurs", amount: "69,90 €", status: "À préparer", date: "17/07" },
  { id: "#CS-1046", customer: "Alex M.", product: "1 adaptateur", amount: "39,90 €", status: "Expédiée", date: "16/07" }
];

const adminStats = [
  ["CA aujourd’hui", "149,70 €", "+18%"],
  ["Commandes", "3", "2 à préparer"],
  ["Stock restant", "42", "Alerte à 15"],
  ["Taux conversion", "3,8%", "+0,6%"]
];

const adminDemoCredentials = {
  email: "client@carsem.fr",
  password: "carsem2026"
};

function AdminPage({ onBack }: { onBack: () => void | Promise<void> }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/assets/auryn/carsem-logo-mark.png" alt="" />
          <span>CarSem Admin</span>
        </div>
        <nav aria-label="Navigation admin">
          {adminMenu.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              type="button"
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.label}</span>
              <strong>{item.number}</strong>
            </button>
          ))}
          <button type="button" onClick={onBack}>
            <span>Boutique</span>
            <strong>EXT</strong>
          </button>
        </nav>
        <button className="admin-logout" type="button" onClick={onBack}>
          <span>Déconnexion</span>
          <strong>X</strong>
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Espace client</p>
            <h1>{adminMenu.find((item) => item.id === activeTab)?.label}</h1>
          </div>
          <button type="button" onClick={onBack}>Voir la boutique</button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="admin-stats">
              {adminStats.map(([label, value, detail]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
            <div className="admin-grid">
              <div className="admin-panel">
                <h2>Commandes récentes</h2>
                <AdminOrdersTable />
              </div>
              <div className="admin-panel">
                <h2>Stock rapide</h2>
                <div className="stock-card">
                  <span>CarSem Link</span>
                  <strong>42 unités</strong>
                  <p>Prochaine commande fournisseur conseillée sous 7 jours.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <OrdersAdminPage />
        )}

        {activeTab === "products" && (
          <ProductsAdminPage />
        )}

        {activeTab === "stock" && (
          <StocksAdminPage />
        )}

        {activeTab === "customers" && (
          <CustomersAdminPage />
        )}

      </section>
    </main>
  );
}

function AdminOrdersTable() {
  return (
    <div className="admin-table">
      {adminOrders.map((order) => (
        <div key={order.id}>
          <span>{order.id}</span>
          <strong>{order.customer}</strong>
          <em>{order.product}</em>
          <b>{order.amount}</b>
          <i>{order.status}</i>
          <small>{order.date}</small>
        </div>
      ))}
    </div>
  );
}

function StocksAdminPage() {
  const demoProducts = [
    {
      key: "link" as const,
      name: "CarSem Link",
      id: "CS-LINK-001",
      image: "/assets/auryn/wireless-adapter-real-product.png",
      collection: "Adaptateurs",
      quantity: 42
    },
    {
      key: "duo" as const,
      name: "Pack Duo CarSem Link",
      id: "CS-DUO-002",
      image: "/assets/auryn/wireless-adapter-hero.png",
      collection: "Packs",
      quantity: 18
    }
  ];
  const [products, setProducts] = useState(demoProducts);
  const [quantities, setQuantities] = useState({ link: 42, duo: 18 });

  useEffect(() => {
    if (!supabase) return;
    supabase.from("products").select("id,sku,name,collection,image_url,stock").order("created_at", { ascending: true }).then(({ data }) => {
      if (data?.length) {
        const liveProducts = data.map((product, index) => ({
          key: (index === 0 ? "link" : "duo") as "link" | "duo",
          name: product.name,
          id: product.sku,
          image: product.image_url || "/assets/auryn/wireless-adapter-real-product.png",
          collection: product.collection,
          quantity: product.stock
        }));
        setProducts(liveProducts);
        setQuantities(Object.fromEntries(liveProducts.map((product) => [product.key, product.quantity])) as { link: number; duo: number });
      }
    });
  }, []);

  const totalStock = products.reduce((total, product) => total + product.quantity, 0);

  return (
    <div className="stock-page">
      <div className="stock-actions">
        <span>Synchronisé il y a quelques secondes</span>
      </div>

      <div className="stock-metrics">
        <article><span>Produits suivis</span><strong>{products.length}</strong></article>
        <article><span>Stock total</span><strong>{totalStock}</strong></article>
        <article><span>Stock faible</span><strong>0</strong></article>
        <article><span>Ruptures</span><strong>0</strong></article>
      </div>

      <section className="stock-table-panel">
        <div className="stock-table-heading">
          <div>
            <p className="eyebrow">Inventaire CarSem</p>
            <h2>Modifier les quantités</h2>
          </div>
          <strong>Les stocks sont synchronisés avec la boutique.</strong>
        </div>
        <div className="stock-table">
          <div className="stock-table-head">
            <span>Produit</span>
            <span>Collection</span>
            <span>Stock actuel</span>
            <span>Modifier</span>
            <span>État</span>
            <span>Page</span>
          </div>
          {products.map((product) => (
            <article key={product.key}>
              <div className="stock-product-cell">
                <img src={product.image} alt="" />
                <span><strong>{product.name}</strong><small>{product.id}</small></span>
              </div>
              <strong>{product.collection}</strong>
              <strong>{product.quantity} pièces</strong>
              <input
                aria-label={`Modifier le stock de ${product.name}`}
                type="number"
                min="0"
                value={product.quantity}
                onChange={(event) => {
                  const value = Math.max(0, Number(event.target.value));
                  setQuantities((current) => ({ ...current, [product.key]: value }));
                  setProducts((current) => current.map((item) => item.key === product.key ? { ...item, quantity: value } : item));
                  if (supabase) {
                    supabase.from("products").update({ stock: value }).eq("sku", product.id).then();
                  }
                }}
              />
              <em className={product.quantity > 0 ? "available" : "empty"}>
                {product.quantity > 0 ? "Disponible" : "Rupture"}
              </em>
              <button type="button">Voir</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CustomersAdminPage() {
  const demoCustomerOrders = [
    { id: "#CS-1048", customer: "Sarah L.", product: "1 adaptateur", total: "39,90 EUR", payment: "Payée", status: "Expédiée" },
    { id: "#CS-1047", customer: "Yanis T.", product: "2 adaptateurs", total: "69,90 EUR", payment: "Payée", status: "À préparer" },
    { id: "#CS-1046", customer: "Alex M.", product: "1 adaptateur", total: "39,90 EUR", payment: "Payée", status: "Livrée" }
  ];
  const statusOptions = ["À préparer", "Expédiée", "Livrée"];
  const [customerOrders, setCustomerOrders] = useState(demoCustomerOrders);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(demoCustomerOrders.map((order) => [order.id, order.status]))
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.from("orders").select("order_number,status,payment_status,total,customers(full_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data?.length) {
        const liveOrders = data.map((order) => {
          const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;
          const status = order.status === "preparing" ? "À préparer" : order.status === "shipped" ? "Expédiée" : order.status === "delivered" ? "Livrée" : "À préparer";
          return {
            id: order.order_number,
            customer: customer?.full_name || "Client CarSem",
            product: "Commande CarSem",
            total: `${Number(order.total).toFixed(2).replace(".", ",")} EUR`,
            payment: order.payment_status === "paid" ? "Payée" : "En attente",
            status
          };
        });
        setCustomerOrders(liveOrders);
        setStatuses(Object.fromEntries(liveOrders.map((order) => [order.id, order.status])));
      }
    });
  }, []);

  return (
    <div className="customers-page">
      <div className="customers-metrics">
        <article><span>Clients actifs</span><strong>3</strong><small>Depuis le lancement</small></article>
        <article><span>Commandes récentes</span><strong>3</strong><small>0 à expédier</small></article>
        <article><span>Panier moyen</span><strong>49,90 EUR</strong><small>CarSem Link</small></article>
        <article><span>Clients livrés</span><strong>1</strong><small>Statut finalisé</small></article>
      </div>

      <section className="customers-table-panel">
        <div className="customers-table-heading">
          <h2>Commandes récentes</h2>
          <div>
            <input type="search" placeholder="Rechercher" />
            <select defaultValue="all" aria-label="Filtrer les statuts">
              <option value="all">Tous les statuts</option>
              <option value="paid">Payées</option>
              <option value="prepared">À préparer</option>
              <option value="sent">Expédiées</option>
            </select>
          </div>
        </div>
        <div className="customers-table">
          <div className="customers-table-head">
            <span>Commande</span>
            <span>Client</span>
            <span>Produit</span>
            <span>Total</span>
            <span>Paiement</span>
            <span>Statut</span>
          </div>
          {customerOrders.map((order) => (
            <article key={order.id}>
              <strong>{order.id}</strong>
              <span>{order.customer}</span>
              <span>{order.product}</span>
              <strong>{order.total}</strong>
              <em className="paid">{order.payment}</em>
              <select
                className={`status-select ${statuses[order.id] === "À préparer" ? "pending" : "delivered"}`}
                aria-label={`Modifier le statut de la commande ${order.id}`}
                value={statuses[order.id]}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  setStatuses((current) => ({ ...current, [order.id]: nextStatus }));
                  if (supabase) {
                    const dbStatus = nextStatus === "À préparer" ? "preparing" : nextStatus === "Expédiée" ? "shipped" : "delivered";
                    supabase.from("orders").update({ status: dbStatus }).eq("order_number", order.id).then();
                  }
                }}
              >
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function OrdersAdminPage() {
  const [orders, setOrders] = useState<Array<{ id: string; customer: string; total: string; status: string; date: string }>>([]);
  const orderMetrics = [
    ["Aujourd’hui", "0", "Commandes du jour"],
    ["Commandes", "0", "Total visibles"],
    ["Articles commandés", "0", "Pièces vendues"],
    ["Retours", "0 EUR", "Aucun retour actif"],
    ["Commandes traitées", "0", "Livrées ou traitées"],
    ["CA commandes", "0,00 EUR", "Paiements reçus"]
  ];

  useEffect(() => {
    if (!supabase) return;
    supabase.from("orders").select("order_number,total,status,created_at,customers(full_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data?.length) {
        setOrders(data.map((order) => {
          const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;
          const status = order.status === "preparing" ? "À préparer" : order.status === "shipped" ? "Expédiée" : order.status === "delivered" ? "Livrée" : order.status;
          return {
            id: order.order_number,
            customer: customer?.full_name || "Client CarSem",
            total: `${Number(order.total).toFixed(2).replace(".", ",")} EUR`,
            status,
            date: new Date(order.created_at).toLocaleDateString("fr-FR")
          };
        }));
      }
    });
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-actions">
        <button type="button">Vider la demo</button>
        <button type="button">Recharger</button>
        <button className="primary" type="button">Créer une commande</button>
      </div>

      <div className="orders-metrics">
        {orderMetrics.map(([label, value, detail]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <div className="orders-layout">
        <section className="orders-list-panel">
          <div className="orders-list-header">
            <h2>Toutes les commandes</h2>
            <input type="search" placeholder="Rechercher une commande" />
            <select defaultValue="all">
              <option value="all">Tous les statuts</option>
              <option value="paid">Payées</option>
              <option value="prepared">À préparer</option>
              <option value="sent">Expédiées</option>
            </select>
          </div>
          {orders.length === 0 ? (
            <div className="orders-empty">
              <div className="receipt-illustration">
                <span />
                <i />
              </div>
              <h3>Vos commandes s’afficheront ici</h3>
              <p>C’est ici que vous pourrez traiter les commandes, percevoir les paiements et suivre l’état des commandes.</p>
              <button type="button">Créer une commande</button>
            </div>
          ) : (
            <div className="orders-live-list">
              {orders.map((order) => <article key={order.id}><strong>{order.id}</strong><span>{order.customer}</span><b>{order.total}</b><em>{order.status}</em><small>{order.date}</small></article>)}
            </div>
          )}
        </section>

        <aside className="selected-order-panel">
          <div className="admin-panel light-panel">
            <h2>Commande sélectionnée</h2>
            {["Commande", "Client", "Produit", "Livraison", "Total"].map((item) => (
              <p key={item}><span>{item}</span><strong>-</strong></p>
            ))}
            <button type="button">Marquer comme traitée</button>
          </div>
          <div className="admin-panel light-panel">
            <h2>Connexion future</h2>
            <p>Cette page est prête pour recevoir les vraies commandes depuis Stripe, Shopify ou Supabase. En démo, les commandes sont stockées dans le navigateur.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProductsAdminPage() {
  const demoProducts = [
    {
      name: "CarSem Link",
      id: "CS-LINK-001",
      image: "/assets/auryn/wireless-adapter-real-product.png",
      status: "Actif",
      stock: 42,
      collection: "Adaptateurs",
      price: "39,90 EUR"
    },
    {
      name: "Pack Duo CarSem Link",
      id: "CS-DUO-002",
      image: "/assets/auryn/wireless-adapter-hero.png",
      status: "Actif",
      stock: 18,
      collection: "Packs",
      price: "69,90 EUR"
    }
  ];
  const [products, setProducts] = useState(demoProducts);
  const selected = products[0];

  useEffect(() => {
    if (!supabase) return;
    supabase.from("products").select("*").order("created_at", { ascending: true }).then(({ data }) => {
      if (data?.length) {
        setProducts(data.map((product) => ({
          name: product.name,
          id: product.sku,
          image: product.image_url || "/assets/auryn/wireless-adapter-real-product.png",
          status: product.status === "active" ? "Actif" : product.status,
          stock: product.stock,
          collection: product.collection,
          price: `${Number(product.price).toFixed(2).replace(".", ",")} EUR`
        })));
      }
    });
  }, []);

  return (
    <div className="products-page">
      <div className="products-actions">
        <button type="button">Voir adaptateurs</button>
        <button type="button">Voir packs</button>
        <button className="primary" type="button">Ajouter un produit</button>
      </div>

      <div className="products-metrics">
        <article><span>Produits actifs</span><strong>2</strong></article>
        <article><span>Stock total</span><strong>60</strong></article>
        <article><span>Valeur stock</span><strong>2 935,80 EUR</strong></article>
        <article><span>Stock faible</span><strong>0</strong></article>
      </div>

      <div className="products-layout">
        <section className="products-list-panel">
          <div className="products-list-header">
            <h2>Tous les produits</h2>
            <input type="search" placeholder="Rechercher un produit" />
            <div>
              <select defaultValue="all"><option value="all">Toutes les collections</option></select>
              <select defaultValue="all"><option value="all">Tous les statuts</option></select>
            </div>
          </div>
          <div className="products-table">
            <div className="products-table-head">
              <span>Produit</span>
              <span>Statut</span>
              <span>Stock</span>
              <span>Prix</span>
            </div>
            {products.map((product) => (
              <article key={product.id}>
                <div className="product-cell">
                  <img src={product.image} alt="" />
                  <span><strong>{product.name}</strong><small>{product.id}</small></span>
                </div>
                <em>{product.status}</em>
                <div className="stock-edit"><strong>{product.stock}</strong><span>{product.stock} en stock</span></div>
                <b>{product.price}</b>
              </article>
            ))}
          </div>
        </section>

        <aside className="selected-product-panel">
          <div className="admin-panel light-panel">
            {selected && <>
              <img src={selected.image} alt="" />
              <h2>{selected.name}</h2>
              <p><span>Prix</span><strong>{selected.price}</strong></p>
              <p><span>Stock</span><strong>{selected.stock} pièces</strong></p>
              <p><span>Collection</span><strong>{selected.collection}</strong></p>
              <p><span>Statut</span><strong>{selected.status}</strong></p>
            </>}
            <button type="button">Ouvrir la page produit</button>
          </div>
          <div className="admin-panel light-panel">
            <h2>Connexion future</h2>
            <p>Cette page est prête pour synchroniser les produits, prix et stocks depuis Shopify ou Supabase.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PasswordRecoveryPage({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (!supabase) {
      setError("La connexion Supabase n’est pas configurée.");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError("Le lien est expiré ou a déjà été utilisé. Demande un nouveau lien.");
      return;
    }
    setMessage("Mot de passe mis à jour. Tu peux maintenant te connecter à l’administration.");
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <main className="password-recovery-page">
      <form className="password-recovery-card" onSubmit={handleSubmit}>
        <img src="/assets/auryn/carsem-logo-mark.png" alt="" />
        <p className="eyebrow">Accès sécurisé</p>
        <h1>Nouveau mot de passe</h1>
        <p>Choisis un nouveau mot de passe pour accéder à l’administration CarSem.</p>
        <label>
          Nouveau mot de passe
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        </label>
        <label>
          Confirmer le mot de passe
          <input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required />
        </label>
        {error && <span className="login-error">{error}</span>}
        {message && <span className="recovery-success">{message}</span>}
        {message ? (
          <button className="login-submit" type="button" onClick={onComplete}>Retour à la boutique</button>
        ) : (
          <button className="login-submit" type="submit" disabled={saving}>
            {saving ? "Mise à jour..." : "Enregistrer le mot de passe"}
          </button>
        )}
      </form>
    </main>
  );
}

export default function App() {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>("solo");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartHasItem, setCartHasItem] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [page, setPage] = useState<"home" | "product" | "admin">("home");
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const offer = offers[selectedOffer];

  const galleryImages = [
    {
      src: "/assets/auryn/wireless-adapter-hero.png",
      alt: "Adaptateur CarSem Link branché dans une console avec téléphone connecté sans-fil"
    },
    {
      src: "/assets/auryn/wireless-adapter-real-product.png",
      alt: "Gros plan réaliste de l’adaptateur CarSem Link avec LED verte"
    },
    {
      src: "/assets/auryn/wireless-compatibility-premium.png",
      alt: "Infographie premium montrant la compatibilité iPhone et Android ainsi que le passage du filaire au sans-fil"
    },
    {
      src: "/assets/auryn/plug-and-play-premium.png",
      alt: "Visuel plug and play premium montrant les ports USB-A et USB-C compatibles"
    }
  ];

  const subtotal = useMemo(() => offer.price * quantity, [offer.price, quantity]);
  const savings = useMemo(() => (offer.compareAt - offer.price) * quantity, [offer.compareAt, offer.price, quantity]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "CarSem Link - Adaptateur CarPlay Android Auto sans-fil",
    image: "/assets/auryn/wireless-adapter-hero.png",
    description: "Adaptateur compact qui transforme le CarPlay ou Android Auto filaire d’origine en connexion sans-fil.",
    brand: { "@type": "Brand", name: "CarSem" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1200" },
    offers: {
      "@type": "Offer",
      price: offer.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock"
    }
  };

  const goToSection = (sectionId: string) => {
    setPage("home");
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  useEffect(() => {
    if (window.location.hash === "#admin") {
      setLoginOpen(true);
    }
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hashParams.get("type") === "recovery") setPasswordRecovery(true);
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAdminLoggedIn(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      setAdminLoggedIn(Boolean(session));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (passwordRecovery) {
    return <PasswordRecoveryPage onComplete={() => setPasswordRecovery(false)} />;
  }

  if (page === "admin") {
    return <AdminPage onBack={async () => { await supabase?.auth.signOut(); setAdminLoggedIn(false); setPage("home"); }} />;
  }

  const openAdminLogin = () => {
    setLoginOpen(true);
    setLoginError("");
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (supabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword
      });
      if (error) {
        setLoginError("Adresse mail ou mot de passe incorrect.");
        return;
      }
      setAdminLoggedIn(true);
      setLoginOpen(false);
      setPage("admin");
      return;
    }
    if (loginEmail.trim().toLowerCase() === adminDemoCredentials.email && loginPassword === adminDemoCredentials.password) {
      setAdminLoggedIn(true);
      setLoginOpen(false);
      setPage("admin");
      return;
    }
    setLoginError("Adresse mail ou mot de passe incorrect.");
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className={`shop ${cartOpen ? "cart-is-open" : ""}`}>
        <div className="announcement">
          <span>Offre lancement</span>
          Passez du CarPlay filaire au sans-fil sans changer de voiture
        </div>

        <header className="shop-nav">
          <a className="brand" href="#top" aria-label="CarSem">
            <img className="brand-logo-mark" src="/assets/auryn/carsem-logo-mark.png" alt="" />
            <span>CarSem</span>
          </a>
          <nav aria-label="Navigation boutique">
            <button type="button" onClick={() => setPage("product")}>Produit</button>
            <button type="button" onClick={() => setPage("home")}>Accueil</button>
            <button type="button" onClick={() => goToSection("avis")}>Avis</button>
            <button type="button" onClick={() => goToSection("faq")}>FAQ</button>
          </nav>
          <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="Ouvrir le panier">
            <ShoppingBag size={20} />
            <span>{cartHasItem ? quantity : 0}</span>
          </button>
          <button className="account-button" type="button" onClick={openAdminLogin}>
            <span>AA</span>
            <strong>Compte</strong>
          </button>
        </header>

        <main id="top" className={page === "product" ? "product-view" : "home-view"}>
          <section className="commerce-hero">
            <motion.div
              className="hero-product-copy"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="eyebrow">Adaptateur CarPlay & Android Auto sans-fil</p>
              <Rating />
              <h1>Votre CarPlay devient sans-fil dès le démarrage.</h1>
              <p className="hero-lead">
                Branchez CarSem Link une seule fois. Votre voiture reconnaît ensuite votre téléphone automatiquement pour retrouver GPS, musique et appels sans sortir le câble.
              </p>
              <div className="hero-benefits" aria-label="Bénéfices clés">
                <span><Zap size={16} /> Installation 60 sec</span>
                <span><Wifi size={16} /> Connexion automatique</span>
                <span><Car size={16} /> Écran d’origine conservé</span>
              </div>
              <div className="hero-price">
                <strong>À partir de {formatPrice(offers.solo.price)}</strong>
                <span>{formatPrice(offers.solo.compareAt)}</span>
              </div>
              <div className="hero-actions">
                <button className="button primary" type="button" onClick={() => setPage("product")}>Choisir mon adaptateur <ArrowRight size={18} /></button>
                <a className="button secondary" href="#compatibilite">Vérifier ma voiture</a>
              </div>
              <div className="source-note">
                <ShieldCheck size={18} />
                Compatible avec les véhicules ayant déjà CarPlay ou Android Auto filaire d’origine.
              </div>
            </motion.div>

            <div className="product-stage compact-stage">
              <img src="/assets/auryn/wireless-adapter-real-product.png" alt="Adaptateur CarSem Link branché dans le port USB d’une voiture avec connexion sans-fil" />
              <div className="hero-offer-card">
                <span>Offre lancement</span>
                <strong>{formatPrice(offers.solo.price)}</strong>
                <small>Adaptateur sans-fil · garantie incluse</small>
              </div>
              <div className="floating-proof">
                <Wifi size={18} />
                <span>Connexion automatique après appairage</span>
              </div>
            </div>
          </section>

          <section className="trust-strip" aria-label="Réassurance">
            <span><Truck size={18} /> Livraison suivie</span>
            <span><ShieldCheck size={18} /> Garantie 2 ans</span>
            <span><RefreshCw size={18} /> Retours 30 jours</span>
            <span><Lock size={18} /> Paiement sécurisé</span>
          </section>

          <section id="produit" className="product-section">
            <div className="gallery">
              <div className="product-slider" aria-label="Photos produit">
                <img className="main-gallery-image" src={galleryImages[activeImage].src} alt={galleryImages[activeImage].alt} />
                <button
                  className="slider-arrow left"
                  type="button"
                  onClick={() => setActiveImage((index) => (index === 0 ? galleryImages.length - 1 : index - 1))}
                  aria-label="Photo précédente"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="slider-arrow right"
                  type="button"
                  onClick={() => setActiveImage((index) => (index + 1) % galleryImages.length)}
                  aria-label="Photo suivante"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="slider-dots" aria-hidden="true">
                  {galleryImages.map((image, index) => (
                    <span key={image.src} className={activeImage === index ? "active" : ""} />
                  ))}
                </div>
              </div>
              <div className="gallery-grid">
                {galleryImages.map((image, index) => (
                  <button
                    className={`gallery-thumb ${activeImage === index ? "selected" : ""}`}
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Afficher la photo ${index + 1}`}
                  >
                    <img src={image.src} alt="" />
                  </button>
                ))}
              </div>
              <div className="gallery-benefits">
                <div>
                  <Cable size={30} />
                  <strong>Avant</strong>
                  <span>Câble à chaque trajet</span>
                </div>
                <div>
                  <Wifi size={30} />
                  <strong>Après</strong>
                  <span>Sans-fil automatique</span>
                </div>
                <div>
                  <Usb size={30} />
                  <strong>Plug & Play</strong>
                  <span>Branchez, appairez, partez</span>
                </div>
              </div>
            </div>

            <aside id="acheter" className="buy-box">
              {page === "product" && (
                <button className="back-link" type="button" onClick={() => setPage("home")}>← Retour à l’accueil</button>
              )}
              <p className="eyebrow dark">Choisissez votre offre</p>
              <h2>CarSem Link</h2>
              <p className="buy-intro">Le petit adaptateur qui rend votre voiture plus moderne au quotidien, sans travaux, sans écran ajouté, sans câble qui traîne.</p>

              <div className="offer-list" role="radiogroup" aria-label="Offres">
                {(Object.keys(offers) as OfferId[]).map((id) => {
                  const item = offers[id];
                  return (
                    <button
                      key={id}
                      className={`offer-card ${selectedOffer === id ? "selected" : ""}`}
                      type="button"
                      onClick={() => setSelectedOffer(id)}
                      role="radio"
                      aria-checked={selectedOffer === id}
                    >
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                        {item.badge && <em>{item.badge}</em>}
                      </span>
                      <span className="offer-price">
                        <b>{formatPrice(item.price)}</b>
                        <s>{formatPrice(item.compareAt)}</s>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="included">
                <span>Inclus</span>
                {offer.includes.map((item) => (
                  <p key={item}><Check size={16} /> {item}</p>
                ))}
              </div>

              <div className="quantity-row">
                <span>Quantité</span>
                <div className="qty-controls">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Réduire la quantité"><Minus size={16} /></button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Augmenter la quantité"><Plus size={16} /></button>
                </div>
              </div>

              <button
                className="add-to-cart"
                type="button"
                onClick={() => {
                  setCartHasItem(true);
                  setCartOpen(true);
                }}
              >
                Ajouter au panier · {formatPrice(subtotal)}
              </button>
              <p className="payment-note"><CreditCard size={16} /> Visa, Mastercard, Apple Pay, PayPal</p>
            </aside>
          </section>

          <section className="benefits-section">
            <div className="section-heading">
              <p className="eyebrow dark">Storytelling</p>
              <h2>Le luxe, parfois, c’est juste de ne plus penser au câble.</h2>
            </div>
            <div className="benefit-grid">
              {benefits.map(([title, text, Icon]) => (
                <article key={String(title)}>
                  <Icon size={28} />
                  <h3>{String(title)}</h3>
                  <p>{String(text)}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="compatibilite" className="compatibility-panel">
            <div>
              <p className="eyebrow dark">Compatibilité</p>
              <h2>Important : il transforme le filaire en sans-fil.</h2>
              <p>Ce produit est parfait pour les voitures qui ont déjà CarPlay ou Android Auto via câble USB. Il n’ajoute pas CarPlay à une voiture qui n’en dispose pas déjà.</p>
            </div>
            <div className="fit-list">
              {fitChecks.map((item) => (
                <span key={item}><Check size={17} /> {item}</span>
              ))}
            </div>
          </section>

          <section className="comparison">
            <div>
              <p className="eyebrow dark">Avant</p>
              <h2>Vous branchez le câble, vous le débranchez, vous le cherchez, tous les jours.</h2>
            </div>
            <div>
              <p className="eyebrow dark">Après</p>
              <h2>Votre voiture reconnaît votre téléphone dès que vous démarrez.</h2>
            </div>
          </section>

          <motion.section
            id="avis"
            className="reviews"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="proof-panel"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <strong>60 sec</strong>
              <span>pour l’installer</span>
              <p>Un produit idéal en e-commerce : problème fréquent, bénéfice immédiat, démonstration simple et prix d’achat impulsif.</p>
            </motion.div>
            <div className="review-list">
              {reviews.map(([name, car, text], index) => (
                <motion.article
                  key={name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.58, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="quote-mark">“</span>
                  <Rating />
                  <p>“{text}”</p>
                  <span>{name} · {car}</span>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <section id="faq" className="faq">
            <div className="section-heading">
              <p className="eyebrow dark">FAQ</p>
              <h2>Les objections à traiter avant l’achat.</h2>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<ChevronDown size={18} /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="final-shop-cta">
            <p className="eyebrow">CarSem Link</p>
            <h2>Un petit adaptateur. Une voiture qui paraît instantanément plus moderne.</h2>
            <button
              className="button primary light"
              type="button"
              onClick={() => {
                setCartHasItem(true);
                setCartOpen(true);
              }}
            >
              Commander maintenant <ArrowRight size={18} />
            </button>
          </section>
        </main>

        <footer className="footer">
          <div className="brand"><img className="footer-logo" src="/assets/auryn/carsem-logo-full.png" alt="CarSem" /></div>
          <p>Adaptateur CarPlay & Android Auto sans-fil pour véhicules déjà compatibles en filaire.</p>
          <div>
            <a href="#produit">Produit</a>
            <a href="#compatibilite">Compatibilité</a>
            <a href="#acheter">Acheter</a>
            <button type="button" onClick={openAdminLogin}>Admin</button>
          </div>
        </footer>

        <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
        <aside className="cart-drawer" aria-label="Panier">
          <div className="cart-header">
            <h2>Panier</h2>
            <button type="button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier"><X size={20} /></button>
          </div>
          {cartHasItem ? (
            <>
              <div className="cart-item">
                <img src="/assets/auryn/wireless-adapter-hero.png" alt="" />
                <div>
                  <strong>{offer.name}</strong>
                  <span>{formatPrice(offer.price)}</span>
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Réduire la quantité"><Minus size={16} /></button>
                      <strong>{quantity}</strong>
                      <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Augmenter la quantité"><Plus size={16} /></button>
                    </div>
                    <button
                      className="remove-item"
                      type="button"
                      onClick={() => {
                        setCartHasItem(false);
                        setQuantity(1);
                      }}
                      aria-label="Retirer le produit du panier"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="cart-lines">
                <p><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></p>
                <p><span>Économie</span><strong>-{formatPrice(savings)}</strong></p>
                <p><span>Livraison</span><strong>{subtotal >= 49 ? "Offerte" : formatPrice(4.9)}</strong></p>
              </div>
              <a className="checkout-button" href="https://checkout.shopify.com" rel="noreferrer">
                Passer au paiement <ArrowRight size={18} />
              </a>
              <p className="cart-note">À remplacer par le checkout Shopify réel au moment de l’intégration.</p>
            </>
          ) : (
            <div className="empty-cart">
              <ShoppingBag size={34} />
              <strong>Votre panier est vide</strong>
              <p>Ajoutez un adaptateur CarSem Link pour passer votre voiture au sans-fil.</p>
              <button type="button" onClick={() => setCartOpen(false)}>Continuer mes achats</button>
            </div>
          )}
        </aside>

        {loginOpen && (
          <div className="login-overlay" role="dialog" aria-modal="true" aria-label="Connexion administrateur">
            <form className="login-card" onSubmit={handleAdminLogin}>
              <button className="login-close" type="button" onClick={() => setLoginOpen(false)} aria-label="Fermer la connexion">
                <X size={20} />
              </button>
              <img src="/assets/auryn/carsem-logo-mark.png" alt="" />
              <p className="eyebrow">Accès privé</p>
              <h2>Connexion admin</h2>
              <p>Accès réservé au propriétaire de la boutique CarSem.</p>
              <label>
                Adresse mail
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="client@carsem.fr"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Mot de passe
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>
              {loginError && <span className="login-error">{loginError}</span>}
              <button className="login-submit" type="submit">
                <LogIn size={18} /> Entrer dans l’administration
              </button>
              <small>Démo locale : {adminDemoCredentials.email} / {adminDemoCredentials.password}</small>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
