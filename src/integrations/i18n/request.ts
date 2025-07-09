import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const supportedLocales = ["en", "zh-CN"];

export default getRequestConfig(async () => {
  const appLocale = await getAppLocale();

  return {
    locale: appLocale,
    messages: (await import(`../../locales/${appLocale}.ts`)).default,
  };
});

export async function getAppLocale() {
  const cookieStore = await cookies();
  const appLocale = cookieStore.get("app_locale")?.value || "unset";
  const locale = supportedLocales.includes(appLocale) ? appLocale : "en";
  return locale;
}
