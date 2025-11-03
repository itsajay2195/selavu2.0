import {ensureModelsInstalled} from '../onnx/installModels.android'; // or .ts if shared
import {initOnnx} from '../onnx/onnxManager';

let _initPromise: Promise<void> | null = null;

export function ensureAiReady(): Promise<void> {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const dir = await ensureModelsInstalled();
    console.log('[AI] models at', dir);
    await initOnnx();
    console.log('[AI] ready ✅');
  })();
  return _initPromise;
}
