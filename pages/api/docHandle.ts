import type { NextApiRequest, NextApiResponse } from 'next';

import {
  readHNSWLibModelFromLocal,
  storesDir,
  vectorStoreToHNSWLibModel,
} from '@/utils';
import fs from 'fs-extra';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

async function handleDocs(text: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  console.log(docs);

  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  console.log(vectorStore);

  return vectorStore;
}

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { text } = JSON.parse(req.body);
  // console.log(text);

  if (!text) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  // TODO: remove start
  const exists = await fs.exists(storesDir);
  console.log(exists);

  if (exists) {
    console.log('read from ' + storesDir);
    const model = await readHNSWLibModelFromLocal();
    return res.status(200).send({
      ...model,
    });
  }
  // TODO: remove end
  const vectorStore = await handleDocs(text);
  const model = await vectorStoreToHNSWLibModel(vectorStore);
  res.status(200).send({
    ...model,
  });
}

export const config = {
  api: {
    bodyParser: true, // Disallow body parsing, consume as stream
  },
};
