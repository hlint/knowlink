import {
  actionDeleteNotes,
  actionMoveNotes,
} from "@/app/(main)/actions/note-list";
import type { NoteLite } from "@/app/(main)/schema/note";
import { createZustandStore } from "@/lib/create-zustand-store";
import type { Category, Note } from "@prisma/client";
import type { Subcategory } from "@prisma/client";
import { debounce } from "radashi";
import { actionGetNotePreview } from "../../actions/note-list";

type PageSubcategoryStore = {
  category: Category | null;
  subcategory: Subcategory | null;
  selectedNoteIds: string[];
  editMode: boolean;
  notes: NoteLite[];
  previewNote: Note | null;
  fetchingPreviewNote: boolean;
};

const initialState: PageSubcategoryStore = {
  category: null,
  subcategory: null,
  selectedNoteIds: [],
  editMode: false,
  notes: [],
  previewNote: null,
  fetchingPreviewNote: false,
};

export const useNoteListStore = createZustandStore(
  initialState,
  (set, get) => ({
    actions: {
      setValues: (values: Partial<PageSubcategoryStore>) => {
        set((d) => {
          Object.assign(d, values);
        });
      },
      fetchPreviewNoteById: debounce({ delay: 50 }, async (noteId: string) => {
        set((d) => {
          d.fetchingPreviewNote = true;
        });
        const note = await actionGetNotePreview(noteId);
        set((d) => {
          d.fetchingPreviewNote = false;
          d.previewNote = note;
        });
      }),
      toggleEditMode: () => {
        set((d) => {
          d.editMode = !d.editMode;
        });
      },
      toggleSelectNote: (noteId: string) => {
        set((d) => {
          d.selectedNoteIds = d.selectedNoteIds.includes(noteId)
            ? d.selectedNoteIds.filter((id) => id !== noteId)
            : [...d.selectedNoteIds, noteId];
        });
      },
      toggleSelectAllNotes: () => {
        set((d) => {
          d.selectedNoteIds =
            d.selectedNoteIds.length === d.notes.length
              ? []
              : d.notes.map((note) => note.id);
        });
      },
      deleteSelectedNotes: async (deletePermanently = false) => {
        await actionDeleteNotes(get().selectedNoteIds, deletePermanently);
        set((d) => {
          d.selectedNoteIds = [];
        });
      },
      moveSelectedNotes: async (subcategoryId: string) => {
        await actionMoveNotes(get().selectedNoteIds, subcategoryId);
        set((d) => {
          d.selectedNoteIds = [];
        });
      },
    },
  }),
);
