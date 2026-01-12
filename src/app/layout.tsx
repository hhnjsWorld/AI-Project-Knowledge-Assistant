import "./globals.css";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";

const notoSans = Noto_Sans_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "AI Project Knowledge Assistant",
  description: "Knowledge Assistant powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
