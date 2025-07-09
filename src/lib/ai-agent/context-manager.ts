import { type Draft, produce } from "immer";
import { cloneDeep } from "radashi";
import { type Context, ContextSchema } from "./types/context";

export class ContextManager {
  private context: Context;
  private onContextUpdate: (context: Context) => void;
  constructor(
    initialContext: Context,
    onContextUpdate?: (context: Context) => void,
  ) {
    this.context = ContextSchema.parse(cloneDeep(initialContext || {}));
    this.onContextUpdate = onContextUpdate || (() => {});
  }

  public select<T>(selector: (context: Context) => T): Readonly<T> {
    return selector(this.context);
  }

  public updateContext(recipe: (draft: Draft<Context>) => void): void {
    this.context = produce(this.context, recipe);
    this.onContextUpdate(this.context);
  }
}
