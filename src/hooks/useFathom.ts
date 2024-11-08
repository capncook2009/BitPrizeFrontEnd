import { DOMAINS } from "@shared/utilities";
import * as fathom from "fathom-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    const fathomSiteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID;
    const fathomSiteDomain = DOMAINS.hackathon.split("://")[1];

    const onRouteChangeComplete = () => {
      fathom.trackPageview();
    };

    if (!!fathomSiteId) {
      fathom.load(fathomSiteId, { includedDomains: [fathomSiteDomain] });

      router.events.on("routeChangeComplete", onRouteChangeComplete);

      return () => {
        router.events.off("routeChangeComplete", onRouteChangeComplete);
      };
    }
  }, []);
};
