import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";

import Header from "@/components/Header";

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
        <Header />
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
