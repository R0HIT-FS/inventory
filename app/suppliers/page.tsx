import { connection } from "next/server";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupplier } from "./actions";
import { SupplierRow } from "./supplier-row";

type SuppliersPageProps = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    updated?: string;
    deleted?: string;
  }>;
};

export default async function SuppliersPage({
  searchParams,
}: SuppliersPageProps) {
  await connection();

  const { error, created, updated, deleted } = await searchParams;
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

  const errorMessage =
    error === "duplicate"
      ? "A supplier with that name already exists."
      : error === "invalid"
      ? "Enter a supplier name."
      : error === "missing"
      ? "That supplier no longer exists."
      : null;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Suppliers</h1>
        <p className="mt-2 text-slate-600">
          Keep track of the businesses that provide your products.
        </p>

        <form
          action={createSupplier}
          className="mt-8 grid gap-4 rounded-md border bg-white p-4"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Supplier name
            </label>
            <Input
              id="name"
              name="name"
              required
              maxLength={100}
              placeholder="For example, Acme Supplies"
            />
          </div>

          <div>
            <label
              htmlFor="contactName"
              className="mb-1 block text-sm font-medium"
            >
              Contact person <span className="text-slate-500">(optional)</span>
            </label>
            <Input
              id="contactName"
              name="contactName"
              maxLength={100}
              placeholder="For example, Jordan Lee"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email <span className="text-slate-500">(optional)</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              maxLength={255}
              placeholder="jordan@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone <span className="text-slate-500">(optional)</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              maxLength={50}
              placeholder="+1 555 0100"
            />
          </div>

          <Button type="submit" className="w-fit">
            <Plus aria-hidden="true" />
            Add supplier
          </Button>
        </form>

        {errorMessage && (
          <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
        )}

        {created === "1" && (
          <p className="mt-3 text-sm text-green-700">Supplier added.</p>
        )}

        {updated === "1" && (
          <p className="mt-3 text-sm text-green-700">Supplier updated.</p>
        )}

        {deleted === "1" && (
          <p className="mt-3 text-sm text-green-700">Supplier deleted.</p>
        )}

        <ul className="mt-8 divide-y divide-slate-200 rounded-md border bg-white">
          {suppliers.length === 0 ? (
            <li className="p-4 text-slate-600">No suppliers yet.</li>
          ) : (
            suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id.toString()}
                supplier={{
                  id: supplier.id.toString(),
                  name: supplier.name,
                  contactName: supplier.contactName,
                  email: supplier.email,
                  phone: supplier.phone,
                }}
              />
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
