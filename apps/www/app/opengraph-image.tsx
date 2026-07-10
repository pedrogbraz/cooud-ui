import { ImageResponse } from "next/og";
import { BLOCK_COUNT } from "../lib/blocks-index";
import { COMPONENT_COUNT } from "../lib/components-index";

export const alt = "Cooud UI — The design system that themes itself";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Aurora dark tokens, hardcoded as hex/rgba approximations — ImageResponse
// renders through Satori and cannot resolve the `--cooud-*` CSS variables.
// Source of truth: packages/tokens/src/tokens.ts (auroraDark).
const aurora = {
  surfaceBase: "#09090b",
  primary: "#0ea5e9",
  accent: "#06b6d4",
  fg: "#fafaf9",
  fgSecondary: "#a1a1aa",
  border: "rgba(255,255,255,0.10)",
  chipBg: "rgba(255,255,255,0.06)",
};

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: aurora.surfaceBase,
        position: "relative",
      }}
    >
      {/* Aurora glows */}
      <div
        style={{
          position: "absolute",
          top: -220,
          left: -160,
          width: 760,
          height: 620,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.30), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -240,
          right: -140,
          width: 760,
          height: 620,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(6,182,212,0.24), transparent 65%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 24,
            display: "flex",
            backgroundImage: `linear-gradient(135deg, ${aurora.primary}, ${aurora.accent})`,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 700,
            color: aurora.fg,
            letterSpacing: -4,
          }}
        >
          Cooud UI
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 36,
          color: aurora.fgSecondary,
        }}
      >
        The design system that themes itself
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 48,
          padding: "14px 28px",
          borderRadius: 14,
          border: `1px solid ${aurora.border}`,
          backgroundColor: aurora.chipBg,
          fontSize: 26,
          color: aurora.fgSecondary,
        }}
      >
        {`${COMPONENT_COUNT} components · ${BLOCK_COUNT} blocks · React · Tailwind v4`}
      </div>
    </div>,
    size,
  );
}
