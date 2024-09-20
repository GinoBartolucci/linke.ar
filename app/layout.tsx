import type { Metadata } from "next";
import { Inter, Protest_Guerrilla, Mulish } from "next/font/google";
import "./globals.css";
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});
const protest_guerrilla = Protest_Guerrilla({
  subsets: ["latin"],
  variable: '--font-protestGuerrilla',
  display: 'swap',
  weight: "400"
})
const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: 'swap'
})
export const metadata: Metadata = {
  title: "linkear",
  description: "By Gino Bartolucci",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${protest_guerrilla.variable} ${mulish.variable}`}>
        <Providers>
          <div className="h-[80vh] ">
            {children}
          </div>
        </Providers>
        <footer className="flex flex-col justify-center aling-center h-[20vh]">
          <div className="flex justify-center p-5 text-2xl font-bold italic">By Gino Bartolucci </div>
          <div className="flex justify-center">
            <div className="flex space-x-6 mb-5">
              <a href="https://ginobartolucci.dev.ar" target="_blank" rel="noopener noreferrer">
                <FaGlobe className="hover:text-black w-8 h-8 text-gray-600" />
              </a>
              <a href="https://github.com/GinoBartolucci/linke.ar" target="_blank" rel="noopener noreferrer">
                <FaGithub className="hover:text-black w-8 h-8 text-gray-600" />
              </a>
              <a href="https://www.linkedin.com/in/ginobartolucci/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-black w-8 h-8 text-gray-600" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
