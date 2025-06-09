import { PropsWithChildren } from "react";
import { Header } from "../common/header";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  );
}
