import md5 from "md5";

export function hashPassword(password: string) {
  const salt = "knowlink";
  return md5(password + salt);
}
