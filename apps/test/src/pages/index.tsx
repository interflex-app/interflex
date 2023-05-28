import { Button } from "@interflex-app/ui";
import { NextPage } from "next";
import { useI18n } from "../../i18n/interflex";

const Index: NextPage = () => {
  const { t, locale, changeLocale } = useI18n();

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-8">
      <h1 className="text-5xl font-black">{t("title", { name: "Piotr" })}</h1>
      <p>{t("subtitle")}</p>
      <p>{t("showDate", { date: new Date() })}</p>
      <Button onClick={() => changeLocale(locale === "en" ? "pl" : "en")}>
        {t("clickme")}
      </Button>
    </div>
  );
};

export default Index;
