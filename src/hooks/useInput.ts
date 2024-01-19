import { ChangeEvent, useEffect, useState } from "react";

interface IUseInputHook {
  value: string;
  isValid: boolean | undefined;
  errorMessage: string;
  updateInputValue: (event: ChangeEvent<HTMLInputElement>) => void;
}

const useInput: (
  validatorFn: (value: string) => string,
  initialState?: string
) => IUseInputHook = (
  validatorFn: (value: string) => string,
  initialState: string = ""
) => {
  const [inputValue, setInputValue] = useState<string>(initialState);
  const [valid, setValid] = useState<boolean | undefined>(undefined);
  const [errorMessage, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!inputValue.length) {
      setValid(undefined);
      setErrorMsg("");
      return;
    }
    const errorMsg = validatorFn(inputValue);
    setValid(!errorMsg);
    setErrorMsg(errorMsg);
  }, [inputValue, validatorFn]);

  const updateInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  return {
    value: inputValue,
    isValid: valid,
    errorMessage,
    updateInputValue,
  };
};

export default useInput;
