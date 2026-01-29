import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

type RenderOptions = {
  route?: string;
  path?: string;
  element: React.ReactElement;
};

export const renderWithRouter = ({
  route = "/",
  path = "/",
  element,
}: RenderOptions) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
};

export default renderWithRouter;
