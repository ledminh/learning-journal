import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

import "./globals.css";
import { Inter } from "next/font/google";
import SideBar from "@/layout/SideBar";

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
        <div className="w-9/12 mx-auto my-4 grid grid-cols-4 gap-6">
          <header className="col-span-4">
            <Header />
          </header>
          <main className="col-span-3">{children}</main>
          <aside>
            <SideBar />
          </aside>
          <footer className="col-span-4">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
