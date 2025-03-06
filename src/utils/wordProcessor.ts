export interface TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
}

class TrieNodeImpl implements TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEndOfWord: boolean = false;
}

export const constructTrie = (wordList: string[]): TrieNode => {
  const root = new TrieNodeImpl();

  for (const word of wordList) {
    let node = root;
    for (const char of word) {
      if (!(char in node.children)) {
        node.children[char] = new TrieNodeImpl();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  return root;
};

const searchWord = (trie: TrieNode, word: string): boolean => {
  let node = trie;
  for (const char of word) {
    if (!(char in node.children)) {
      return false;
    }
    node = node.children[char];
  }
  return node.isEndOfWord;
};

const dfs = (
  trie: TrieNode,
  words: string[],
  currentWord: string,
  strList: string[],
  currentIndex: number,
  lastUsedIndex: number = -1
): void => {
  if (trie.isEndOfWord && currentWord.length >= 4) {
    console.log("Found valid word:", currentWord);
    words.push(currentWord);
  }

  if (Object.keys(trie.children).length === 0) {
    return;
  }

  for (let i = 0; i < strList.length; i++) {
    if (i === lastUsedIndex) {
      continue;
    }

    for (const char of strList[i]) {
      if (char in trie.children) {
        console.log(
          `Current word: ${currentWord}, trying char: ${char} from string ${i}`
        );
        dfs(trie.children[char], words, currentWord + char, strList, i, i);
      } else {
        console.log(
          `Current word: ${currentWord}, char ${char} not found in trie children:`,
          Object.keys(trie.children)
        );
      }
    }
  }
};

export const generateWords = (strings: string[], trie: TrieNode): string[] => {
  const validWords: string[] = [];
  console.log("Available strings:", strings);
  console.log("Trie root children:", Object.keys(trie.children));

  for (let i = 0; i < strings.length; i++) {
    for (const c of strings[i]) {
      if (c in trie.children) {
        console.log(`Starting with character '${c}' from string ${i}`);
        dfs(trie.children[c], validWords, c, strings, i, i);
      } else {
        console.log(`Character '${c}' not found in trie`);
      }
    }
  }
  return validWords;
};

export const findOptionalSolutions = (
  words: string[],
  allChars: string[]
): [string, string][] => {
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  const wordPairs: [string, string][] = [];
  const optionalSolutions: [string, string][] = [];

  for (let i = 0; i < sortedWords.length; i++) {
    for (let j = 0; j < sortedWords.length; j++) {
      if (
        i !== j &&
        sortedWords[i][sortedWords[i].length - 1] === sortedWords[j][0]
      ) {
        if (sortedWords[i].length + sortedWords[j].length >= allChars.length) {
          wordPairs.push([sortedWords[i], sortedWords[j]]);
        }
      }
    }
  }

  for (const pair of wordPairs) {
    const combinedChars = new Set(pair[0] + pair[1]);

    if (combinedChars.size === allChars.length) {
      optionalSolutions.push(pair);
    }
  }

  return optionalSolutions;
};
