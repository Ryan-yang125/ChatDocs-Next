export interface IDocMeta {
  id?: number;
  folderName?: string;
  fileName: string;
  fileSourceData?: string;
  model: {
    args: string;
    docstore: string;
    hnswlibIndex: string;
  };
}
