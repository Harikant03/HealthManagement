import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/Redux/provider/provider";
// Header ko import karein (Path check karlein apne folder ke hisaab se)
import Header from "@/components/Header/page";
import Sidebar from "@/components/sideBar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Admin Panel",
  description: "Manage doctors and appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // Pehle se hoga, ise rehne dein
    >
      <body 
        className="min-h-full flex flex-col bg-gray-50" 
        suppressHydrationWarning={true} // YAHAN ADD KAREIN
      >
        <ReduxProvider>
          {/* <Header />
          <Sidebar/> */}
          <main className="flex-1 container mx-auto p-6">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}