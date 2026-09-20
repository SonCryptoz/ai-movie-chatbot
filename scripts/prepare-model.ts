/* scripts/prepare-model.ts */
import path from "path";

// If building on Vercel, skip pre-downloading model (Vercel is only for frontend)
if (process.env.VERCEL) {
    console.log("⚡ VERCEL detected: Skipping Xenova model download (Frontend only build).");
    process.exit(0);
}

async function prepare() {
    console.log("📥 Preparing Xenova/all-MiniLM-L6-v2 model for offline fast load...");

    const { pipeline, env } = await import("@xenova/transformers");

    const modelsDir = path.join(process.cwd(), "models");

    env.cacheDir = modelsDir;
    env.localModelPath = modelsDir;
    env.allowLocalModels = true;
    env.allowRemoteModels = true;

    const start = Date.now();
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    // Quick verification
    await embedder("Test embedding initialization", {
        pooling: "mean",
        normalize: true,
    });

    console.log(`✅ Model ready on disk at '${modelsDir}'! Took: ${Date.now() - start}ms`);
}

prepare().catch((err) => {
    console.warn("⚠️ Warning: Could not pre-cache model during build:", err);
    // Don't crash build if network temporarily fails; runtime will try remote fallback
    process.exit(0);
});
