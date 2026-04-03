import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TwitterImage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title ?? "Case Study";
  const summary = project?.summary ?? "";
  const category = project?.category ?? "";
  const stack = (project?.stack ?? []).slice(0, 6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101624",
          backgroundImage:
            "radial-gradient(900px 420px at 18% 22%, rgba(99, 210, 180, 0.28), transparent 60%), radial-gradient(900px 420px at 82% 78%, rgba(35, 41, 70, 0.9), transparent 55%)",
          padding: 72,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 36,
            border: "1px solid rgba(99, 210, 180, 0.28)",
            background: "linear-gradient(180deg, rgba(35, 41, 70, 0.82), rgba(16, 22, 36, 0.92))",
            padding: 72,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "rgba(255, 255, 255, 0.88)",
                fontSize: 26,
                letterSpacing: 0.2,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#63d2b4",
                  boxShadow: "0 0 0 8px rgba(99, 210, 180, 0.14)",
                }}
              />
              <span>{category ? `${category} Case Study` : "Case Study"}</span>
            </div>

            <div
              style={{
                fontSize: 68,
                lineHeight: 1.05,
                fontWeight: 750,
                letterSpacing: -1.2,
                color: "#ffffff",
              }}
            >
              {title}
            </div>

            {summary ? (
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.25,
                  color: "rgba(255, 255, 255, 0.78)",
                  maxWidth: 980,
                }}
              >
                {summary}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {stack.map((label) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(16, 22, 36, 0.55)",
                    color: "rgba(255,255,255,0.82)",
                    fontSize: 20,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 22,
              }}
            >
              haroonimran.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
