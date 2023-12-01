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
        <div className="w-11/12 mx-auto pt-4 min-h-screen max-w-4xl flex flex-col justify-between">
          <div className="grid grid-cols-7 gap-10">
            <header className="col-span-7">
              <Header />
            </header>
            {/* @TODO: Make this responsive. In small screen, make aside on top of main */}
            <main className="col-span-5">{children}</main>
            <aside className="col-span-2">
              <SideBar />
            </aside>
          </div>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
