import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import {
  Inter,
  JetBrains_Mono,
  Bricolage_Grotesque,
} from 'next/font/google';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const brand = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-brand',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${brand.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider
          search={{
            options: {
              type: 'static',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
