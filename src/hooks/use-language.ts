import revalidatePathClient from "@/app/actions";
import { typedMessages } from "@/integrations/i18n/typed-messages";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import { useCallback } from "react";

// useLanguage Hook
// ----------------
// Provides multilingual support features:
//
// - locale: The current language setting of the application.
// - setLocale: Function to update the application's language and persist it in cookies.
// - m: useTranslations function proxy object, allowing chained property access to translation keys and passing arguments.
//   For example: m.some_feature.some_key() will call the corresponding translation function.
export default function useLanguage() {
  const locale = useLocale();
  const setLocale = useCallback((locale: string) => {
    Cookies.set("app_locale", locale, {
      expires: 365,
    });
    revalidatePathClient();
  }, []);
  return { locale, setLocale, m: typedMessages };
}
