import { Router, Request, Response } from "express";
import crypto from "crypto";
import FirebaseProvider from "../provider/firebaseProvider";

const router = Router();

router.post("/shortify", async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }
  const shortCode: string = generateHash(url);
  await FirebaseProvider.saveURLMapping(shortCode, url);
  res.json({
    code: shortCode,
  });
});

const generateHash = (url: string): string => {
  const hash: string = crypto.createHash("md5").update(url).digest("hex");
  return hash.substring(0, 8);
};

export default router;
