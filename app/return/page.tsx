import { redirect } from "next/navigation";

export default function ReturnPage({ searchParams }: { searchParams: any }) {
  const lang = searchParams?.lang ?? "en";
  const session_id = searchParams?.session_id ?? "";
  redirect(`/checkout/success?lang=${lang}${session_id ? `&session_id=${session_id}` : ""}`);
}
