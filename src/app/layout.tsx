import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ThemeProvider } from "@/lib/theme-provider"
import { AuthProvider } from '@/lib/AuthContext'
import Image from 'next/image'
import type { Metadata } from 'next'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  keywords: "Cryopreservation, Cryorepository, Cryo Repository, Cryoprotectants, Preservation, Cryobiology, Cryogenic Storage, Cold Storage, Biopreservation, Cryopreservation Research, CryoDAO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <AuthProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              <nav className="p-4 fixed w-full bg-(--sidebar) border-b-[0.5px] border-sidebar-border z-10">
                <SidebarTrigger variant={"outline"} className="cursor-pointer h-[36px] w-[36px]" />
              </nav>
              <div className="h-[68.5px] flex items-center fixed z-15 right-[18px]">
                <Image
                  src="/logo.png"
                  width={28}
                  height={28}
                  className="select-none pointer-events-none [html.light_&]:brightness-0"
                  alt="Logo Image"
                />
              </div>
              
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
    </AuthProvider>
  );
}