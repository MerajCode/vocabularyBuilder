import { createRef, RefObject, useCallback, useRef } from "react";
import { Keyboard } from "react-native";

const useFormNavigation = (numberOfInputs: number) => {
  const inputRefs = useRef<RefObject<any>[]>(
    Array(numberOfInputs)
      .fill(null)
      .map(() => createRef<any>())
  );

  const focusNext = useCallback(
    (currentIndex: number) => {
      if (currentIndex < numberOfInputs - 1) {
        inputRefs.current[currentIndex + 1].current?.focus();
      } else {
        Keyboard.dismiss();
      }
    },
    [numberOfInputs]
  );

  return { inputRefs: inputRefs.current, focusNext };
};

export default useFormNavigation;
