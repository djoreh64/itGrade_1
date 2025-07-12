import type { IFormData } from "@types";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@utils/validate";
import { t } from "i18next";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

export const VALIDATION_RULES: Record<keyof IFormData, any> = {
  login: { required: t("loginRequired") },
  email: { required: t("emailRequired"), validate: validateEmail },
  phone: { required: t("phoneRequired"), validate: validatePhone },
  password: { required: t("passwordRequired"), validate: validatePassword },
  fullName: { required: t("fullNameRequired"), validate: validateFullName },
  about: { required: t("aboutRequired") },
  avatar: { required: t("avatarRequired") },
};