import React from "react";
import TextField from "@/components/ui/form/TextField";
import Grid from "@/components/ui/Grid";

type Props = {
  price: number;
  initialStock: number;
  setPrice: (value: number) => void;
  setInitialStock: (value: number) => void;
};

const NewSkuNumbers: React.FC<Props> = ({
  price,
  initialStock,
  setPrice,
  setInitialStock,
}) => (
  <Grid cols={2} gap={4}>
    <TextField
      label="Price (₪)"
      type="number"
      min={0}
      step={0.01}
      value={price}
      onChange={(event) =>
        setPrice(Math.max(0, Number.parseFloat((event.target as HTMLInputElement).value) || 0))
      }
    />
    <TextField
      label="Initial Stock"
      type="number"
      min={0}
      value={initialStock}
      onChange={(event) =>
        setInitialStock(
          Math.max(0, Number.parseInt((event.target as HTMLInputElement).value, 10) || 0),
        )
      }
    />
  </Grid>
);

export default NewSkuNumbers;
