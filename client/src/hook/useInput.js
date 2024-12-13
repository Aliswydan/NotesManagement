import { useState } from 'react';

export default function useInput(defaultValue, validationFn, setErrorMessage) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const hasError = didEdit && Boolean(validationFn(enteredValue)); 

  function handleInputChange(event) {
    const newValue = event.target.value;
    setEnteredValue(newValue);
    setDidEdit(false);

    if (setErrorMessage) {
      const errorMessage = validationFn(newValue);
      setErrorMessage(errorMessage || '');
    }
  }

  function handleInputBlur() {
    setDidEdit(true);

    if (setErrorMessage) {
      const errorMessage = validationFn(enteredValue);
      setErrorMessage(errorMessage || '');
    }
  }

  return {
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
    hasError,
  };
}
