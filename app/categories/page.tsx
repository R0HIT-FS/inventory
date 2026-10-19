// import { connection } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { createCategory, updateCategory } from "./actions";
// import { DeleteCategoryForm } from "./delete-category-form";

// type CategoriesPageProps = {
//   searchParams: Promise<{
//     error?: string;
//     created?: string;
//     updated?: string;
//     deleted?: string;
//   }>;
// };

// export default async function CategoriesPage({
//   searchParams,
// }: CategoriesPageProps) {
//   await connection();

//   const { error, created, updated, deleted } = await searchParams;

//   const categories = await prisma.category.findMany({
//     orderBy: { name: "asc" },
//   });

//   const errorMessage =
//     error === "duplicate"
//       ? "That category name already exists."
//       : error === "invalid"
//       ? "Enter a valid category name."
//       : error === "has-products"
//       ? "This category is assigned to products. Reassign them before deleting."
//       : error === "missing"
//       ? "That category no longer exists."
//       : null;

//   return (
//     <main className="min-h-screen bg-slate-50 p-8">
//       <section className="mx-auto max-w-3xl">
//         <h1 className="text-3xl font-semibold text-slate-900">Categories</h1>
//         <p className="mt-2 text-slate-600">Organize products into groups.</p>

//         <form action={createCategory} className="mt-8 flex gap-3">
//           <label className="sr-only" htmlFor="name">
//             Category name
//           </label>
//           <input
//             id="name"
//             name="name"
//             required
//             maxLength={100}
//             placeholder="For example, Office Supplies"
//             className="min-w-0 flex-1 text-black rounded-md border border-slate-300 bg-white px-4 py-2"
//           />
//           <button
//             type="submit"
//             className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
//           >
//             Add category
//           </button>
//         </form>

//         {errorMessage && (
//           <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
//         )}

//         {created === "1" && (
//           <p className="mt-3 text-sm text-green-700">Category added.</p>
//         )}

//         {updated === "1" && (
//           <p className="mt-3 text-sm text-green-700">Category updated.</p>
//         )}

//         {deleted === "1" && (
//           <p className="mt-3 text-sm text-green-700">Category deleted.</p>
//         )}

//         <ul className="mt-8 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
//           {categories.length === 0 ? (
//             <li className="p-4 text-black">No categories yet.</li>
//           ) : (
//             categories.map((category) => (
//               <li key={category.id.toString()} className="w-full p-4 text-black flex gap-1 justify-between">
//                 <form action={updateCategory} className="flex gap-3">
//                   <input
//                     type="hidden"
//                     name="id"
//                     value={category.id.toString()}
//                   />
//                   <label
//                     className="sr-only"
//                     htmlFor={`category-${category.id}`}
//                   >
//                     Category name
//                   </label>
//                   <input
//                     id={`category-${category.id}`}
//                     name="name"
//                     required
//                     maxLength={100}
//                     defaultValue={category.name}
//                     className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-2"
//                   />
//                   <button
//                     type="submit"
//                     className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
//                   >
//                     Save
//                   </button>
//                 </form>
//                 <DeleteCategoryForm categoryId={category.id.toString()} />
//               </li>
//             ))
//           )}
//         </ul>
//       </section>
//     </main>
//   );
// }




import { connection } from "next/server";
import { Check, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory } from "./actions";
import { DeleteCategoryForm } from "./delete-category-form";

type CategoriesPageProps = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    updated?: string;
    deleted?: string;
  }>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  await connection();

  const { error, created, updated, deleted } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const errorMessage =
    error === "duplicate"
      ? "That category name already exists."
      : error === "invalid"
        ? "Enter a valid category name."
        : error === "has-products"
          ? "This category is assigned to products. Reassign them before deleting."
          : error === "missing"
            ? "That category no longer exists."
            : null;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-2 text-slate-600">Organize products into groups.</p>

        <form action={createCategory} className="mt-8 flex gap-3">
          <label className="sr-only" htmlFor="name">
            Category name
          </label>
          <Input
            id="name"
            name="name"
            required
            maxLength={100}
            placeholder="For example, Office Supplies"
            className="min-w-0 flex-1"
          />
          <Button type="submit">
            <Plus aria-hidden="true" />
            Add category
          </Button>
        </form>

        {errorMessage && (
          <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
        )}

        {created === "1" && (
          <p className="mt-3 text-sm text-green-700">Category added.</p>
        )}

        {updated === "1" && (
          <p className="mt-3 text-sm text-green-700">Category updated.</p>
        )}

        {deleted === "1" && (
          <p className="mt-3 text-sm text-green-700">Category deleted.</p>
        )}

        <ul className="mt-8 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {categories.length === 0 ? (
            <li className="p-4 text-black">No categories yet.</li>
          ) : (
            categories.map((category) => (
              <li
                key={category.id.toString()}
                className="flex w-full justify-between gap-2 p-4 text-black"
              >
                <form action={updateCategory} className="flex min-w-0 flex-1 gap-3">
                  <input
                    type="hidden"
                    name="id"
                    value={category.id.toString()}
                  />
                  <label
                    className="sr-only"
                    htmlFor={`category-${category.id}`}
                  >
                    Category name
                  </label>
                  <Input
                    id={`category-${category.id}`}
                    name="name"
                    required
                    maxLength={100}
                    defaultValue={category.name}
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    aria-label={`Save changes to ${category.name}`}
                    title="Save category"
                  >
                    <Check aria-hidden="true" />
                  </Button>
                </form>

                <DeleteCategoryForm categoryId={category.id.toString()} />
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}