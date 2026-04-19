import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          fontSize: 48,
          lineHeight: 1,
        }}
      >
        {siteConfig.faviconEmoji}
      </div>
    ),
    {
      ...size,
    }
  );
}
