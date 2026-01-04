import "../styles/globals.css";
import { Footer, Navbar } from "../components";
import { Providers } from "./providers";

export const metadata = {
  title: "AGI House India",
  description:
    "AGI House India - A community of AI enthusiasts shaping the future of artificial intelligence",
  openGraph: {
    title: "AGI House India",
    description:
      "Join India's premier AI community. Connect, learn and grow with fellow AI enthusiasts.",
    url: "https://agihouse.in",
    type: "website",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AGI House India",
    description:
      "Join India's premier AI community. Connect, learn and grow with fellow AI enthusiasts.",
    images: ["/og-image.png"],
  },
  keywords: "AGI, artificial intelligence, AI community, India, technology",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://stijndv.com" />
      <link
        rel="stylesheet"
        href="https://stijndv.com/fonts/Eudoxus-Sans.css"
      />
    </head>
    <body>
      <Providers>
        <div className="bg-primary-black overflow-hidden min-h-screen">
          <Navbar />
          {children}
          <Footer />
        </div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
