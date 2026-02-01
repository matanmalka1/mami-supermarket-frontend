import { render, screen } from "@testing-library/react";
import { QuantityAndTypeFields } from "@/features/ops/components/QuantityAndTypeFields";
import { useForm } from "react-hook-form";

describe("QuantityAndTypeFields", () => {
  const setup = (errors = {}) => {
    const methods = useForm({
      defaultValues: { quantity: 2, requestType: "ADD_QUANTITY" },
    });
    const registration = methods.register;
    render(
      <QuantityAndTypeFields
        register={registration}
        errors={errors as any}
        requestTypes={["ADD_QUANTITY", "SET_QUANTITY"]}
      />,
    );
  };

  it("renders quantity and radios", () => {
    setup();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Add quantity/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Set quantity/i })).toBeInTheDocument();
  });

  it("shows validation message when provided", () => {
    setup({ quantity: { message: "too low" } });
    expect(screen.getByText("too low")).toBeInTheDocument();
  });
});
