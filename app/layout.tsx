import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { ThemeProvider } from "../components/common/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "BUVA NATION AFRICA",
  description: "Talent thrives. Creativity builds. Brands shine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="text-[16px] md:text-[15px] lg:text-[14px]">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-mta-cream dark:bg-black text-mta-dark dark:text-mta-cream transition-colors duration-500`}>
        
        <ThemeProvider>
          {/* GLOBAL FIXED BACKGROUND (Only visible in dark mode) */}
          <div className="fixed inset-0 -z-50 hidden dark:block bg-black">
            <Image 
              src="/hero-bg.jpg" 
              alt="Global Background"
              fill
              priority
              unoptimized
              className="object-cover object-right lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"></div>
          </div>

          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}