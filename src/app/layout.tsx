import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/(utility)/themeProvider";
import Navbar from "@/components/(core)/Navbar";
import Footer from "@/components/(core)/Footer";
import { Toaster } from "@/components/ui/sonner";
import MaintenancePage from "@/components/(core)/Maintenance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Air Quality Prediction",
  description: "Predict air quality based on pollutant data or get current conditions by location",
};

const UNDER_MAINTENANCE = process.env.MAINTENANCE_MODE

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {UNDER_MAINTENANCE ? (
            <MaintenancePage />
          ) : (
            <>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
