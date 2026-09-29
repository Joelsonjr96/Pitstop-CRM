import { Inter, JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/branding";
import { BrandingProvider } from "@/components/providers/branding-provider";
import { ToasterProvider } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: brand.name,
  description: "Gerenciamento de pós-venda para oficinas",
  icons: {
    icon: brand.favicon || '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}>
      <body className="h-full bg-background text-foreground m-0 p-0 font-sans" style={{ '--primary': brand.primary } as React.CSSProperties}>
        <BrandingProvider branding={brand}>
          <ToasterProvider>
            {children}
          </ToasterProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}
