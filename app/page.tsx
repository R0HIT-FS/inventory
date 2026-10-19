import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Render this page for a request so the database count stays fresh.
  await connection();

  // Ask PostgreSQL to count rows in the products table.
  const productCount = await prisma.product.count();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-900">
          Inventory dashboard
        </h1>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">
            {productCount}
          </p>
        </div>
      </section>
    </main>
  );
}