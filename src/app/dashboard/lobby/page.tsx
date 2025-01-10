import { runWithAmplifyServerContext } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import prisma from "@/lib/db/prisma";
import { getSub } from "@/lib/db/actions/cookies";
import { RedirectWithToast } from "@/app/_components/redirectToast";
import {getUserDungeonsWithInfo} from "@/lib/db/actions/lobby";
import {Character} from "@/static/types/character";

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

  const battleInfo: any = await getUserDungeonsWithInfo(currentUserSub)

    console.log("battleInfo: ", battleInfo)

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
        <div className="w-full flex flex-row mt-16 mb-14 justify-between items-center">
          <div className="text-4xl w-full">
              <h3>Party Lobby</h3>
              {battleInfo.data && (
                  <div className={"w-full"}>
                      <div className={""}>
                          <h3 className={"text-base"}>Players</h3>
                          <div className={"w-full flex gap-4 items-center"}>
                              {
                                battleInfo.data.participants.map((character: Character) => {
                                    return (
                                        <div
                                            key={character.id}
                                            className={"text-sm w-[250px] h-[400px] bg-bright-red"}
                                        >
                                            <h6>name: {character.name}</h6>
                                            <h6>description: {character.description}</h6>
                                        </div>
                                    )
                                })
                              }
                          </div>
                      </div>
                      <div className={"w-full mt-20"}>
                          <h3 className={"text-base"}>Battle Info</h3>
                          <div className={"min-w-[80%] min-h-[80px] bg-[#101010] text-sm"}>
                              <h6>id: {battleInfo.data.id}</h6>
                              <h6>dungeonType: {battleInfo.data.dungeonType}</h6>
                              <h6>description: {battleInfo.data.description}</h6>
                              <h6>roomStatus: {battleInfo.data.roomStatus}</h6>
                              <h6>invitationCode: {battleInfo.data.invitationCode}</h6>
                          </div>
                      </div>
                  </div>
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
