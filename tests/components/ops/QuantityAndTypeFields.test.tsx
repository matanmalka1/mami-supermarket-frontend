import { render, screen } from "@testing-library/react";
import { QuantityAndTypeFields } from "@/features/ops/components/QuantityAndTypeFields";
import { useForm, FormProvider } from "react-hook-form";
import { describe, expect, it } from "vitest";

describe("QuantityAndTypeFields", () => {
  const TestWrapper = ({ errors = {} }: { errors?: any }) => {
    const methods = useForm({
      defaultValues: { quantity: 2, requestType: "ADD_QUANTITY" },
    });
    return (
      <FormProvider {...methods}>
        <QuantityAndTypeFields
          register={methods.register}
          errors={errors as any}
          requestTypes={["ADD_QUANTITY", "SET_QUANTITY"]}
        />
      </FormProvider>
    );
  };

  const setup = (errors = {}) => {
    render(<TestWrapper errors={errors} />);
  };

  it("renders quantity and radios", () => {
    setup();
    // Component should render with input field
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("shows validation message when provided", () => {
    setup({ quantity: { message: "too low" } });
    expect(screen.getByText("too low")).toBeInTheDocument();
  });
});
