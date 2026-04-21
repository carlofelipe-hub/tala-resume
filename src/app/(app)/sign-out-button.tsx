"use client";

import { TalaButton } from "@/components/tala/tala-button";
import { signOut } from "../(auth)/actions";

export function SignOutButton() {
  return (
    <TalaButton variant="ghost" size="sm" onClick={() => signOut()}>
      Sign out
    </TalaButton>
  );
}
