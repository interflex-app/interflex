import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import { TranslationTable } from "../../../components/translation-table";
import { projectLanguages } from "../../../utils/project-languages";
import { api } from "../../../utils/api";
import { Button } from "@interflex-app/ui";
import { SupportedLanguage } from "../../../consts";
import { extractTranslations } from "../../../utils/extract-translations";

const TEST_TRANSLATIONS = [
  {
    key: "im.a.key",
    values: [
      {
        language: SupportedLanguage.English,
        value: "I'm a key!",
      },
      {
        language: SupportedLanguage.Polish,
        value: "Jestem kluczem!",
      },
      {
        language: SupportedLanguage.Norwegian,
        value: "Jeg er en nøkkel!",
      },
    ],
  },
  {
    key: "im.a.second_key",
    values: [
      {
        language: SupportedLanguage.English,
        value: "I'm a second key!",
      },
      {
        language: SupportedLanguage.Polish,
        value: "Jestem drugim kluczem!",
      },
      {
        language: SupportedLanguage.Norwegian,
        value: "Jeg er en andre nøkkel!",
      },
    ],
  },
];

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  const { mutateAsync: syncTranslations, isLoading: syncTranslationsLoading } =
    api.project.syncTranslations.useMutation();

  const {
    data: initialTranslations,
    isLoading: translationsLoading,
    isError: translationsError,
  } = api.project.getTranslations.useQuery(
    { projectId: project?.id ?? "__PROJECT_ID__" },
    { enabled: !!project?.id }
  );

  if (
    !project ||
    isLoading ||
    !initialTranslations ||
    translationsLoading ||
    translationsError
  )
    return <DashboardSkeleton />;

  return (
    <div>
      <Head>
        <title>Interflex | {project.name} | Translations</title>
      </Head>

      <DashboardHeader title={`${truncate(project.name, 20)} - Translations`} />

      <Button
        loading={syncTranslationsLoading}
        onClick={async () => {
          try {
            await syncTranslations({
              projectId: project.id,
              translations: TEST_TRANSLATIONS,
            });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Test
      </Button>

      <TranslationTable
        languages={projectLanguages(project.languages)}
        data={initialTranslations.map((t) => ({
          key: t.key,
          values: extractTranslations(t.value),
          id: t.id,
        }))}
      />
    </div>
  );
};

Translations.getLayout = (page) => <AppLayout projectLayout>{page}</AppLayout>;

export default Translations;
