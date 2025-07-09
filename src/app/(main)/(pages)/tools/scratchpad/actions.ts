"use server";
import { checkUserAdmin } from "@/dal-server-action";
import { actionSetEntryByName } from "../../../actions/miscs";

export async function actionSetScratchpadContent(content: string) {
  await checkUserAdmin();
  await actionSetEntryByName("scratchpad", content);
}
