import type { Note } from "@prisma/client";

export type NoteLite = Pick<
  Note,
  | "id"
  | "title"
  | "icon"
  | "link"
  | "subcategoryId"
  | "pending"
  | "deleted"
  | "pinned"
  | "confidential"
>;
