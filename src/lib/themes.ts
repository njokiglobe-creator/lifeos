export type ThemePreset = {
  id: string;
  name: string;
  dawn: string;
  gold: string;
  dusk: string;
};

export const THEMES: ThemePreset[] = [
  { id: "dawn", name: "Dawn", dawn: "#ff8b5e", gold: "#ffc15e", dusk: "#6fe3d0" },
  { id: "ocean", name: "Ocean", dawn: "#4f9dff", gold: "#5ecbff", dusk: "#6fe3d0" },
  { id: "forest", name: "Forest", dawn: "#6fbf73", gold: "#a8d15e", dusk: "#5ee3c0" },
  { id: "grape", name: "Grape", dawn: "#c07bff", gold: "#ff8bd6", dusk: "#7b9bff" },
  { id: "ember", name: "Ember", dawn: "#ff6f6f", gold: "#ffb15e", dusk: "#ff8bd6" },
];
