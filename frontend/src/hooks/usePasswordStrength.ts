import { useMemo } from "react";

export const usePasswordStrength = (password: string) => {
  const checks = useMemo(() => {
    return {
      length: password?.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passed = Object.values(checks).filter(Boolean).length;
  const strength = Math.min(100, (passed / 5) * 100);

  return { checks, strength };
};
