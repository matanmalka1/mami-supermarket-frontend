import React from "react";
import TextAreaField from "@/components/ui/form/TextAreaField";

type Props = {
  description: string;
  setDescription: (value: string) => void;
};

const NewSkuDescription: React.FC<Props> = ({
  description,
  setDescription,
}) => (
  <div className="space-y-2">
    <TextAreaField
      label="Description (optional)"
      value={description}
      onChange={(event) => setDescription((event.target as HTMLTextAreaElement).value)}
      rows={3}
    />
  </div>
);

export default NewSkuDescription;
