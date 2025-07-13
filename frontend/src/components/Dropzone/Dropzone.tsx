import type { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styles from "../RegistrationForm/RegistrationForm.module.css";
import { type ChangeEvent, type DragEvent, type FC, type KeyboardEvent, useRef } from "react";

interface Props {
  file?: File;
  avatarRegister: Omit<UseFormRegisterReturn, "onChange">;
  rhfOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (files: FileList | null) => void;
}

const Dropzone: FC<Props> = ({
  file,
  avatarRegister,
  rhfOnChange,
  onAvatarChange,
}) => {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      rhfOnChange({
        target: { files },
      } as unknown as ChangeEvent<HTMLInputElement>);
      onAvatarChange(files);
    }
  };

  const handleDropzoneClick = () => inputRef.current?.click();

  const handleDropzoneKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
  };

  return (
    <div
      role="button"
      className={styles.dropzone}
      tabIndex={0}
      onClick={handleDropzoneClick}
      onKeyDown={handleDropzoneKeyDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className={styles.dropzoneContent}>
        <p>{t("dragDropFile")}</p>
        <button
          type="button"
          className={styles.chooseBtn}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {t("chooseFile")}
        </button>
        {file && <span className={styles.fileName}>{file.name}</span>}
      </div>

      <input
        type="file"
        accept="image/*"
        name="avatar"
        className={styles.hiddenInput}
        ref={(el) => {
          inputRef.current = el;
          avatarRegister.ref(el);
        }}
        onBlur={avatarRegister.onBlur}
        onChange={(e) => {
          rhfOnChange(e);
          onAvatarChange(e.target.files);
        }}
      />
    </div>
  );
};

export default Dropzone;
