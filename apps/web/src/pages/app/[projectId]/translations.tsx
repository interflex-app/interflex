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

export type TranslationActionEntry =
  RouterInputs["project"]["syncTranslations"]["translations"][number];

export type CreateTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Create }
>;

export type UpdateTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Update }
>;

export type DeleteTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Delete }
>;

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
              translations: [],
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
