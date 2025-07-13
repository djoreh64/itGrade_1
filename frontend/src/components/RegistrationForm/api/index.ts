export const uploadFormData = async (
  data: FormData,
  onProgress: (percent: number) => void
): Promise<{ success: boolean; data?: any; errors?: any }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.BASE_URL}/submit`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ success: true, data: response });
        } catch {
          resolve({ success: true });
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ success: false, errors: response.errors || {} });
        } catch {
          resolve({ success: false, errors: {} });
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error"));
    };

    xhr.send(data);
  });
};
