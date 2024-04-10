import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NavBarVertical } from "@/components/static/frames/NavBarVertical";
import { NavBarHorizontal } from "@/components/static/frames/NavBarHorizontal";
import { Toaster } from "@/components/ui/toaster";

const font = Poppins({ weight: "400", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex flex-col h-screen">
          <NavBarHorizontal />
          <div className="flex flex-grow">
            <NavBarVertical />
              <main className="flex flex-grow justify-start mt-12">
                {children}
                 <Toaster />
              </main>
          </div>
        </div>
      </body>
    </html>
  );
}
