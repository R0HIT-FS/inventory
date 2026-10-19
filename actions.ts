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

  const name = submittedName.trim();
  const contactName = formData.get("contactName");
  const email = formData.get("email");
  const phone = formData.get("phone");

  try {
    await prisma.supplier.create({
      data: {
        name,
        contactName:
          typeof contactName === "string" && contactName.trim()
            ? contactName.trim()
            : null,
        email:
          typeof email === "string" && email.trim()
            ? email.trim()
            : null,
        phone:
          typeof phone === "string" && phone.trim()
            ? phone.trim()
            : null,
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