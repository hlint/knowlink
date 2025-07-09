import parse from "bookmarks-parser";

/*
Each bookmark is an object with fields:

type - folder or bookmark
title - title of a bookmark or a folder
url - URL only for bookmarks
children - array of children bookmarks, only for folders
ns_root - if the folder is a root this field will contain one of the values: menu, toolbar, unsorted, otherwise null. Applicable only for netscape parser.
*/

export type Bookmark = {
  type: "folder" | "bookmark";
  title: string;
  url?: string;
  children?: Bookmark[];
  ns_root?: "menu" | "toolbar" | "unsorted";
};

export default function parseBookmarks(bookmarks: string): Promise<Bookmark[]> {
  return new Promise((resolve, reject) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    parse(bookmarks, (err: unknown, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res.bookmarks as Bookmark[]);
    });
  });
}
