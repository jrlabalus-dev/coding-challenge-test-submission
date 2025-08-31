import { renderHook, act } from "@testing-library/react";
import useForm from "./useForm";

const required = (value: string) => (!value ? "Required" : "");

interface FormData {
  keyA: string;
  keyB: string;
}

describe("useForm", () => {
  const initialForm: FormData = { keyA: "", keyB: "" };
  const validators = {
    keyA: [required],
    keyB: [required],
  };

  const onSubmitMock = jest.fn();

  it("starts with the initial form value", () => {
    const { result } = renderHook(() =>
      useForm(initialForm, validators, onSubmitMock)
    );

    expect(result.current.values).toEqual(initialForm);
    expect(result.current.errors).toEqual({});
  });

  it("updates values on handleChange", () => {
    const { result } = renderHook(() =>
      useForm(initialForm, validators, onSubmitMock)
    );

    act(() => {
      result.current.handleChange({
        target: { name: "keyA", value: "John" },
      } as any);
    });

    expect(result.current.values.keyA).toBe("John");
  });

  it("validates form and sets errors", () => {
    const { result } = renderHook(() =>
      useForm(initialForm, validators, onSubmitMock)
    );

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toEqual({
      keyA: "Required",
      keyB: "Required",
    });
  });

  it("calls onSubmit with form values on handleSubmit", () => {
    const { result } = renderHook(() =>
      useForm(initialForm, validators, onSubmitMock)
    );

    act(() => {
      result.current.handleChange({
        target: { name: "keyA", value: "WordA" },
      } as any);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "keyB", value: "WordB" },
      } as any);
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(onSubmitMock).toHaveBeenCalledWith({
      keyA: "WordA",
      keyB: "WordB",
    });
  });

  it("resets form values and errors on resetForm", () => {
    const { result } = renderHook(() =>
      useForm(initialForm, validators, onSubmitMock)
    );

    act(() => {
      result.current.handleChange({
        target: { name: "firstName", value: "WordA" },
      } as any);

      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialForm);
    expect(result.current.errors).toEqual({});
  });
});
