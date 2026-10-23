"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createSupplier(formData: FormData) {
  const submittedName = formData.get("name");

  if (typeof submittedName !== "string" || submittedName.trim().length === 0) {
    redirect("/suppliers?error=invalid");
  }

  function optionalText(fieldName: string) {
    const value = formData.get(fieldName);

    return typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : null;
  }

  try {
    await prisma.supplier.create({
      data: {
        name: submittedName.trim(),
        contactName: optionalText("contactName"),
        email: optionalText("email"),
        phone: optionalText("phone"),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/suppliers?error=duplicate");
    }

    throw error;
  }

  revalidatePath("/suppliers");
  redirect("/suppliers?created=1");
}


export async function updateSupplier(formData: FormData) {
    const rawId = formData.get("id");
    const submittedName = formData.get("name");
  
    if (
      typeof rawId !== "string" ||
      !/^\d+$/.test(rawId) ||
      typeof submittedName !== "string" ||
      submittedName.trim().length === 0
    ) {
      redirect("/suppliers?error=invalid");
    }
  
    function optionalText(fieldName: string) {
      const value = formData.get(fieldName);
  
      return typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : null;
    }
  
    try {
      await prisma.supplier.update({
        where: { id: BigInt(rawId) },
        data: {
          name: submittedName.trim(),
          contactName: optionalText("contactName"),
          email: optionalText("email"),
          phone: optionalText("phone"),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        redirect("/suppliers?error=duplicate");
      }
  
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        redirect("/suppliers?error=missing");
      }
  
      throw error;
    }
  
    revalidatePath("/suppliers");
    redirect("/suppliers?updated=1");
  }


  export async function deleteSupplier(formData: FormData) {
    const rawId = formData.get("id");
  
    if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) {
      redirect("/suppliers?error=invalid");
    }
  
    try {
      await prisma.supplier.delete({
        where: { id: BigInt(rawId) },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        redirect("/suppliers?error=missing");
      }
  
      throw error;
    }
  
    revalidatePath("/suppliers");
    redirect("/suppliers?deleted=1");
  }