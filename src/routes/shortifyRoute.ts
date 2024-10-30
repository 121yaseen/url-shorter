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
  const shortCode: string = await generateHash(url);
  await FirebaseProvider.saveURLMapping(shortCode, url);
  res.json({
    code: shortCode,
  });
});

const generateHash = async (
  url: string,
  length: number = 8
): Promise<string> => {
  const urlBuffer = new TextEncoder().encode(url);
  const hashBuffer = await crypto.subtle.digest("SHA-256", urlBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex.slice(0, length);
};

export default router;
