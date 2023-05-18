import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import { TranslationTable } from "../../../components/translation-table";
import { projectLanguages } from "../../../utils/project-languages";
import { RouterInputs, api } from "../../../utils/api";
import { Button } from "@interflex-app/ui";
import { SupportedLanguage, TranslationAction } from "../../../consts";
import { extractTranslations } from "../../../utils/extract-translations";
import { TranslationActionEntry } from "../../../hooks/use-translation-state";

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  const { mutateAsync: syncTranslations, isLoading: syncTranslationsLoading } =
    api.project.syncTranslations.useMutation();

  const {
    data: initialTranslations,
    isLoading: translationsLoading,
    isError: translationsError,
  } = api.project.getTranslations.useQuery(
    { projectId: project?.id ?? "" },
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

      <DashboardHeader
        title={`${truncate(project.name, 20)} - Translations`}
        actions={
          <>
            <Button
              loading={syncTranslationsLoading}
              onClick={async () => {
                try {
                  await syncTranslations({
                    projectId: project.id,
                    translations: [
                      {
                        action: TranslationAction.Create,
                        key: "test.key_1",
                        values: [
                          {
                            language: SupportedLanguage.English,
                            value: "Test value 1",
                          },
                          {
                            language: SupportedLanguage.Polish,
                            value: "Testowa wartość 1",
                          },
                          {
                            language: SupportedLanguage.Norwegian,
                            value: "Testverdi 1",
                          },
                        ],
                      },
                      {
                        action: TranslationAction.Create,
                        key: "test.key_2",
                        values: [
                          {
                            language: SupportedLanguage.English,
                            value: "Test value 2",
                          },
                          {
                            language: SupportedLanguage.Polish,
                            value: "Testowa wartość 2",
                          },
                          {
                            language: SupportedLanguage.Norwegian,
                            value: "Testverdi 2",
                          },
                        ],
                      },
                      {
                        action: TranslationAction.Create,
                        key: "test.key_3",
                        values: [
                          {
                            language: SupportedLanguage.English,
                            value: "Test value 3",
                          },
                          {
                            language: SupportedLanguage.Polish,
                            value: "Testowa wartość 3",
                          },
                          {
                            language: SupportedLanguage.Norwegian,
                            value: "Testverdi 3",
                          },
                        ],
                      },
                    ],
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              Save
            </Button>
          </>
        }
      />

      <TranslationTable
        languages={projectLanguages(project.languages)}
        initialData={initialTranslations.map((t) => ({
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
