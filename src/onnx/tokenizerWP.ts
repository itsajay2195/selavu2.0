// Minimal WordPiece tokenizer for BERT/MiniLM in pure TS (React Native friendly).
// Requires a BERT-style vocab.txt with tokens like [PAD], [CLS], [SEP], [UNK], '##ing', etc.

import RNFS from 'react-native-fs';

export type Encoded = {
  ids: number[];
  attentionMask: number[];
  typeIds: number[];
};

type Vocab = Map<string, number>;

const DEFAULT_MAX_LEN = 128;

function isPunc(ch: string): boolean {
  // simple punctuation check (covers most SMS)
  const code = ch.charCodeAt(0);
  if (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126)
  )
    return true;
  // common unicode punctuation
  return '“”‘’–—…₹'.includes(ch);
}

function basicTokenize(text: string): string[] {
  // lowercase and normalize spacing
  let t = (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  // split on punctuation by spacing them out
  let out = '';
  for (const ch of t) out += isPunc(ch) ? ` ${ch} ` : ch;
  return out.split(' ').filter(Boolean);
}

function wordpieceTokenize(
  token: string,
  vocab: Vocab,
  unkId: number,
): number[] {
  const maxChars = 100;
  if (!token || token.length > maxChars) return [unkId];

  const ids: number[] = [];
  let start = 0;
  const len = token.length;

  while (start < len) {
    let end = len;
    let cur: number | null = null;

    while (start < end) {
      let sub = token.slice(start, end);
      if (start > 0) sub = '##' + sub;
      const id = vocab.get(sub);
      if (id !== undefined) {
        cur = id;
        break;
      }
      end -= 1;
    }

    if (cur === null) {
      return [unkId];
    }
    ids.push(cur);
    start = end;
  }
  return ids;
}

export class WordPieceTokenizer {
  private vocab: Vocab = new Map();
  private invVocab: string[] = [];
  private padId = 0;
  private clsId = 0;
  private sepId = 0;
  private unkId = 0;

  static async fromVocabFile(vocabPath: string): Promise<WordPieceTokenizer> {
    const t = new WordPieceTokenizer();
    if (!(await RNFS.exists(vocabPath))) {
      throw new Error(`vocab.txt not found at: ${vocabPath}`);
    }
    const content = await RNFS.readFile(vocabPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    lines.forEach((tok, i) => t.vocab.set(tok, i));
    t.invVocab = lines;

    // Find special token ids
    const get = (s: string, fallback: number) => t.vocab.get(s) ?? fallback;
    t.padId = get('[PAD]', get('[PAD]', 0));
    t.clsId = get('[CLS]', get('[CLS]', 101));
    t.sepId = get('[SEP]', get('[SEP]', 102));
    t.unkId = get('[UNK]', get('[UNK]', 100));

    return t;
  }

  encode(text: string, maxLen: number = DEFAULT_MAX_LEN): Encoded {
    const pieces: number[] = [this.clsId];

    const basic = basicTokenize(text);
    for (const tok of basic) {
      const ids = wordpieceTokenize(tok, this.vocab, this.unkId);
      for (const id of ids) pieces.push(id);
    }

    pieces.push(this.sepId);

    // truncate
    if (pieces.length > maxLen) {
      pieces.length = maxLen;
      // ensure last token is SEP
      pieces[pieces.length - 1] = this.sepId;
    }

    // pad
    const attentionMask = new Array(pieces.length).fill(1);
    const typeIds = new Array(pieces.length).fill(0);

    if (pieces.length < maxLen) {
      const padCount = maxLen - pieces.length;
      for (let i = 0; i < padCount; i++) {
        pieces.push(this.padId);
        attentionMask.push(0);
        typeIds.push(0);
      }
    }

    return {ids: pieces, attentionMask, typeIds};
  }
}
