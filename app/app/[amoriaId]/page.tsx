import { redirect } from "next/navigation";

export default function AmoriaRedirectPage({
  params,
}: {
  params: { amoriaId: string };
}) {
  redirect(`/chat?amoriaId=${params.amoriaId}`);
}
