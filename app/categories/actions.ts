"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createCategory(formData: FormData) {
  const submittedName = formData.get("name");

  if (typeof submittedName !== "string") {
    redirect("/categories?error=invalid");
  }

  const name = submittedName.trim();

  if (name.length === 0) {
    redirect("/categories?error=invalid");
  }

  try {
    await prisma.category.create({
      data: { name },
    });
  } catch (error) {
    // P2002 means PostgreSQL rejected a duplicate unique value.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/categories?error=duplicate");
    }

    throw error;
  }

  revalidatePath("/categories");
  redirect("/categories?created=1");
}


export async function updateCategory(formData: FormData) {
    const rawId = formData.get("id");
    const submittedName = formData.get("name");
  
    if (
      typeof rawId !== "string" ||
      !/^\d+$/.test(rawId) ||
      typeof submittedName !== "string"
    ) {
      redirect("/categories?error=invalid");
    }
  
    const name = submittedName.trim();
  
    if (name.length === 0) {
      redirect("/categories?error=invalid");
    }
  
    try {
      await prisma.category.update({
        where: { id: BigInt(rawId) },
        data: { name },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        redirect("/categories?error=duplicate");
      }
  
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        redirect("/categories?error=missing");
      }
  
      throw error;
    }
  
    revalidatePath("/categories");
    redirect("/categories?updated=1");
  }


  export async function deleteCategory(formData: FormData) {
    const rawId = formData.get("id");
  
    if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) {
      redirect("/categories?error=invalid");
    }
  
    try {
      await prisma.category.delete({
        where: { id: BigInt(rawId) },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        redirect("/categories?error=has-products");
      }
  
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        redirect("/categories?error=missing");
      }
  
      throw error;
    }
  
    revalidatePath("/categories");
    redirect("/categories?deleted=1");
  }