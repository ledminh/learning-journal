import Header from "@/ui/layout/Header";
import Footer from "@/ui/layout/Footer";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Learning Journal",
  description: "My documented learning journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-11/12 max-w-5xl min-h-screen gap-8 pt-4 mx-auto">
          {/* Header - Body and SideBar here*/}
          <div className="flex flex-col gap-8">
            <header>
              <Header />
            </header>
            {/* Body and SideBar here*/}
            {children}
          </div>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
