import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

type Options = { route?: string };

const renderWithRouter = (
  ui: React.ReactElement,
  options: Options = {},
) => {
  const { route = "/" } = options;
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

export default renderWithRouter;
