import type { RetrievedMovie } from "./retriever";

export function buildMoviePrompt(
    question: string,
    movies: RetrievedMovie[],
): string {
    const context = movies
        .map(
            (m) => `ID: ${m.id}
Title: ${m.title}
Year: ${m.year}
Genres: ${m.genres.join(", ")}
Rating: ${m.rating}
Popularity: ${m.popularity}
Runtime: ${m.runtime}
Language: ${m.language}
Source: ${m.source}
Overview: ${m.content.slice(0, 150)}`,
        )
        .join("\n\n");

    return `
You are a movie recommendation engine.

You are given a fixed list of movies. You MUST ONLY choose from this list.

Movies:
${context}

User query:
"${question}"

TASKS:

1. Decide how many movies to return:
   - If the query explicitly mentions a number (e.g. "2 movies", "two movies") → return exactly that many.
   - Else if the query uses plural words ("movies", "some", "recommend", "suggest") → return UP TO 2 movies.
   - Else → return ONLY 1 movie.

2. Select the best matching movies based on the meaning of the query.

3. Build UI data.

OUTPUT FORMAT:
You must output valid JSON following this schema:

{
  "recommendations": [
    {
      "id": number,
      "title": string,
      "year": number,
      "genres": string[],
      "rating": number,
      "popularity": number,
      "runtime": number,
      "language": string,
      "source": string,
      "reason": string
    }
  ],
  "genres": [{ "name": string, "value": number }],
  "radar": [{ "metric": string, "score": number }],
  "ratings": [{ "label": string, "rating": number }]
}

RULES:
- Do NOT invent movies.
- Use ONLY movie IDs from the list.
- "recommendations" length must match rule (1).
- "reason" must be ONE natural short sentence (max 120 characters) explaining why it fits the query.
- "radar" must contain exactly 5 metrics:
  Story, Visuals, Emotion, Action, Humor (0-100).
- "ratings.label" must be the movie year as a string.
- NEVER put line breaks inside string values.
- Output JSON ONLY. No explanations. No markdown. No extra text.
- Close all JSON brackets properly.

`.trim();
};