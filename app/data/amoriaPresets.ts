// app/data/amoriaPresets.ts

export type AmoriaPresetId =
  | "amoria_01"
  | "amoria_02"
  | "amoria_03"
  // ...
  | "amoria_30";

export type AmoriaPreset = {
  id: AmoriaPresetId;
  name: string;
  shortLabel: string;
  description: string;
  language: "fr" | "en" | "es";
  gender: "feminine" | "masculine" | "neutral";
  energy: "douce" | "directe" | "motivation" | "sensuelle" | "therapeutique"; // adapte à tes critères
  attachmentStyle?: "secure" | "anxious" | "avoidant" | "mixed";
  // tous les autres champs que tu as déjà
  avatarUrl: string;
};

export const AMORIA_PRESETS: AmoriaPreset[] = [
  {
    id: "amoria_01",
    name: "AmorIA Douce FR",
    shortLabel: "Douce & rassurante",
    description:
      "Présence calme, rassurante, idéale pour parler d’émotions et d’anxiété.",
    language: "fr",
    gender: "feminine",
    energy: "douce",
    attachmentStyle: "secure",
    avatarUrl: "/avatars/amoria_01.png",
  },
  {
    id: "amoria_02",
    name: "AmorIA Coach FR",
    shortLabel: "Coach motivante",
    description:
      "Ton coach bienveillant qui te pousse à avancer, avec des conseils concrets.",
    language: "fr",
    gender: "feminine",
    energy: "motivation",
    attachmentStyle: "secure",
    avatarUrl: "/avatars/amoria_02.png",
  },
  // ...
  // jusqu'à amoria_30
];
