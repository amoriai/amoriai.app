import RequireAuthClient from "../../RequireAuthClient";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { amoriaId: string } }) {
  return (
    <RequireAuthClient>
      <ChatClient amoriaId={params.amoriaId} />
    </RequireAuthClient>
  );
}
