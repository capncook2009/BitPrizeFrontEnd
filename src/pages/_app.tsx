import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IncomingMessage } from "http";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import App from "next/app";
import { WagmiProvider } from "wagmi";
import { AppContainer } from "@components/AppContainer";
// import { SUPPORTED_NETWORKS } from "@constants/config";
import { ptRainbowTheme } from "@constants/theme";
import { useFathom } from "@hooks/useFathom";
import "../styles/globals.css";
import { createCustomWagmiConfig } from "../utils";
// import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "viem/chains";
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// React Query Client:
const queryClient = new QueryClient();

// const networks = [
//   ...SUPPORTED_NETWORKS.mainnets,
//   ...SUPPORTED_NETWORKS.testnets,
// ];
const wagmiConfig = createCustomWagmiConfig();

export interface CustomAppProps {
  serverProps: {
    params: { [key: string]: string };
  };
}

export default function MyApp(props: AppProps & CustomAppProps) {
  useFathom();

  return (
    // <PrivyProvider
    //   appId={
    //     process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cm32zqjw30195xj9yhsbxz760"
    //   }
    //   config={{
    //     loginMethods: ["telegram", "google"],
    //     supportedChains: [base],
    //   }}
    // >
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={ptRainbowTheme()}
          showRecentTransactions={true}
          appInfo={{ appName: "BitPrize" }}
        >
          <AppContainer {...props} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    // </PrivyProvider>
  );
}

MyApp.getInitialProps = async (
  appCtx: AppContext
): Promise<AppInitialProps & CustomAppProps> => {
  const initialProps = await App.getInitialProps(appCtx);

  const internalReqKey = Symbol.for("NextInternalRequestMeta");
  interface NextIncomingMessage extends IncomingMessage {
    [internalReqKey]: {
      match: { params: { [key: string]: string } };
    };
  }
  const req = appCtx.ctx.req as NextIncomingMessage | undefined;
  const { match } = req?.[internalReqKey] ?? {};
  const serverProps = { params: match?.params ?? {} };

  return { ...initialProps, serverProps };
};
