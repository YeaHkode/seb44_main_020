import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import StyledComponentsRegistry from '@/lib/registry';
import GlobalStyle from '@/styles/Globalstyle';
import { StyledRoot } from '@/styles/style';
import { Inter } from 'next/font/google';
import { Providers } from '@/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MoovDa',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <StyledComponentsRegistry>
            <StyledRoot>
              <GlobalStyle />
              <Header />
              {children}
              <Footer />
            </StyledRoot>
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
