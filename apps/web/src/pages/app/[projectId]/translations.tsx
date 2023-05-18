import DashboardHeader from "../../../components/dashboard-header";
import { useProject } from "../../../hooks/use-project";
import AppLayout from "../../../layouts/app-layout";
import { type NextPageWithLayout } from "../../_app";
import DashboardSkeleton from "../../../components/dashboard-skeleton";
import Head from "next/head";
import { truncate } from "../../../utils/truncate";
import {
  TranslationTable,
  TranslationTableRef,
} from "../../../components/translation-table";
import { projectLanguages } from "../../../utils/project-languages";
import { api } from "../../../utils/api";
import { Button } from "@interflex-app/ui";
import { SupportedLanguage, TranslationAction } from "../../../consts";
import { extractTranslations } from "../../../utils/extract-translations";
import { useRef } from "react";

const Translations: NextPageWithLayout = () => {
  const { project, isLoading } = useProject();

  const translationTable = useRef<TranslationTableRef>(null);

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
                const actions = translationTable.current!.getActions();
                console.log(actions);
              }}
            >
              Save
            </Button>
          </>
        }
      />

      <TranslationTable
        ref={translationTable}
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
