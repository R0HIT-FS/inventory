import { connection } from "next/server";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { createProduct } from "./actions";

type ProductsPageProps = {
  searchParams: Promise<{
    error?: string;
    created?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  await connection();

  const { error, created } = await searchParams;

  const [products, categories, suppliers] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        unitPrice: true,
        quantityOnHand: true,
        reorderLevel: true,
        category: {
          select: { name: true },
        },
        suppliers: {
          select: {
            supplier: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const errorMessage =
    error === "duplicate-sku"
      ? "That SKU is already being used."
      : error === "related-record-missing"
        ? "A selected category or supplier no longer exists. Reload and try again."
        : error === "invalid"
          ? "Check the product details and try again."
          : null;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
        <p className="mt-2 text-slate-600">
          {products.length} product{products.length === 1 ? "" : "s"} in your
          inventory.
        </p>

        {categories.length === 0 ? (
          <p className="mt-8 rounded-md border bg-white p-4 text-slate-700">
            Add a category before creating a product.
          </p>
        ) : (
          <form
            action={createProduct}
            className="mt-8 grid gap-4 rounded-md border bg-white p-4"
          >
            <div>
              <label htmlFor="product-name" className="mb-1 block text-sm font-medium">
                Product name
              </label>
              <Input
                id="product-name"
                name="name"
                required
                maxLength={100}
                placeholder="For example, Wireless Mouse"
              />
            </div>

            <div>
              <label htmlFor="product-sku" className="mb-1 block text-sm font-medium">
                SKU
              </label>
              <Input
                id="product-sku"
                name="sku"
                required
                maxLength={100}
                placeholder="For example, MOUSE-001"
              />
            </div>

            <div>
              <label
                htmlFor="product-description"
                className="mb-1 block text-sm font-medium"
              >
                Description <span className="text-slate-500">(optional)</span>
              </label>
              <Input
                id="product-description"
                name="description"
                maxLength={1000}
                placeholder="Short product description"
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-1 block text-sm font-medium"
              >
                Category
              </label>
              <NativeSelect
                id="product-category"
                name="categoryId"
                required
                defaultValue=""
                className="w-full"
              >
                <NativeSelectOption value="" disabled>
                  Choose a category
                </NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption
                    key={category.id.toString()}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="mb-1 block text-sm font-medium"
              >
                Unit price
              </label>
              <Input
                id="product-price"
                name="unitPrice"
                type="number"
                min="0"
                max="9999999999.99"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="initial-quantity"
                className="mb-1 block text-sm font-medium"
              >
                Starting quantity
              </label>
              <Input
                id="initial-quantity"
                name="initialQuantity"
                type="number"
                min="0"
                step="1"
                required
                defaultValue="0"
              />
              <p className="mt-1 text-xs text-slate-500">
                A positive starting quantity is recorded as an initial stock
                receipt.
              </p>
            </div>

            <div>
              <label
                htmlFor="reorder-level"
                className="mb-1 block text-sm font-medium"
              >
                Low-stock alert level
              </label>
              <Input
                id="reorder-level"
                name="reorderLevel"
                type="number"
                min="0"
                step="1"
                required
                defaultValue="5"
              />
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">
                Suppliers <span className="text-slate-500">(optional)</span>
              </legend>

              {suppliers.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No suppliers are available yet.
                </p>
              ) : (
                suppliers.map((supplier) => {
                  const supplierId = supplier.id.toString();

                  return (
                    <label
                      key={supplierId}
                      htmlFor={`supplier-${supplierId}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        id={`supplier-${supplierId}`}
                        name="supplierIds"
                        value={supplierId}
                      />
                      {supplier.name}
                    </label>
                  );
                })
              )}
            </fieldset>

            {errorMessage && (
              <p className="text-sm text-red-700">{errorMessage}</p>
            )}

            <Button type="submit" className="w-fit">
              <Plus aria-hidden="true" />
              Add product
            </Button>
          </form>
        )}

        {created === "1" && (
          <p className="mt-3 text-sm text-green-700">Product added.</p>
        )}

        <ul className="mt-8 divide-y divide-slate-200 rounded-md border bg-white">
          {products.length === 0 ? (
            <li className="p-4 text-slate-600">No products yet.</li>
          ) : (
            products.map((product) => {
              const supplierNames = product.suppliers
                .map((link) => link.supplier.name)
                .join(", ");

              const isLowStock =
                product.quantityOnHand <= product.reorderLevel;

              return (
                <li
                  key={product.id.toString()}
                  className="flex flex-wrap justify-between gap-4 p-4 text-slate-900"
                >
                  <div>
                    <h2 className="font-medium">{product.name}</h2>
                    <p className="text-sm text-slate-600">SKU: {product.sku}</p>
                    <p className="mt-2 text-sm">
                      Category: {product.category.name}
                    </p>
                    <p className="text-sm">
                      Suppliers: {supplierNames || "None assigned"}
                    </p>
                  </div>

                  <div className="text-sm sm:text-right">
                    <p className="font-medium">
                      ${product.unitPrice.toFixed(2)}
                    </p>
                    <p className="mt-2">
                      In stock: {product.quantityOnHand}
                    </p>
                    <p>
                      Reorder level: {product.reorderLevel}
                      {isLowStock && (
                        <span className="ml-2 font-medium text-amber-700">
                          Low stock
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}