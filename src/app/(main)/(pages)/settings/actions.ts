"use server";
import { checkUserAdmin } from "@/dal-server-action";
import { fileStorage } from "@/integrations/file-storage";
import parseBookmarks, { type Bookmark } from "@/lib/bookmarks-parse";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { revalidatePath } from "next/cache";
import { actionSetEntryByName } from "../../actions/miscs";
import { getFavicon } from "../../lib/note-process";
import { type Configs, ConfigsSchema } from "../../schema/configs";

export async function actionSetAssistantPrompt(content: string) {
  await checkUserAdmin();
  await actionSetEntryByName("assistant_prompt", content);
  revalidatePath("/");
}

export async function actionSetWritingPrompt(content: string) {
  await checkUserAdmin();
  await actionSetEntryByName("writing_prompt", content);
  revalidatePath("/");
}

export async function actionImportBookmarks(fileString: string) {
  await checkUserAdmin();
  const bookmarks = await parseBookmarks(fileString);
  if (bookmarks.length === 0) return;
  const { id: rootCategoryId } = await prisma.category.create({
    data: {
      id: shortId(),
      name: "Imported Bookmarks",
    },
  });
  const getSubCategory = async (paths: string[]) => {
    const subName = paths.at(-1) || "unsorted";
    const sub = await prisma.subcategory.findFirst({
      where: {
        name: subName,
        categoryId: rootCategoryId,
      },
    });
    if (!sub) {
      return await prisma.subcategory.create({
        data: {
          id: shortId(),
          name: subName,
          categoryId: rootCategoryId,
        },
      });
    }
    return sub;
  };
  const saveBookmark = async (bookmark: Bookmark, paths: string[] = []) => {
    const sub = await getSubCategory(paths);
    const icon = await getFavicon(bookmark.url!).catch(() => "");
    await prisma.note.create({
      data: {
        id: shortId(),
        title: bookmark.title,
        icon,
        link: bookmark.url,
        content: "",
        subcategoryId: sub.id,
      },
    });
  };
  const dfs = async (bookmark: Bookmark, paths: string[] = []) => {
    if (bookmark.type === "bookmark") {
      await saveBookmark(bookmark, paths);
    }
    if (bookmark.children) {
      for (const child of bookmark.children) {
        await dfs(child, [...paths, bookmark.title]);
      }
    }
  };
  for (const bookmark of bookmarks) {
    await dfs(bookmark);
  }
  revalidatePath("/");
}

// 检查上传目录，删除未使用的文件
export async function actionCleanUpload() {
  await checkUserAdmin();
  const { files } = await fileStorage.list({ limit: 99999999 });
  const notes = await prisma.note.findMany({
    select: { icon: true, content: true },
  });
  const noteVersions = await prisma.noteVersion.findMany({
    select: { content: true },
  });
  const illustrations = await prisma.illustration.findMany({
    select: { src: true },
  });
  const content = [
    ...notes.map((note) => [note.icon, note.content].join("\n")),
    ...noteVersions.map((v) => v.content),
    ...illustrations.map((i) => i.src),
  ].join("\n");
  const unusedFiles = files.filter((file) => !content.includes(file.key));
  for (const file of unusedFiles) {
    await fileStorage.remove(file.key);
  }
  return {
    unusedFiles: unusedFiles.length,
    totalFiles: files.length,
  };
}

export async function actionSetConfigs(data: Configs) {
  await checkUserAdmin();
  const configs = ConfigsSchema.parse(data);
  for (const key of Object.keys(configs)) {
    await prisma.entry.upsert({
      where: { name: key, type: "config" },
      update: { content: configs[key as keyof Configs], type: "config" },
      create: {
        name: key,
        content: configs[key as keyof Configs],
        type: "config",
      },
    });
  }
  revalidatePath("/");
}
