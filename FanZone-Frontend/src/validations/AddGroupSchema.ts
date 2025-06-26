import * as Yup from "yup";

export const AddGroupSchema = Yup.object({
  name: Yup.string()
    .required("Grup adı zorunlu"),
  description: Yup.string()
    .required("Grup açıklaması zorunlu"),
  image: Yup.mixed()
    .test(
      "fileSize",
      "Dosya çok büyük (max 1MB)",
      (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return value.size <= 1024 * 1024;
        }
        return false;
      }
    )
    .test(
      "fileType",
      "Geçersiz dosya türü (jpg, png, gif olmalı)",
      (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        }
        return false;
      }
    )
    .nullable(),
});
