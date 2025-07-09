import { Button } from "@/components/ui/button";
import { importFile, selectFileFromBrowser } from "@/lib/file.client";
import { useState } from "react";
import { toast } from "sonner";
import { actionCleanUpload, actionImportBookmarks } from "./actions";

export default function TabAbout() {
  return (
    <div className="prose prose-sm max-w-none px-4 flex flex-col md:flex-row gap-4">
      <div className="flex flex-col gap-4 flex-1">
        <SectionImportBookmarks />
        <SectionCleanUpload />
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <SectionExportData />
        <SectionImportData />
      </div>
    </div>
  );
}

function SectionImportBookmarks() {
  return (
    <div>
      <h2>Import Bookmarks</h2>
      <p>
        It should be a html file like <code>bookmarks.html</code> which needs to
        be exported from your browser manually.
      </p>
      <p>For now, we support the following formats:</p>
      <ul>
        <li>Netscape Bookmarks(Firefox, Google Chrome, ...)</li>
        <li>
          Pocket(
          <a href="http://getpocket.com" target="_blank" rel="noreferrer">
            http://getpocket.com
          </a>
          )
        </li>
      </ul>
      <ButtonImportBookmarks />
    </div>
  );
}

function SectionExportData() {
  return (
    <div>
      <h2>Export Data</h2>
      <p>
        Export your data to a file. This will download a copy of your data in
        the SQLite database format.
      </p>
      <Button asChild className="no-underline">
        <a href="/settings/export-data">Export Data</a>
      </Button>
      <Button asChild variant="link">
        <a href="https://sqliteviewer.app/" target="_blank" rel="noreferrer">
          Inspect file in SQLite Viewer
        </a>
      </Button>
    </div>
  );
}

function SectionImportData() {
  return (
    <div>
      <h2>Import Data</h2>
      <p>
        Import your data from a database file like{" "}
        <code>knowlink.06-27.db</code>
      </p>
      <p>
        <strong>Warning:</strong> This action will replace your current
        database. Make sure to backup your data before proceeding.
      </p>
      <ButtonImportData />
    </div>
  );
}

function SectionCleanUpload() {
  return (
    <div>
      <h2>Clean Assets</h2>
      <p>Clean unused assets in the upload folder.</p>
      <ButtonCleanUpload />
    </div>
  );
}

function ButtonImportBookmarks() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const file = await selectFileFromBrowser(false, "text/html").catch(
          () => null,
        );
        if (!file) {
          setLoading(false);
          return;
        }
        const str = await importFile(file);
        toast.promise(actionImportBookmarks(str), {
          loading: "Importing bookmarks...",
          success: "Bookmarks imported successfully",
          error: "Failed to import bookmarks",
        });
        setLoading(false);
      }}
    >
      Import Bookmarks
    </Button>
  );
}

function ButtonCleanUpload() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        toast.promise(actionCleanUpload(), {
          loading: "Cleaning assets...",
          success: (data) =>
            `Assets cleaned successfully. ${data.unusedFiles} / ${data.totalFiles} files cleaned.`,
          error: "Failed to clean assets",
        });
        setLoading(false);
      }}
    >
      Clean Upload
    </Button>
  );
}

function ButtonImportData() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const file = await selectFileFromBrowser(false, ".db");
          if (!file) {
            setLoading(false);
            return;
          }
          await uploadFile(file, "/settings/import-data");
          toast.success("Database imported successfully!");
        } catch (error) {
          console.error("Import data error:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to import data",
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      Import Database
    </Button>
  );
}

async function uploadFile(file: File, path = "/api/upload") {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(path, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to upload file");
  }
}
