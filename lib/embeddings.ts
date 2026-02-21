import type { FeatureExtractionPipeline } from "@xenova/transformers";

let embedder: FeatureExtractionPipeline | null = null;
let loadingPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
    if (embedder) return embedder;

    if (!loadingPromise) {
        loadingPromise = (async () => {
            process.env.TRANSFORMERS_BACKEND = "wasm";

            const { pipeline, env } = await import("@xenova/transformers");

            env.backends.onnx.wasm.wasmPaths =
                "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
            env.backends.onnx.wasm.numThreads = 1;
            env.allowLocalModels = false;
            env.useBrowserCache = false;

            console.log("🔄 Loading embedding model...");
            return await pipeline(
                "feature-extraction",
                "Xenova/all-MiniLM-L6-v2",
            );
        })();
    }

    embedder = await loadingPromise;
    return embedder;
}

/** Embed 1 câu */
export async function embedText(text: string): Promise<number[]> {
    const model = await getEmbedder();
    const output = await model(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data as Float32Array);
}

/** Embed nhiều câu */
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