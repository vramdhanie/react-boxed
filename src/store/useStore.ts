import { create } from "zustand";

interface Letter {
  key: string;
  position: number;
}

interface Store {
  placedLetters: Letter[];
  usedKeys: string[];
  draggedKey: string | null;
  setLetter: (key: string, position: number) => void;
  removeLetter: (position: number) => void;
  setDraggedKey: (key: string | null) => void;
}

const useStore = create<Store>((set) => ({
  placedLetters: [],
  usedKeys: [],
  draggedKey: null,
  setLetter: (key, position) =>
    set((state) => {
      // Remove any existing letter at this position
      const filteredLetters = state.placedLetters.filter(
        (letter) => letter.position !== position
      );

      // Add the new letter and ensure unique keys
      const newUsedKeys = Array.from(new Set([...state.usedKeys, key]));

      return {
        placedLetters: [...filteredLetters, { key, position }],
        usedKeys: newUsedKeys,
      };
    }),
  removeLetter: (position) =>
    set((state) => {
      const letterToRemove = state.placedLetters.find(
        (letter) => letter.position === position
      );
      if (!letterToRemove) return state;

      const key = letterToRemove.key;
      const filteredLetters = state.placedLetters.filter(
        (letter) => letter.position !== position
      );

      // Only remove from usedKeys if this was the last instance of this letter
      const shouldRemoveFromUsed = !filteredLetters.some(
        (letter) => letter.key === key
      );

      return {
        placedLetters: filteredLetters,
        usedKeys: shouldRemoveFromUsed
          ? state.usedKeys.filter((k) => k !== key)
          : state.usedKeys,
      };
    }),
  setDraggedKey: (key) => set({ draggedKey: key }),
}));

export default useStore;
