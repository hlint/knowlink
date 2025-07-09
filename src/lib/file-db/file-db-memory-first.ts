// Simple file based db, read / write data from memory first, then save to file with delay
// Warning: this db is not thread-safe, so it should be used in single-threaded environment only, Next.js server is not single-threaded

import { debounce } from "radashi";
import { FileDbBase } from "./file-db-base";

export class FileDbMemoryFirst<T> extends FileDbBase<T> {
  private loaded = false;
  private data = {} as T;
  private saveDebounce = debounce({ delay: 500, leading: false }, () =>
    this.save(this.data),
  );
  public async select<P>(selector: (data: T) => P) {
    if (this.loaded) {
      return selector(this.data);
    }
    this.data = await this.load();
    this.loaded = true;
    return selector(this.data);
  }

  public async update(updater: (data: T) => T) {
    this.data = updater(this.data);
    this.saveDebounce();
  }
}
