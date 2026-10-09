import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const alt = "Noah's Detailing — Noble & Mobile. Mobile detailing in Harrisonburg, VA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><defs><linearGradient id="f" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#3D7BFF"/><stop offset="1" stop-color="#1A4FD6"/></linearGradient></defs><path d="M30 10H170Q190 10 190 30V170Q190 205 100 250Q10 205 10 170V30Q10 10 30 10Z" fill="url(#f)"/><path d="M36 20H164Q180 20 180 36V168Q180 198 100 238Q20 198 20 168V36Q20 20 36 20Z" fill="none" stroke="#EAF2FF" stroke-opacity=".6" stroke-width="3"/><g transform="translate(22 92) scale(.78)" fill="none" stroke="#EAF2FF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 66V46H92L102 22H134L150 42L182 46Q189 47 189 54V64Q189 67 186 67H170A18 18 0 0 0 134 67H70A18 18 0 0 0 34 67H15Q12 67 12 66Z"/><path d="M106 27H118V42H100Z"/><path d="M122 27H132L144 42H122Z"/><circle cx="152" cy="67" r="12"/><circle cx="52" cy="67" r="12"/></g></svg>`;

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800").then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadFont();
  const display = font ? "Barlow" : "sans-serif";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          gap: 64,
          background: "radial-gradient(70% 90% at 85% 10%, rgba(46,107,255,0.45), transparent 70%), linear-gradient(180deg, #0b1220, #07090D)",
          color: "#EAF2FF",
        }}
      >
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`} width={250} height={325} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#5AA2FF", fontWeight: 700 }}>NOAH&apos;S DETAILING</div>
          <div style={{ fontFamily: display, fontStyle: "italic", fontWeight: 800, fontSize: 150, lineHeight: 0.9, marginTop: 18, textTransform: "uppercase" }}>
            Noble &amp;
          </div>
          <div style={{ fontFamily: display, fontStyle: "italic", fontWeight: 800, fontSize: 150, lineHeight: 0.9, textTransform: "uppercase", display: "flex" }}>
            Mobile<span style={{ color: "#5AA2FF" }}>.</span>
          </div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#8A97AB", display: "flex" }}>
            {`Mobile Detailing · ${site.city}, ${site.region}`}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Barlow", data: font, style: "italic", weight: 800 }] : undefined },
  );
}
