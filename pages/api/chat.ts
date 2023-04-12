import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { makeChain } from "@/utils";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { storesDir } from "@/utils/file-handler";

let vectorStore: HNSWLib;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  sendData(JSON.stringify({ data: "" }));

  // load store
  if (!vectorStore) {
    vectorStore = await HNSWLib.load(storesDir, new OpenAIEmbeddings());
  }
  //create chain
  const chain = makeChain(vectorStore, (token: string) => {
    sendData(JSON.stringify({ data: token }));
  });

  try {
    //Ask a question
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log("response", response);
    sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }));
  } catch (error) {
    console.log("error", error);
  } finally {
    sendData("[DONE]");
    res.end();
  }
}
