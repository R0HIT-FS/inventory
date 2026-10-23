"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const name = formData.get("name");
  const sku = formData.get("sku");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");
  const priceRaw = formData.get("unitPrice");
  const quantityRaw = formData.get("initialQuantity");
  const reorderLevelRaw = formData.get("reorderLevel");

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 100 ||
    typeof sku !== "string" ||
    sku.trim().length === 0 ||
    sku.trim().length > 100 ||
    typeof categoryId !== "string" ||
    !/^\d+$/.test(categoryId) ||
    typeof priceRaw !== "string" ||
    typeof quantityRaw !== "string" ||
    typeof reorderLevelRaw !== "string"
  ) {
    redirect("/products?error=invalid");
  }

  const wholePrice = priceRaw.split(".")[0].replace(/^0+/, "") || "0";
  const validPrice =
    /^\d+(\.\d{1,2})?$/.test(priceRaw) && wholePrice.length <= 10;

  const initialQuantity = Number(quantityRaw);
  const reorderLevel = Number(reorderLevelRaw);
  const maxInteger = 2_147_483_647;

  if (
    !validPrice ||
    !/^\d+$/.test(quantityRaw) ||
    !Number.isSafeInteger(initialQuantity) ||
    initialQuantity > maxInteger ||
    !/^\d+$/.test(reorderLevelRaw) ||
    !Number.isSafeInteger(reorderLevel) ||
    reorderLevel > maxInteger
  ) {
    redirect("/products?error=invalid");
  }

  const supplierIds: string[] = [];

  for (const value of formData.getAll("supplierIds")) {
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
      redirect("/products?error=invalid");
    }

    if (!supplierIds.includes(value)) {
      supplierIds.push(value);
    }
  }

  const cleanDescription =
    typeof description === "string" && description.trim().length > 0
      ? description.trim()
      : null;

  try {
    await prisma.product.create({
      data: {
        name: name.trim(),
        sku: sku.trim(),
        description: cleanDescription,
        unitPrice: new Prisma.Decimal(priceRaw),
        quantityOnHand: initialQuantity,
        reorderLevel,
        category: {
          connect: { id: BigInt(categoryId) },
        },
        suppliers:
          supplierIds.length > 0
            ? {
                create: supplierIds.map((supplierId) => ({
                  supplier: {
                    connect: { id: BigInt(supplierId) },
                  },
                })),
              }
            : undefined,
        movements:
          initialQuantity > 0
            ? {
                create: {
                  type: "RECEIPT",
                  quantityChange: initialQuantity,
                  reason: "Initial stock",
                },
              }
            : undefined,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/products?error=duplicate-sku");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      redirect("/products?error=related-record-missing");
    }

    throw error;
  }

  revalidatePath("/products");
  revalidatePath("/");
  redirect("/products?created=1");
}