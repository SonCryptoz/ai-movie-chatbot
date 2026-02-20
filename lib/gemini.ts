import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function askGemini(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0,
            maxOutputTokens: 3200, // allow for a longer response to include more recommendations and details
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    recommendations: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                id: { type: SchemaType.NUMBER },
                                title: { type: SchemaType.STRING },
                                year: { type: SchemaType.NUMBER },
                                genres: {
                                    type: SchemaType.ARRAY,
                                    items: { type: SchemaType.STRING },
                                },
                                rating: { type: SchemaType.NUMBER },
                                popularity: { type: SchemaType.NUMBER },
                                runtime: { type: SchemaType.NUMBER },
                                language: { type: SchemaType.STRING },
                                source: { type: SchemaType.STRING },
                                reason: { type: SchemaType.STRING },
                            },
                            required: [
                                "id",
                                "title",
                                "year",
                                "genres",
                                "rating",
                                "popularity",
                                "runtime",
                                "language",
                                "source",
                                "reason",
                            ],
                        },
                    },

                    genres: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                name: { type: SchemaType.STRING },
                                value: { type: SchemaType.NUMBER },
                            },
                            required: ["name", "value"],
                        },
                    },

                    radar: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                metric: { type: SchemaType.STRING },
                                score: { type: SchemaType.NUMBER },
                            },
                            required: ["metric", "score"],
                        },
                    },

                    ratings: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                label: { type: SchemaType.STRING },
                                rating: { type: SchemaType.NUMBER },
                            },
                            required: ["label", "rating"],
                        },
                    },
                },
                required: ["recommendations", "genres", "radar", "ratings"],
            },
        },
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
};