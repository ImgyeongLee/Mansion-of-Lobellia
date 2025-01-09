import { runWithAmplifyServerContext } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import prisma from "@/lib/db/prisma";
import { getSub } from "@/lib/db/actions/cookies";
import { RedirectWithToast } from "@/app/_components/redirectToast";
import {getUserDungeonsWithInfo} from "@/lib/db/actions/lobby";

export default async function LobbyPage() {
  let currentUserSub = await getSub();

  if (!currentUserSub) {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    currentUserSub = currentUser?.userId;

    if (currentUserSub === undefined) {
      redirect("/");
    }
  }

  const character = await prisma.character.findFirst({
    where: {
      userId: currentUserSub,
    },
  });

  const battleInfo = await getUserDungeonsWithInfo(currentUserSub)

  if (!character) {
    return (
      <RedirectWithToast
        href={"/dashboard/character"}
        title={"No character found"}
        description={"Redirecting you to character creation..."}
        variant={"destructive"}
      />
    );
  }

  return (
    <section className="grid grid-cols-[1fr_5fr_1fr] w-full h-full">
      <div className="col-start-2 flex flex-col h-full">
        <div className="flex flex-row mt-16 mb-14 justify-between items-center">
          <div className="text-4xl">
              <h3>Party Lobby</h3>
              {battleInfo.data && (
                  <div className={"text-sm"}>{JSON.stringify(battleInfo.data)}</div>
              )}
          </div>
        </div>
        <div className="grid grid-rows-3 items-center h-full -mt-10 mb-6">
          {!character.roomId && (
            <div className="col-span-3 text-center -mt-6">
              Join the party first.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
