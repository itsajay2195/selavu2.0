// onnxManager.ts
import RNFS from 'react-native-fs';
import {InferenceSession, Tensor} from 'onnxruntime-react-native';
import {WordPieceTokenizer} from './tokenizerWP';

const BASE = `${RNFS.DocumentDirectoryPath}/models`;
const EMB = `${BASE}/model_quant.onnx`;
const CAT = `${BASE}/category_clf.onnx`;
const INT = `${BASE}/intent_clf.onnx`;
const LAB = `${BASE}/labels.json`;
const VOCAB = `${BASE}/vocab.txt`;

type OnnxState = {
  initialized: boolean;
  initPromise: Promise<void> | null;
  embS?: InferenceSession;
  catS?: InferenceSession;
  intS?: InferenceSession;
  labels?: {categories: string[]; intents: string[]};
  tokenizer?: WordPieceTokenizer;
  uid: number; // debug
};

// single global slot
const G: {__ONNX?: OnnxState} = global as any;
if (!G.__ONNX)
  G.__ONNX = {
    initialized: false,
    initPromise: null,
    uid: Math.floor(Math.random() * 1e9),
  };
const S = G.__ONNX!; // <- use this everywhere

let EMBED_OUT_NAME: string | null = null;

// export function pickEmbedOutputName(names: string[]): string {
//   // Prefer the standard name
//   if (names.includes('last_hidden_state')) return 'last_hidden_state';
//   // Otherwise pick the first name that doesn't look like past/present cache
//   for (const n of names) {
//     const s = n.toLowerCase();
//     if (
//       !s.includes('present') &&
//       !s.includes('past') &&
//       !s.includes('cache') &&
//       !s.includes('kv')
//     )
//       return n;
//   }
//   // Fallback: first one
//   return names[0];
// }

export function pickEmbedOutputName(names: string[]): string {
  console.log('[AI] Available outputs:', names);

  // ✅ PRIORITY 1: Use pre-pooled embeddings (simple tensors)
  const pooledOutputs = [
    'sentence_embedding',
    'pooler_output',
    'sentence_embeddings',
  ];

  for (const preferred of pooledOutputs) {
    if (names.includes(preferred)) {
      console.log(`[AI] ✅ Using pooled output: ${preferred}`);
      return preferred;
    }
  }

  // ⚠️ PRIORITY 2: Token-level outputs (will need manual pooling)
  if (names.includes('last_hidden_state')) {
    console.log('[AI] ⚠️ Using last_hidden_state (requires pooling)');
    return 'last_hidden_state';
  }

  // ❌ AVOID: Sequence types and cache
  for (const n of names) {
    const s = n.toLowerCase();
    if (
      !s.includes('present') &&
      !s.includes('past') &&
      !s.includes('cache') &&
      !s.includes('kv') &&
      !s.includes('token_embeddings') // Only exclude token_embeddings
      // ✅ REMOVED: !s.includes('sentence_embedding') - this was blocking the good output!
    ) {
      console.log(`[AI] Using fallback output: ${n}`);
      return n;
    }
  }

  throw new Error(`No suitable embedding output found in: ${names.join(', ')}`);
}

export async function initOnnx() {
  if (S.initialized) return;
  if (S.initPromise) return S.initPromise;

  console.log('[AI] init start uid=', S.uid);
  S.initPromise = (async () => {
    // file checks
    for (const p of [EMB, CAT, INT, LAB, VOCAB]) {
      if (!(await RNFS.exists(p))) throw new Error(`Missing model asset: ${p}`);
    }
    // sessions
    const [embS, catS, intS]: any = await Promise.all([
      InferenceSession.create(EMB, {executionProviders: ['cpu']}),
      InferenceSession.create(CAT, {executionProviders: ['cpu']}),
      InferenceSession.create(INT, {executionProviders: ['cpu']}),
    ]);
    S.embS = embS;
    S.catS = catS;
    S.intS = intS;
    console.log('[AI] emb outputs =', embS.outputNames);
    EMBED_OUT_NAME = pickEmbedOutputName(embS?.outputNames);
    console.log('[AI] using embed output =', EMBED_OUT_NAME);

    // labels + tokenizer
    S.labels = JSON.parse(await RNFS.readFile(LAB, 'utf8'));
    S.tokenizer = await WordPieceTokenizer.fromVocabFile(VOCAB);

    const t = S.tokenizer.encode('hello', 16);
    if (!t?.ids?.length) throw new Error('Tokenizer self-test failed');

    S.initialized = true;
    console.log('[AI] init done uid=', S.uid);
  })();

  try {
    await S.initPromise;
  } finally {
    if (!S.initialized) S.initPromise = null;
  }
}

export async function ensureOnnxReady() {
  if (S.initialized) return;
  await initOnnx();
}

export function _aiDebug() {
  console.log(
    '[AI] dbg uid=',
    S.uid,
    'initialized=',
    S.initialized,
    'tok?',
    !!S.tokenizer,
  );
}

function softmax(a: number[]) {
  const m = Math.max(...a),
    ex = a.map(v => Math.exp(v - m)),
    s = ex.reduce((p, c) => p + c, 0);
  return ex.map(v => v / s);
}
function argmax(a: number[]) {
  return a.indexOf(Math.max(...a));
}
function meanPool(flat: number[], seq: number, dim: number) {
  const out = new Array(dim).fill(0);
  for (let i = 0; i < seq; i++) {
    const b = i * dim;
    for (let j = 0; j < dim; j++) out[j] += flat[b + j];
  }
  for (let j = 0; j < dim; j++) out[j] /= seq;
  return out;
}

export async function classifyText(text: string) {
  if (!S.initialized) {
    if (!S.initPromise) throw new Error('ONNX not initialized');
    await S.initPromise;
    if (!S.initialized) throw new Error('ONNX init failed');
  }

  const enc = S.tokenizer!.encode(text, 128);
  const ids = BigInt64Array.from(enc.ids.map(i => BigInt(i)));
  const mask = BigInt64Array.from(enc.attentionMask.map(i => BigInt(i)));

  if (!EMBED_OUT_NAME) throw new Error('Embed output name not set');

  const embOut = await S.embS!.run(
    {
      input_ids: new Tensor('int64', ids, [1, enc.ids.length]),
      attention_mask: new Tensor('int64', mask, [1, enc.attentionMask.length]),
    },
    [EMBED_OUT_NAME],
  );

  const embTensor: any = embOut[EMBED_OUT_NAME];
  const data = embTensor.data as number[];
  const dims = embTensor.dims;

  let emb: number[];

  if (dims.length === 3) {
    emb = meanPool(data, dims[1], dims[2]);
  } else if (dims.length === 2) {
    emb = Array.from(data);
  } else if (dims.length === 1) {
    emb = Array.from(data);
  } else {
    throw new Error(`Unexpected embedding dimensions: ${dims}`);
  }

  const embT = new Tensor('float32', Float32Array.from(emb), [1, emb.length]);

  // ⭐ Category classifier - returns direct class index
  const cat: any = await S.catS!.run({float_input: embT}, ['output_label']);

  // Convert BigInt to number
  const ci = Number(cat.output_label.data[0]);
  const cprob = 1.0; // Model doesn't give us probabilities, so use 1.0

  // console.log(
  //   '[AI] Category index:',
  //   ci,
  //   'Category:',
  //   S.labels!.categories[ci],
  // );

  // ⭐ Intent classifier - same approach
  const it: any = await S.intS!.run({float_input: embT}, ['output_label']);

  const ii = Number(it.output_label.data[0]);
  const iprob = 1.0;

  // console.log('[AI] Intent index:', ii, 'Intent:', S.labels!.intents[ii]);

  return {
    category: S.labels!.categories[ci],
    categoryProb: cprob,
    intent: S.labels!.intents[ii],
    intentProb: iprob,
  };
}
