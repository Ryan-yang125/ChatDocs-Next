import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import * as path from "path";
import { IDocMeta } from "@/types";

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
  sourceData: "sample.txt",
};
async function loadModel(docMeta: IDocMeta) {
  if (!fs.existsSync(storeSaveDir)) {
    fs.mkdirSync("tmp");
    fs.mkdirSync(storeSaveDir);
    const { model } = docMeta;
    fs.writeFileSync(
      path.join(storeSaveDir, vectorStoreFilesName.args),
      model.args,
    );
    fs.writeFileSync(
      path.join(storeSaveDir, vectorStoreFilesName.hnswlib),
      Buffer.from(model.hnswlibIndex),
    );
    fs.writeFileSync(
      path.join(storeSaveDir, vectorStoreFilesName.docstore),
      model.docstore,
    );
    // fs.writeFileSync(path.join("tmp/docs", vectorStoreFilesName.sourceData), docMeta.fileSourceData)
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const docMeta: IDocMeta = JSON.parse(req.body);
  // const {fileName, fileSourceData, model} = docMeta
  // console.log(fileName, fileSourceData);
  // console.log(model);

  loadModel(docMeta);
  res.status(200).json({ message: "ok" });
}
