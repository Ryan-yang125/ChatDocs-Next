import Dexie, { Table } from "dexie";
import { IDocMeta } from "@/types";

export class MyDocDb extends Dexie {
  docs!: Table<IDocMeta>;

  constructor() {
    super("myDocDb");
    this.version(1).stores({
      docs: "++id, folderName, fileName, fileSourceData, model",
    });
  }
}

export const db = new MyDocDb();