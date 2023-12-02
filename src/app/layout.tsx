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
        <div className="w-11/12 mx-auto pt-4 min-h-screen max-w-4xl flex flex-col justify-between">
          {/* Header - Body and SideBar here*/}
          <div className="flex flex-col gap-8">
            <header className="col-span-7">
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
