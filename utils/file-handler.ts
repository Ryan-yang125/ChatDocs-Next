import {
  HNSWLib,
  type HNSWLib as StoreTypeHNSWLib,
} from "langchain/vectorstores/hnswlib";
import type { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from "path";
import fs from "fs-extra";

const ifDev = process.env.NODE_ENV === "development";
// in prod mode, only allowed to write to /tmp/
// https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
export const storesDir = ifDev ? "tmp/hnswlib-stores" : "/tmp/hnswlib-stores";

type HNSWLibModel = {
  args: string;
  docstore: string;
  hnswlibIndex: string;
};

const HNSWLibModelFilesName = {
  args: "args.json",
  docsStore: "docstore.json",
  hnswlibIndex: "hnswlib.index",
};

// looking forward to a better way to transfrom hnswlibStore <=> indexes
export async function HNSWLibModelToVectorStore(
  model: HNSWLibModel,
  embeddings: OpenAIEmbeddings,
) {
  // save model to /tmp/
  await Promise.all(
    Object.keys(HNSWLibModelFilesName).map((key) =>
      fs.outputFile(
        path.join(
          storesDir,
          (HNSWLibModelFilesName as Record<string, string>)[key],
        ),
        (model as Record<string, string>)[key],
      ),
    ),
  );
  // load from dir
  const vectorStore = await HNSWLib.load(storesDir, embeddings);
  return vectorStore;
}

export async function vectorStoreToHNSWLibModel(
  store: StoreTypeHNSWLib,
): Promise<HNSWLibModel> {
  await store.save(storesDir);
  const [args, docstore, hnswlibIndex] = await Promise.all([
    fs.readFile(path.join(storesDir, HNSWLibModelFilesName.args), "utf-8"),
    fs.readFile(path.join(storesDir, HNSWLibModelFilesName.docsStore), "utf-8"),
    fs.readFile(
      path.join(storesDir, HNSWLibModelFilesName.hnswlibIndex),
      "hex",
    ),
  ]);
  return {
    args,
    docstore,
    hnswlibIndex,
  };
}
