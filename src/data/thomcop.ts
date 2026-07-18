import {
  BarChart3,
  Bell,
  CheckCircle2,
  Flame,
  Goal,
  GraduationCap,
  Home,
  Play,
  Settings,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Zap
} from "lucide-react";

export type PageId =
  | "overview"
  | "goal"
  | "actions"
  | "progress"
  | "formations"
  | "copilot"
  | "profile"
  | "settings";

export const navItems = [
  { id: "overview", label: "Vue d’ensemble", icon: Home },
  { id: "goal", label: "Mon objectif", icon: Goal },
  { id: "actions", label: "Plan d’action", icon: Target },
  { id: "progress", label: "Progression", icon: TrendingUp },
  { id: "formations", label: "Formations", icon: GraduationCap },
  { id: "copilot", label: "Copilot IA", icon: Sparkles },
  { id: "settings", label: "Paramètres", icon: Settings }
] satisfies Array<{ id: PageId; label: string; icon: typeof Home }>;

export const topMetrics = [
  {
    label: "Progression globale",
    value: "68 %",
    detail: "+12 % cette semaine",
    icon: TrendingUp,
    tone: "success"
  },
  {
    label: "Objectif mensuel",
    value: "7 840 €",
    detail: "sur 12 000 € visés",
    icon: Target,
    tone: "danger"
  },
  {
    label: "Temps gagné",
    value: "14 h",
    detail: "grâce aux actions IA",
    icon: Timer,
    tone: "warning"
  },
  {
    label: "Taux de réussite",
    value: "82 %",
    detail: "actions terminées",
    icon: CheckCircle2,
    tone: "success"
  }
];

export const dailyActions = [
  {
    priority: "Priorité haute",
    title: "Repositionner l’offre Hero",
    time: "25 min",
    expected: "+1 200 € potentiel",
    reason: "Ton offre convertit mieux quand le bénéfice financier est visible dès la première section.",
    color: "danger",
    icon: Zap
  },
  {
    priority: "Priorité moyenne",
    title: "Relancer 38 paniers chauds",
    time: "12 min",
    expected: "+760 € estimés",
    reason: "Ces visiteurs ont ajouté au panier dans les dernières 48 heures mais n’ont pas reçu de relance claire.",
    color: "success",
    icon: Bell
  },
  {
    priority: "Focus qualité",
    title: "Simplifier la page produit",
    time: "18 min",
    expected: "-9 % friction achat",
    reason: "La page contient trop d’informations avant le premier appel à l’action.",
    color: "warning",
    icon: Sparkles
  }
];

export const growthData = [
  { day: "Lun", profit: 28, focus: 18 },
  { day: "Mar", profit: 34, focus: 24 },
  { day: "Mer", profit: 42, focus: 31 },
  { day: "Jeu", profit: 39, focus: 36 },
  { day: "Ven", profit: 56, focus: 44 },
  { day: "Sam", profit: 61, focus: 48 },
  { day: "Dim", profit: 72, focus: 58 }
];

export const rewards = [
  { label: "7 jours focus", icon: Flame, active: true },
  { label: "Premier palier", icon: Trophy, active: true },
  { label: "Action rapide", icon: Play, active: false },
  { label: "Pilotage net", icon: BarChart3, active: false }
];
