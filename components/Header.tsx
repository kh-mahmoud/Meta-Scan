"use client";

import Link from "next/link";
import { LogIn, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

function Header() {
  const pathname = usePathname();
  const [isPricingPage, setIsPricingPage] = useState(false);
  const { isLoaded } = useUser();

  useEffect(() => {
    setIsPricingPage(pathname.startsWith("/pricing"));
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 ${
        isPricingPage ? "z-0 bg-transparent" : "z-50"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1">
          {!isLoaded && (
            <Button variant="outline">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
              <span className="sr-only">Loading...</span>
            </Button>
          )}

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">
                <LogIn className="size-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            
            <Link href="/dashboard">
              <Button variant="outline">
                <BarChart3 className="size-4" />
                <span className="sr-only md:not-sr-only md:ml-2">
                  Dashboard
                </span>
              </Button>
            </Link>

            <Button variant="ghost">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;
