import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getAllPerfumes, getRecommendationsFor } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const perfumes = getAllPerfumes();
  const source = perfumes.find((p) => p.id === id);

  if (!source) {
    return new Response("Perfume not found", { status: 404 });
  }

  const byId = new Map(perfumes.map((p) => [p.id, p]));
  const matches = getRecommendationsFor(source.id)
    .slice(0, 4)
    .map((m) => byId.get(m.id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #2b1a12 0%, #4a2e1a 45%, #6b4423 100%)",
          color: "#fdf3e7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, opacity: 0.75, letterSpacing: 2 }}>NOTE MATCH</div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 12 }}>{source.brand}</div>
          <div style={{ fontSize: 40, opacity: 0.9 }}>{source.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 24, opacity: 0.8 }}>Similar scents to try:</div>
          {matches.map((m) => (
            <div key={m.id} style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>
              {m.brand} {m.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
