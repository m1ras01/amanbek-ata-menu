import { Suspense } from "react";
import { MenuPage } from "@/components/MenuPage";
import { LangProvider } from "@/components/LangProvider";
import { CartProvider } from "@/components/CartProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getPublicMenu } from "@/lib/menu-store";

export default async function Home() {
  const menu = await getPublicMenu();

  return (
    <ThemeProvider>
      <LangProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-cream">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
            </div>
          }
        >
          <CartProvider>
            <MenuPage
              settings={menu.settings}
              categories={menu.categories}
              dishes={menu.dishes}
            />
          </CartProvider>
        </Suspense>
      </LangProvider>
    </ThemeProvider>
  );
}
