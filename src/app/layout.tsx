import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AudioProvider } from "@/lib/audio-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "LOADCAST | Electricity Demand Forecasting & Grid Intelligence",
  description:
    "Teaching a regression model to see tomorrow's electricity demand using yesterday's patterns. An open-source energy intelligence platform for Rajasthan and Indian power grids.",
  keywords: [
    "electricity demand forecasting",
    "energy intelligence",
    "time series machine learning",
    "ridge regression",
    "rajasthan power grid",
    "posoco power consumption",
  ],
  authors: [{ name: "LoadCast Team" }],
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen">
        <ThemeProvider>
          <AudioProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
