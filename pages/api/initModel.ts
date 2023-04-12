import type { NextApiRequest, NextApiResponse } from "next";
import { saveHNSWLibModelToLocal } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const docMeta = JSON.parse(req.body);
  console.log(docMeta);

  await saveHNSWLibModelToLocal(docMeta.model);
  res.status(200).json({ message: "ok" });
}
