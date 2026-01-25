import type { FC, ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

const PageWrapper: FC<PageWrapperProps> = ({ children, className = "" }) => (
  <div className={`mx-auto w-[90vw] max-w-[1200px] px-2 ${className}`}>{children}</div>
);

export default PageWrapper;
