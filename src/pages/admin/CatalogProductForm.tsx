import React, { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

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
        <input
          required
          placeholder="Product Name"
          className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="SKU"
          className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Price"
          className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <select
          className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold min-h-[96px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button fullWidth size="lg" className="rounded-2xl" type="submit" disabled={saving}>
          {saving ? "Saving..." : initialProduct ? "Save Changes" : "Enroll Product"}
        </Button>
      </form>
    </Modal>
  );
};
