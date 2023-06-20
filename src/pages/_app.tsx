import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.ALCHEMY_ID,
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID!,
    appName: "SIWE Auth Demo",
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <AuthProvider>
          <Header />
          <Component {...pageProps} />
        </AuthProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
