import type { FC, ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

const PageWrapper: FC<PageWrapperProps> = ({ children, className = "" }) => (
  <div className={`w-full px-4 sm:px-6 ${className}`}>{children}</div>
);

export default PageWrapper;
