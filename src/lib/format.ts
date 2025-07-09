import { differenceInDays, format } from "date-fns";
import numbro from "numbro";
export function bytesToSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toPrecision(3)} ${sizes[i]}`;
}

export function smartFormatTime(date: string | number | Date) {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = differenceInDays(now, inputDate);
  if (diff < 1) {
    return format(inputDate, "HH:mm");
  }
  return format(inputDate, "MM/dd/yy");
}

export function hyphen2Camel(str: string) {
  const re = /-(\w)/g;
  return str.replace(re, (_$0, $1) => {
    return $1.toUpperCase();
  });
}

export function upperCaseFirst(str: string) {
  if (!str) {
    return "";
  }
  return str[0]!.toUpperCase() + str.slice(1, str.length);
}

export function formatLargeNumber(num: number) {
  return numbro(num).format({ average: true, mantissa: 2, trimMantissa: true });
}

export function objectToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        formData.append(`${key}[${i}]`, value[i] as string | Blob);
      }
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  }
  return formData;
}
