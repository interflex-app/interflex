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
import { Button, useToast } from "@interflex-app/ui";
import { extractTranslations } from "../../../utils/extract-translations";
import { useRef, useState } from "react";
import { ModifierKey, useKeyPress } from "../../../hooks/use-key-press";
import { TranslationActionEntry } from "../../../hooks/use-translation-state";

const Translations: NextPageWithLayout = () => {
  const [actions, setActions] = useState<TranslationActionEntry[]>([]);

  const { toast } = useToast();

  const { project, isLoading } = useProject();

  const translationTable = useRef<TranslationTableRef>(null);

  const {
    mutateAsync: syncTranslations,
    isLoading: syncTranslationsLoading,
    error,
  } = api.project.syncTranslations.useMutation();

  const {
    data: initialTranslations,
    isLoading: translationsLoading,
    isError: translationsError,
    refetch,
  } = api.project.getTranslations.useQuery(
    { projectId: project?.id ?? "" },
    { enabled: !!project?.id }
  );

  const save = async () => {
    if (!project) return;

    try {
      await syncTranslations({
        projectId: project.id,
        translations: actions,
      });

      const newState = await refetch();

      if (!newState.data) return;
      translationTable.current!.resetWithState(
        newState.data.map((t) => ({
          key: t.key,
          values: extractTranslations(t.value),
          id: t.id,
        }))
      );

      toast({
        title: "Translations synced",
        description: "Your translations have been saved.",
      });
    } catch (e) {}
  };

  useKeyPress("s", save, { modifierKey: ModifierKey.Control });
  useKeyPress("s", save, { modifierKey: ModifierKey.Meta });

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
              disabled={syncTranslationsLoading || actions.length === 0}
              loading={syncTranslationsLoading}
              onClick={async () => await save()}
            >
              Save
            </Button>
          </>
        }
      />

      <TranslationTable
        onActionsChange={setActions}
        ref={translationTable}
        error={error}
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
