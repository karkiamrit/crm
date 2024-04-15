import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthWrapper from "@/wrappers/AuthProvider";

const font = Poppins({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={font.className}>
        <AuthWrapper>
          <div className="flex h-screen overflow-hidden">
            <main className=" w-full">
              {children}
              <Toaster />
            </main>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}