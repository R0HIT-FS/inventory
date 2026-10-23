"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSupplier, updateSupplier } from "./actions";

type SupplierRowProps = {
  supplier: {
    id: string;
    name: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
  };
};

export function SupplierRow({ supplier }: SupplierRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteFormId = `delete-supplier-${supplier.id}`;

  return (
    <li className="p-4 text-slate-900">
      {isEditing ? (
        <form action={updateSupplier} className="grid gap-3">
          <input type="hidden" name="id" value={supplier.id} />

          <Input
            name="name"
            required
            maxLength={100}
            defaultValue={supplier.name}
            aria-label="Supplier name"
          />
          <Input
            name="contactName"
            maxLength={100}
            defaultValue={supplier.contactName ?? ""}
            placeholder="Contact person (optional)"
            aria-label="Contact person"
          />
          <Input
            name="email"
            type="email"
            maxLength={255}
            defaultValue={supplier.email ?? ""}
            placeholder="Email (optional)"
            aria-label="Email"
          />
          <Input
            name="phone"
            type="tel"
            maxLength={50}
            defaultValue={supplier.phone ?? ""}
            placeholder="Phone (optional)"
            aria-label="Phone"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label={`Save changes to ${supplier.name}`}
              title="Save changes"
            >
              <Check aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
              aria-label="Cancel editing"
              title="Cancel"
            >
              <X aria-hidden="true" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-medium">{supplier.name}</h2>
            <div className="mt-1 text-sm text-slate-600">
              {supplier.contactName && <p>{supplier.contactName}</p>}
              {supplier.email && <p>{supplier.email}</p>}
              {supplier.phone && <p>{supplier.phone}</p>}
              {!supplier.contactName &&
                !supplier.email &&
                !supplier.phone && <p>No contact details provided.</p>}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${supplier.name}`}
              title="Edit supplier"
            >
              <Pencil aria-hidden="true" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${supplier.name}`}
                    title="Delete supplier"
                  />
                }
              >
                <Trash2 aria-hidden="true" />
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {supplier.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the supplier and its links to products.
                    The products themselves will remain.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    form={deleteFormId}
                    variant="destructive"
                  >
                    Delete supplier
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      <form id={deleteFormId} action={deleteSupplier}>
        <input type="hidden" name="id" value={supplier.id} />
      </form>
    </li>
  );
}