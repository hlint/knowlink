import type { Tool } from "@/lib/ai-agent/types/tool";
import { appClientRedirectTool } from "./app_client_redirect";
import { appCreateNoteTool } from "./app_create_note";
import { appGetCalendarEventsTool } from "./app_get_calendar_events";
import { appGetCategoriesTool } from "./app_get_categories";
import { appGetNoteDetailsTool } from "./app_get_note_details";
import { appGetNoteListTool } from "./app_get_note_list";
import { appThemeSwitchTool } from "./app_theme_switch";
import { appUpdateNoteTool } from "./app_update_note";
import { appUpsertCalendarEventTool } from "./app_upsert_calendar_event";
import { appWriteCategoriesTool } from "./app_write_categories";
import { docWritingExpertTool } from "./doc_writing_expert";

export const appTools = [
  appGetCategoriesTool,
  appThemeSwitchTool,
  appWriteCategoriesTool,
  appCreateNoteTool,
  docWritingExpertTool,
  appUpdateNoteTool,
  appGetNoteDetailsTool,
  appGetNoteListTool,
  appClientRedirectTool,
  appGetCalendarEventsTool,
  appUpsertCalendarEventTool,
] as unknown as Tool[];
