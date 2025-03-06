import {
  constructTrie,
  generateWords,
  findOptionalSolutions,
} from "./wordProcessor";

describe("wordProcessor", () => {
  describe("constructTrie", () => {
    it("should construct an empty trie for empty word list", () => {
      const trie = constructTrie([]);
      expect(trie.children).toEqual({});
      expect(trie.isEndOfWord).toBe(false);
    });

    it("should construct a trie with a single word", () => {
      const trie = constructTrie(["CAT"]);
      expect(trie.children["C"]).toBeDefined();
      expect(trie.children["C"].children["A"]).toBeDefined();
      expect(trie.children["C"].children["A"].children["T"]).toBeDefined();
      expect(trie.children["C"].children["A"].children["T"].isEndOfWord).toBe(
        true
      );
    });

    it("should handle multiple words with common prefixes", () => {
      const trie = constructTrie(["CAT", "CATCH"]);
      expect(trie.children["C"].children["A"].children["T"].isEndOfWord).toBe(
        true
      );
      expect(
        trie.children["C"].children["A"].children["T"].children["C"].children[
          "H"
        ].isEndOfWord
      ).toBe(true);
    });
  });

  describe("generateWords", () => {
    const testWords = [
      "CAT",
      "CATCH",
      "DOG",
      "DOOR",
      "RAT",
      "BUN",
      "FUN",
      "PIXEL",
      "vanquished",
      "disozonize",
    ];
    const trie = constructTrie(testWords);

    it("should generate words using characters from different strings", () => {
      const strings = ["CGR", "DHB", "UFT", "OAL"];
      const words = generateWords(strings, trie);

      // Should be able to make words using characters from different strings
      // For example: C from first string, A from second string, T from third string
      expect(words).toContain("CATCH");
    });

    it("should not generate words using adjacent characters from the same string", () => {
      const strings = ["CHR", "DGB", "UFT", "OAL"];
      const words = generateWords(strings, trie);

      // Should not be able to use 'CAT' from the first string to make 'CATCH'
      // because it would require using adjacent characters from the same string
      expect(words).not.toContain("CATCH");

      // Should not be able to use 'DOOR' because it would require using adjacent 'O's
      // from the same string
      expect(words).not.toContain("DOOR");
    });

    it("should return empty array for no valid words", () => {
      const strings = ["XYZ", "ABC", "DEF", "GHI"];
      const words = generateWords(strings, trie);
      expect(words).toEqual([]);
    });

    it("should not allow using characters from the same string consecutively", () => {
      const strings = ["CGR", "DHB", "UFT", "OAL"];
      const words = generateWords(strings, trie);

      // For each word, verify that no two consecutive characters come from the same string
      words.forEach((word) => {
        for (let i = 0; i < word.length - 1; i++) {
          const char1 = word[i];
          const char2 = word[i + 1];

          // Check if these characters appear in the same string
          const sameString = strings.some(
            (str) => str.includes(char1) && str.includes(char2)
          );

          expect(sameString).toBe(false);
        }
      });
    });

    it("should find words using the specific example strings", () => {
      const strings = ["szq", "udn", "vei", "aho"];
      const words = generateWords(strings, trie);

      console.log("Found words:", words);
      expect(words).toContain("vanquished");
      expect(words).toContain("disozonize");
    });
  });

  describe("findOptionalSolutions", () => {
    it("should find valid word pairs that use all characters", () => {
      const words = ["vanquished", "disozonize"];
      const allChars = [
        "v",
        "a",
        "n",
        "q",
        "u",
        "i",
        "s",
        "h",
        "e",
        "d",
        "o",
        "z",
      ];
      const solutions = findOptionalSolutions(words, allChars);

      // Should find pairs where the last letter of first word matches first letter of second word
      expect(solutions.length).toBeGreaterThan(0);
      solutions.forEach(([word1, word2]) => {
        expect(word1[word1.length - 1]).toBe(word2[0]);
        expect(new Set(word1 + word2).size).toBe(allChars.length);
      });
    });

    it("should not include pairs that don't use all characters", () => {
      const words = ["CAT", "DOG", "RAT", "DOOR", "BUN", "FUN", "PIXEL"];
      const allChars = [
        "C",
        "A",
        "T",
        "D",
        "O",
        "G",
        "R",
        "A",
        "T",
        "D",
        "O",
        "O",
        "R",
        "B",
        "U",
        "N",
        "F",
        "U",
        "N",
      ];
      const solutions = findOptionalSolutions(words, allChars);

      solutions.forEach(([word1, word2]) => {
        const combinedChars = new Set(word1 + word2);
        expect(combinedChars.size).toBe(allChars.length);
      });
    });

    it("should return empty array when no valid solutions exist", () => {
      const words = ["CAT", "DOG"];
      const allChars = ["C", "A", "T", "D", "O", "G"];
      const solutions = findOptionalSolutions(words, allChars);
      expect(solutions).toEqual([]);
    });

    it("should handle words with repeated characters", () => {
      const words = ["DOOR", "RAT", "CAT", "DOG"];
      const allChars = [
        "D",
        "O",
        "O",
        "R",
        "R",
        "A",
        "T",
        "C",
        "A",
        "T",
        "D",
        "O",
        "G",
      ];
      const solutions = findOptionalSolutions(words, allChars);

      solutions.forEach(([word1, word2]) => {
        expect(word1[word1.length - 1]).toBe(word2[0]);
        expect(new Set(word1 + word2).size).toBe(new Set(allChars).size);
      });
    });

    it("should sort words by length in descending order", () => {
      const words = ["CAT", "DOOR", "RAT", "DOG"];
      const allChars = [
        "C",
        "A",
        "T",
        "D",
        "O",
        "O",
        "R",
        "R",
        "A",
        "T",
        "D",
        "O",
        "G",
      ];
      const solutions = findOptionalSolutions(words, allChars);

      // Longer words should appear first in the pairs
      solutions.forEach(([word1, word2]) => {
        expect(word1.length).toBeGreaterThanOrEqual(word2.length);
      });
    });
  });
});
