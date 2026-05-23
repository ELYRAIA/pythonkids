export type PetAction = "idle" | "manger" | "jouer" | "dormir" | "danser" | "triste";

export interface PetState {
  nom: string;
  faim: number;
  humeur: number;
  energie: number;
  action: PetAction;
}

const KEY = "pythonkids_pet";
export const PET_DEFAULT: PetState = { nom: "Pixel", faim: 60, humeur: 70, energie: 80, action: "idle" };

export function getPetState(): PetState {
  if (typeof window === "undefined") return { ...PET_DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...PET_DEFAULT };
    return { ...PET_DEFAULT, ...JSON.parse(raw) };
  } catch { return { ...PET_DEFAULT }; }
}

export function savePetState(state: PetState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("pythonkids:pet"));
}

export function applyPetAction(state: PetState, action: string, value: unknown): PetState {
  const next = { ...state };
  if (action === "nourrir") {
    const q = Math.max(0, Math.min(100, Number(value) || 50));
    next.faim = Math.min(100, next.faim + q);
    next.action = "manger";
  } else if (action === "jouer") {
    next.humeur = Math.min(100, next.humeur + 20);
    next.energie = Math.max(0, next.energie - 10);
    next.action = "jouer";
  } else if (action === "dormir") {
    const h = Math.max(0, Math.min(24, Number(value) || 8));
    next.energie = Math.min(100, next.energie + h * 10);
    next.humeur = Math.min(100, next.humeur + 5);
    next.action = "dormir";
  } else if (action === "danser") {
    next.humeur = Math.min(100, next.humeur + 15);
    next.energie = Math.max(0, next.energie - 20);
    next.action = "danser";
  }
  return next;
}
