import { Suspense } from "react";
import { LangProvider } from "@/components/LangProvider";
import { WaiterOrderView } from "@/components/WaiterOrderView";

export default async function WaiterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <LangProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-cream">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <WaiterOrderView orderId={id} />
      </Suspense>
    </LangProvider>
  );
}
