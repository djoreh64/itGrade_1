import { useEffect, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";
import type { IFormData } from "@types";
import { BASE_URL } from "@constants";
import { useUsersActions } from "@hooks/useUsers";

export const useRegistrationForm = (
  dialogRef: RefObject<HTMLDialogElement | null>
) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [submitResult, setSubmitResult] = useState<null | {
    success: boolean;
    data?: any;
    errors?: Record<string, string>;
  }>(null);
  const { invalidate } = useUsersActions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    setError,
  } = useForm<IFormData>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      login: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      about: "",
      avatar: null,
    },
  });

  const phoneValue = watch("phone");
  useEffect(() => {
    if (!phoneValue) return;

    const digits = phoneValue.replace(/\D/g, "").slice(0, 11);
    let formatted = "+7";
    if (digits.length > 1) formatted += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 4) formatted += ")";
    if (digits.length >= 4) formatted += ` ${digits.slice(4, 7)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(9, 11)}`;

    if (formatted !== phoneValue) setValue("phone", formatted);
  }, [phoneValue, setValue]);

  const onAvatarChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: IFormData) => {
    setSubmitResult(null);
    setUploadProgress(0);

    try {
      const fd = new FormData();
      fd.append("login", data.login);
      fd.append("password", data.password);
      fd.append("fullName", data.fullName);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("about", data.about);
      if (data.avatar && data.avatar.length > 0)
        fd.append("avatar", data.avatar[0]);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${BASE_URL}/submit`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setSubmitResult({ success: true, data: response });
            reset();
            setAvatarPreview(null);
            dialogRef?.current?.close();
            invalidate();
            setUploadProgress(100);
            resolve(null);
          } else {
            const result = JSON.parse(xhr.responseText);
            if (result.errors) {
              for (const [field, message] of Object.entries(result.errors)) {
                setError(field as keyof IFormData, {
                  type: "server",
                  message: message as string,
                });
              }
            }
            setSubmitResult({ success: false, errors: result.errors || {} });
            reject(new Error("Ошибка сервера"));
          }
        };

        xhr.onerror = () => {
          setSubmitResult({
            success: false,
            errors: { global: "Ошибка при отправке формы" },
          });
          reject(new Error("Ошибка сети"));
        };

        xhr.send(fd);
      });
    } catch (err) {
      setSubmitResult({
        success: false,
        errors: { global: "Ошибка при отправке формы" },
      });
    }
  };

  const STORAGE_KEY = "registrationFormData";

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.entries(parsed).forEach(([key, value]) => {
          if (key !== "avatar") {
            reset((formValues) => ({ ...formValues, [key]: value }));
          }
        });
      } catch {}
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      const { avatar, ...rest } = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    isValid,
    reset,
    setValue,
    setError,
    avatarPreview,
    showPassword,
    setShowPassword,
    submitResult,
    setSubmitResult,
    onAvatarChange,
    uploadProgress,
    onSubmit,
  };
};
