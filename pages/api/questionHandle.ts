import type { NextApiRequest, NextApiResponse } from 'next';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms';
import {
  HNSWLib,
  type HNSWLib as StoreTypeHNSWLib,
} from 'langchain/vectorstores/hnswlib';
let vecStore: StoreTypeHNSWLib;

const storeSaveDir = 'tmp/vectorIndexs';

async function loadModel() {
  vecStore = await HNSWLib.load(storeSaveDir, new OpenAIEmbeddings());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question } = JSON.parse(req.body);
  console.log('getQuestion', question);

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
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
