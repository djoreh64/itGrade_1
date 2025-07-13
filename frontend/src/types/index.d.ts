export interface IFormData {
  login: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  about: string;
  avatar?: FileList;
}

export interface ISubmitResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string>;
}