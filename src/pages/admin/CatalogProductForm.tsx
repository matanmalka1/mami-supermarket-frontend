import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/form/TextField";
import SelectField from "@/components/ui/form/SelectField";
import TextAreaField from "@/components/ui/form/TextAreaField";

type FormValues = {
  name: string;
  sku: string;
  price: string;
  categoryId: string;
  description?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  initialProduct?: any | null;
  onSubmit: (values: FormValues) => Promise<void>;
};

const emptyForm: FormValues = { name: "", sku: "", price: "", categoryId: "", description: "" };

export const CatalogProductForm: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  initialProduct,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name || "",
        sku: initialProduct.sku || "",
        price: String(initialProduct.price ?? ""),
        categoryId: initialProduct.category_id || initialProduct.categoryId || "",
        description: initialProduct.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.price) return;
    try {
      setSaving(true);
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialProduct ? "Edit Product" : "New Product Enrollment"}>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <TextField
          required
          placeholder="Product Name"
          label="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })}
        />
        <TextField
          required
          placeholder="SKU"
          label="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: (e.target as HTMLInputElement).value })}
        />
        <TextField
          required
          type="number"
          placeholder="Price"
          label="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: (e.target as HTMLInputElement).value })}
        />
        <SelectField
          label="Category"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: (e.target as HTMLSelectElement).value })}
          options={[
            { value: "", label: "Select category" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <TextAreaField
          label="Description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: (e.target as HTMLTextAreaElement).value })}
          rows={3}
        />
        <Button fullWidth size="lg" className="rounded-2xl" type="submit" disabled={saving}>
          {saving ? "Saving..." : initialProduct ? "Save Changes" : "Enroll Product"}
        </Button>
      </form>
    </Modal>
  );
};
