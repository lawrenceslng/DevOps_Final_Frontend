import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* ✅ This injects runtime config before app loads */}
        <script src="/env-config.js" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
