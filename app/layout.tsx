import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Energy Plan Recommendations',
  description: 'Find the perfect energy plan with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">
                  ⚡ Energy Plan Recommendations
                </h1>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-600 text-sm">
                AI-Powered Energy Plan Recommendations
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
