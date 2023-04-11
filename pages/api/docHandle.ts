// import {text} from '@/utils/texts'
import type { NextApiRequest, NextApiResponse } from "next";

import {
  HNSWLib,
  type HNSWLib as StoreTypeHNSWLib,
} from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import * as fs from "fs";
import * as path from "path";
const storeSaveDir = "tmp/vectorIndexs";
const vectorStoreFilesName = {
  args: "args.json",
  docstore: "docstore.json",
  hnswlib: "hnswlib.index",
};

async function handleDocs(text: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  return vectorStore;
}

// any better method?
async function vectorStoreToBinary(store: StoreTypeHNSWLib) {
  // files saved to tmp dir:
  // args.json
  // docstore.json
  // hnswlib.index --- binary
  // fix no such file or directory, mkdir 'tmp'
  fs.mkdirSync(storeSaveDir, { recursive: true });
  await store.save(storeSaveDir);
}

function readVectorStore() {
  console.log("read from " + storeSaveDir);
  const hnswlibIndex = fs.readFileSync(
    path.join(storeSaveDir, vectorStoreFilesName.hnswlib),
    "hex",
  );
  const args = fs
    .readFileSync(path.join(storeSaveDir, vectorStoreFilesName.args))
    .toString();
  const docstore = fs
    .readFileSync(path.join(storeSaveDir, vectorStoreFilesName.docstore))
    .toString();
  // console.log(libBinData);
  return {
    hnswlibIndex,
    args,
    docstore,
  };
}
export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { text } = JSON.parse(req.body);
  // console.log(text);

  if (!text) {
    return res.status(400).json({ message: "No question in the request" });
  }

  // tmp
  if (fs.existsSync(storeSaveDir)) {
    console.log("read from " + storeSaveDir);
    const data = readVectorStore();
    return res.status(200).send({
      ...data,
    });
  }
  //
  try {
    const vectorStore = await handleDocs(text);
    await vectorStoreToBinary(vectorStore);
    console.log(vectorStore._index);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "error on handleDocs" + error });
  }
  const data = readVectorStore();
  res.status(200).send({
    ...data,
  });
}

export const config = {
  api: {
    bodyParser: true, // Disallow body parsing, consume as stream
  },
};
