import { Router, Request, Response } from "express";
import FirebaseProvider from "../provider/firebaseProvider";

const router = Router();

router.get("/:shortCode", async (req: Request, res: Response) => {
  const shortCode = req.params.shortCode;
  const originalUrl = await FirebaseProvider.getOriginalUrl(shortCode);
  if (originalUrl != null) {
    res.redirect(originalUrl);
  } else {
    res.status(400).send({ message: "Failed to find Original URL" });
  }
});

export default router;
