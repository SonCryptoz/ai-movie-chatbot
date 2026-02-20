import {
    pipeline,
    env,
    type FeatureExtractionPipeline,
} from "@xenova/transformers";

// dùng WASM backend (tránh libonnxruntime.so)
env.backends.onnx.wasm.wasmPaths =
    "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
env.backends.onnx.wasm.numThreads = 1; // quan trọng cho serverless
env.allowLocalModels = false;
env.useBrowserCache = false;

let embedder: FeatureExtractionPipeline | null = null;
let loadingPromise: Promise<FeatureExtractionPipeline> | null = null;

/**
 * Load embedding model once (singleton)
 */
async function getEmbedder(): Promise<FeatureExtractionPipeline> {
    if (embedder) return embedder;

    if (!loadingPromise) {
        console.log("🔄 Loading embedding model...");
        loadingPromise = pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2",
        ) as Promise<FeatureExtractionPipeline>;
    }

    embedder = await loadingPromise;
    return embedder;
}

/**
 * Embed a single text
 */
export async function embedText(text: string): Promise<number[]> {
    const model = await getEmbedder();

    const output = await model(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data as Float32Array);
}

/**
 * Embed multiple texts (batch)
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const model = await getEmbedder();

    const output = await model(texts, {
        pooling: "mean",
        normalize: true,
    });

    const data = output.data as Float32Array;
    const dim = data.length / texts.length;

    if (!Number.isInteger(dim)) {
        throw new Error("Embedding dimension mismatch");
    }

    const vectors: number[][] = [];

    for (let i = 0; i < texts.length; i++) {
        vectors.push(Array.from(data.slice(i * dim, (i + 1) * dim)));
    }

    return vectors;
};