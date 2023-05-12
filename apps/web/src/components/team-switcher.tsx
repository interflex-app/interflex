import { Check, ChevronsUpDown, PlusCircle, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  cn,
} from "@interflex-app/ui";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  type RouterError,
  type RouterInputs,
  type RouterOutputs,
  api,
} from "../utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const createTeamSchema = z.object({ name: z.string().min(1) });

type Team = RouterOutputs["team"]["getAllTeams"]["personal"];

const TeamSwitcher: React.FC<
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const { data: sesh } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors: createTeamError },
    reset,
    setError,
  } = useForm<RouterInputs["team"]["createTeam"]>({
    resolver: zodResolver(createTeamSchema),
  });

  const { mutateAsync: createTeam, isLoading: createTeamLoading } =
    api.team.createTeam.useMutation();

  const {
    data: teamsData,
    isLoading: teamsLoading,
    isError: teamsError,
    refetch: refetchTeams,
  } = api.team.getAllTeams.useQuery(undefined, {
    enabled: !!sesh,
  });

  if (!sesh || !teamsData || teamsLoading || teamsError) {
    return (
      <div className="flex w-[200px] items-center justify-between px-4">
        <Skeleton className="mr-2 h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    );
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={
                  (selectedTeam ?? teamsData.personal).id ===
                  teamsData.personal.id
                    ? sesh.user.image ?? "__NON_EXISTENT_IMAGE__"
                    : `https://avatar.vercel.sh/interflex-team-${
                        (selectedTeam ?? teamsData.personal).id
                      }.png`
                }
                alt={(selectedTeam ?? teamsData.personal).name}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {(selectedTeam ?? teamsData.personal).name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Personal Account">
                <CommandItem
                  onSelect={() => {
                    setSelectedTeam(teamsData.personal);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={sesh?.user.image ?? "__NON_EXISTENT_IMAGE__"}
                      alt={sesh?.user.name ?? undefined}
                    />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  {teamsData.personal.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      (selectedTeam ?? teamsData.personal).id ===
                        teamsData.personal.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Your teams">
                {teamsData.shared.length > 0 ? (
                  teamsData.shared.map((team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/interflex-team-${team.id}.png`}
                          alt={team.name}
                        />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      {team.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          (selectedTeam ?? teamsData.personal).id === team.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                ) : (
                  <div className="p-2 text-xs">
                    You don&apos;t have any teams!
                  </div>
                )}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage your projects.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={
            void handleSubmit(async (formData) => {
              try {
                await createTeam(formData);
                await refetchTeams();

                reset();
                setShowNewTeamDialog(false);
              } catch (e) {
                Object.entries(
                  (e as RouterError).data.zodError?.fieldErrors ?? []
                ).forEach(([key, value]) =>
                  setError(key as "root", { message: value?.[0] ?? "" })
                );
              }
            })
          }
        >
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter team name..."
                />
                {createTeamError.name?.message && (
                  <div className="mt-2 text-xs text-red-500">
                    {createTeamError.name?.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewTeamDialog(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createTeamLoading}>
              Create team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSwitcher;
