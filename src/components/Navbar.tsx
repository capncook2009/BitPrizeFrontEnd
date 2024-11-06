import { Bars3Icon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MODAL_KEYS, useIsModalOpen } from "@shared/generic-react-hooks";
import { Logo } from "@shared/ui";
import classNames from "classnames";
import { Navbar as FlowbiteNavbar } from "flowbite-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface NavbarLink {
  href: string;
  name: string;
  icon: string;
}

export const Navbar = () => {
  const t_nav = useTranslations("Navigation");
  const router = useRouter();

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(
    MODAL_KEYS.settings
  );

  const navLinks: NavbarLink[] = [
    {
      href: "/vaults",
      name: "Deposit",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M480-80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-320L280-600l56-56 104 103v-327h80v327l103-103 57 56-200 200Z"/></svg>',
    },
    {
      href: "/games",
      name: "Get Lucky!",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M640-260q25 0 42.5-17.5T700-320q0-25-17.5-42.5T640-380q-25 0-42.5 17.5T580-320q0 25 17.5 42.5T640-260ZM480-420q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420ZM320-580q25 0 42.5-17.5T380-640q0-25-17.5-42.5T320-700q-25 0-42.5 17.5T260-640q0 25 17.5 42.5T320-580ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
    },
    {
      href: "/account",
      name: "Profile",
      icon: "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='black'><path d='M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z' /></svg>",
    },
  ];

  return (
    <>
      <FlowbiteNavbar
        fluid={true}
        theme={{
          root: {
            base: "bg-pt-bg-purple-darker text-pt-purple-50 px-8 py-4 border-b-2 border-b-pt-purple-700 border-opacity-0 isolate z-50",
          },
        }}
        className="font-grotesk"
      >
        {/* Left Side Branding */}
        <Link href="/" className="cursor-pointer z-30">
          {/* <Logo smLogoClassName='w-8' mdLogoClassName='w-[150px]' /> */}
          {/* BitPrize */}
          <h2
            className="text-3xl font-medium md:text-5xl "
            style={{ color: "#c2410c" }}
          >
            BitPrize
          </h2>
        </Link>

        {/* Middle Content */}
        <div className="hidden grow pl-8 gap-8 z-10 md:flex lg:absolute lg:w-full lg:justify-center lg:pr-16 lg:pl-0">
          <NavbarLinks links={navLinks} />
        </div>

        {/* Right Side Content */}
        <div className="flex gap-2 items-center z-20">
          <ConnectButton
            showBalance={false}
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            accountStatus="full"
          />
          {/* <Bars3Icon
            className="h-6 w-6 text-pt-purple-50 hover:text-pt-purple-200 cursor-pointer"
            onClick={() => setIsSettingsModalOpen(true)}
          /> */}
        </div>
      </FlowbiteNavbar>

      {/* nav bar for prizes page */}
      {router.pathname === "/games" || router.pathname === "/referral" ? (
        <div className="grid max-w-lg grid-cols-2 mx-auto font-medium rounded-md overflow-hidden bg-slate-200">
          <Link
            href="/games"
            className={classNames(
              "inline-flex p-3 flex-col items-center justify-center px-5 hover:bg-pt-purple-500 group",
              {
                "bg-slate-400 md:!text-pt-teal": router.pathname === "/games",
              }
            )}
          >
            <span className="text-xs font-medium group-hover:text-pt-purple-200">
              Games
            </span>
          </Link>
          <Link
            href="/referral"
            className={classNames(
              "inline-flex p-3 flex-col items-center justify-center px-5 hover:bg-pt-purple-500 group",
              {
                "bg-slate-400 md:!text-pt-teal":
                  router.pathname === "/referral",
              }
            )}
          >
            <span className="text-xs font-medium group-hover:text-pt-purple-200">
              Refer
            </span>
          </Link>
        </div>
      ) : (
        <></>
      )}

      <MobileNavbar className="z-50">
        <NavbarLinks links={[...navLinks]} />
      </MobileNavbar>
    </>
  );
};

interface NavbarLinksProps {
  links: NavbarLink[];
}

const NavbarLinks = (props: NavbarLinksProps) => {
  const { links } = props;

  const router = useRouter();

  return (
    <>
      {links.map((link, i) => (
        <Link
          key={`nav-${i}-${link.name.toLowerCase()}`}
          href={link.href}
          className={classNames(
            " inline-flex flex-col items-center justify-center p-3",
            "hover:bg-pt-purple-500 group",
            {
              "bg-slate-400 md:!text-pt-teal": link.href === router.pathname,
            }
          )}
        >
          <div
            className="md:hidden"
            dangerouslySetInnerHTML={{ __html: link.icon }}
          />
          <span
            className={classNames(
              "text-xs font-medium",
              "group-hover:text-pt-purple-200",
              {
                "text-pt-teal": link.href === router.pathname,
              }
            )}
          >
            {link.name}
          </span>
        </Link>
      ))}
    </>
  );
};

interface MobileNavbarProps {
  children?: ReactNode;
  className?: string;
}

const MobileNavbar = (props: MobileNavbarProps) => {
  const { children, className } = props;
  const router = useRouter();

  return (
    <div
      className={classNames(
        "fixed bottom-0 left-0 z-50 w-full",
        "bg-pt-purple-600 border-t-2 border-pt-purple-500",
        "md:hidden",
        className
      )}
    >
      <div className="grid max-w-lg grid-cols-3 mx-auto font-medium">
        {children}
      </div>
    </div>
  );
};
