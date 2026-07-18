# CarSem

Boutique e-commerce CarSem pour vendre l'adaptateur sans-fil CarPlay et Android Auto, avec espace d'administration.

## Stack

- React + TypeScript + Vite
- Supabase Auth et base de données
- Framer Motion et Lucide React
- CSS responsive avec thème CarSem

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

La boutique est ensuite disponible sur `http://localhost:8080`.

## Configuration Supabase

Renseigner ces variables dans `.env.local` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_publishable
```

Puis exécuter `supabase_carsem.sql` dans le SQL Editor du projet Supabase. Le fichier crée les tables, les règles de sécurité et les produits CarSem de démonstration.

Pour donner l'accès administrateur à un utilisateur créé dans **Authentication > Users**, ajouter son profil avec :

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'adresse-du-client@example.com'
on conflict (id) do update set role = 'admin';
```

## Scripts

```bash
pnpm dev       # développement
pnpm build     # vérification TypeScript et build de production
pnpm preview   # aperçu du build
```

Sans variables Supabase, l'interface conserve un mode démo local pour la présentation.
