import { render, RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import store from "src/core/store";

const WithProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

const wrappedRender = (jsx: ReactElement, options?: Omit<RenderOptions,"wrapper">) => render(jsx, { wrapper: WithProvider, ...options });

export { wrappedRender as render}