import RNFS from 'react-native-fs';

const DEST_DIR = `${RNFS.DocumentDirectoryPath}/models`;
const FILES = [
  'model_quant.onnx',
  'category_clf.onnx',
  'intent_clf.onnx',
  'labels.json',
  'vocab.txt',
];

// Android: copy from APK assets using copyFileAssets("relative/path/in/assets")
export async function ensureModelsInstalled(): Promise<string> {
  if (!(await RNFS.exists(DEST_DIR))) await RNFS.mkdir(DEST_DIR);

  // if already copied, skip
  const marker = `${DEST_DIR}/labels.json`;
  if (await RNFS.exists(marker)) return DEST_DIR;

  for (const name of FILES) {
    const srcInApk = `models/${name}`; // relative to android/app/src/main/assets
    const dst = `${DEST_DIR}/${name}`;
    await RNFS.copyFileAssets(srcInApk, dst);
  }
  return DEST_DIR;
}
