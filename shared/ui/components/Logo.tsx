import classNames from "classnames";

export interface LogoProps {
  className?: string;
  smLogoClassName?: string;
  mdLogoClassName?: string;
}

export const Logo = (props: LogoProps) => {
  const { className, smLogoClassName, mdLogoClassName } = props;

  return (
    <>
      <img src="/logo-bitprize.jpg" style={{ width: 25, height: 25 }}></img>
    </>
  );
};
