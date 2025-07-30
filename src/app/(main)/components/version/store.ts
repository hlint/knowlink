import { createZustandStore } from "@/lib/create-zustand-store";
import { actionGetNotePreview } from "../../actions/note-list";
import {
  actionCreateNoteVersion,
  actionDeleteNoteVersion,
} from "../../actions/version";
import {
  type VersionListItem,
  actionGetVersionContent,
  actionGetVersionCount,
  actionGetVersionList,
} from "./actions";

type PageNoteStore = {
  noteId: string;
  versionCount: number;
  modalOpen: boolean;
  versionList: VersionListItem[];
  versionListLoading: boolean;
  versionBodyLoading: boolean;
  currentVersionId: string;
  currentVersionContent: string;
  currentNoteContent: string;
  noteCreatedAt: Date;
  latestVersionContent: string;
  isCreateMode: boolean;
};

const initialState: PageNoteStore = {
  noteId: "",
  versionCount: 0,
  modalOpen: false,
  versionList: [],
  versionListLoading: false,
  versionBodyLoading: false,
  currentVersionId: "",
  currentVersionContent: "",
  currentNoteContent: "",
  noteCreatedAt: new Date(),
  latestVersionContent: "",
  isCreateMode: false,
};

export const useNoteVersionStore = createZustandStore(
  initialState,
  (set, get) => {
    const loadList = async () => {
      const list = await actionGetVersionList(get().noteId);
      set((d) => {
        d.versionList = list;
      });
    };
    const countVersions = async () => {
      const count = await actionGetVersionCount(get().noteId);
      set((d) => {
        d.versionCount = count;
      });
    };
    const updateLatestVersionContent = async () => {
      if (get().versionList.length === 0) {
        set((d) => {
          d.latestVersionContent = "";
        });
        return;
      }
      const latestVersionContent = await actionGetVersionContent(
        get().versionList[0].id,
      );
      set((d) => {
        d.latestVersionContent = latestVersionContent ?? "";
      });
    };
    const updateNoteContent = async () => {
      const note = await actionGetNotePreview(get().noteId);
      set((d) => {
        d.currentNoteContent = note?.content ?? "";
        d.noteCreatedAt = note?.createdAt ?? new Date();
      });
    };
    const reload = async (showLoading = false) => {
      if (showLoading) {
        set((d) => {
          d.versionListLoading = true;
        });
      }
      await Promise.all([countVersions(), loadList(), updateNoteContent()]);
      await updateLatestVersionContent();
      if (showLoading) {
        set((d) => {
          d.versionListLoading = false;
        });
      }
    };
    return {
      actions: {
        setValues: (values: Partial<PageNoteStore>) => {
          set((d) => {
            Object.assign(d, values);
          });
        },
        setCurrentVersionContent: async (versionId: string) => {
          set((d) => {
            d.currentVersionId = versionId;
            d.isCreateMode = false;
            d.versionBodyLoading = true;
          });
          const content = await actionGetVersionContent(versionId);
          set((d) => {
            d.currentVersionContent = content;
            d.versionBodyLoading = false;
          });
        },
        setIsCreateMode: (isCreateMode: boolean) => {
          set((d) => {
            d.isCreateMode = isCreateMode;
          });
        },
        createVersion: async (message: string) => {
          set((d) => {
            d.versionBodyLoading = true;
          });
          const version = await actionCreateNoteVersion({
            noteId: get().noteId,
            message: message,
          });
          set((d) => {
            d.versionList.unshift(version!);
            d.latestVersionContent = version!.content;
            d.versionBodyLoading = false;
            d.versionCount++;
          });
        },
        deleteVersion: async (versionId: string) => {
          await actionDeleteNoteVersion(versionId);
          await reload(true);
        },
        reload,
      },
    };
  },
);
