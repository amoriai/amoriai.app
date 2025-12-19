import type { Metadata } from "next";
import PostSignupClient from "./PostSignupClient";

export const metadata: Metadata = {
  title: "Création du compte…",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PostSignupClient />;
}
