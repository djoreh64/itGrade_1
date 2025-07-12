import type { FC } from "react";
import styles from "@components/RegistrationForm/RegistrationForm.module.css";
import { t } from "i18next";

interface Props {
  src: string | null;
}

const AvatarPreview: FC<Props> = ({ src }) =>
  src ? (
    <img
      src={src}
      alt={t("avatarPreviewAlt")}
      className={styles.avatarPreview}
    />
  ) : null;

export default AvatarPreview;
