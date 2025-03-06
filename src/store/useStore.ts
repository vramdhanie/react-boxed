import { create } from "zustand";

interface Position {
  key: string;
  position: number;
}

interface Store {
  placedLetters: Position[];
  usedKeys: string[];
  setLetter: (key: string, position: number) => void;
  removeLetter: (position: number) => void;
}

const useStore = create<Store>((set) => ({
  placedLetters: [],
  usedKeys: [],
  setLetter: (key: string, position: number) => {
    set((state) => {
      // Check if the position is already occupied
      const isPositionOccupied = state.placedLetters.some(
        (letter) => letter.position === position
      );

      // Check if the key is already used
      const isKeyUsed = state.usedKeys.includes(key);

      if (isPositionOccupied || isKeyUsed) return state;

      return {
        placedLetters: [...state.placedLetters, { key, position }],
        usedKeys: [...state.usedKeys, key],
      };
    });
  },
  removeLetter: (position: number) => {
    set((state) => {
      const letterToRemove = state.placedLetters.find(
        (letter) => letter.position === position
      );

      if (!letterToRemove) return state;

      return {
        placedLetters: state.placedLetters.filter(
          (letter) => letter.position !== position
        ),
        usedKeys: state.usedKeys.filter((key) => key !== letterToRemove.key),
      };
    });
  },
}));

export default useStore;
