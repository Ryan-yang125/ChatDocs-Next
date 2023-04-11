import type { NextApiRequest, NextApiResponse } from "next";
import {
  HNSWLib,
  type HNSWLib as StoreTypeHNSWLib,
} from "langchain/vectorstores/hnswlib";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { IDocMeta } from "@/types";
import * as fs from "fs";
import * as path from "path";

let vecStore: StoreTypeHNSWLib;

const model: IDocMeta["model"] = {
  args: "",
  hnswlibIndex: "",
  docstore: "",
};

const storeSaveDir = "tmp/vectorIndexs";
const vectorStoreFilesName = {
  args: "args.json",
  docstore: "docstore.json",
  hnswlib: "hnswlib.index",
};

async function loadModel() {
  vecStore = await HNSWLib.load(storeSaveDir, new OpenAIEmbeddings());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question } = JSON.parse(req.body);
  console.log("getQuestion", question);

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }
  const model = new OpenAI({});

  if (!vecStore) {
    await loadModel();
  }
  console.log(vecStore);

  const chain = VectorDBQAChain.fromLLM(model, vecStore);
  const ret = await chain.call({
    query: question,
  });
  console.log({ ret });
  return res.status(200).send({ ret });
}
