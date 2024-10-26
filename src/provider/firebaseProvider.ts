import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "../firebase/firebase";

interface URLMapping {
  shortCode: string;
  originalUrl: string;
}

class FirebaseProvider {
  urlMapping: Array<URLMapping>;
  constructor() {
    this.urlMapping = [];
  }
  async saveURLMapping(shortCode: string, originalUrl: string): Promise<void> {
    if (this.urlMapping.some((mapping) => mapping.shortCode == shortCode)) {
      return;
    }
    const returnedUrl = await this.getOriginalUrl(shortCode);
    if (returnedUrl != null) {
      this.pushToInMemoryStorage({ shortCode, originalUrl });
      return;
    }
    try {
      const urlMapping: URLMapping = { shortCode, originalUrl };
      await setDoc(doc(db, "urlMapping", shortCode), urlMapping);
      this.pushToInMemoryStorage(urlMapping);

      console.log(`Stored mapping ${shortCode} => ${originalUrl}`);
    } catch (err) {
      console.error(err);
    }
  }
  async getOriginalUrl(shortCode: string): Promise<string | null> {
    if (this.urlMapping.some((mapping) => mapping.shortCode == shortCode)) {
      return this.urlMapping.find((mapping) => mapping.shortCode == shortCode)
        .originalUrl;
    }
    try {
      const docRef = doc(db, "urlMapping", shortCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as URLMapping;
        const originalUrl = data.originalUrl;
        this.pushToInMemoryStorage({ shortCode, originalUrl });
        return originalUrl;
      } else {
        console.log("Short Code mapping not found");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  private pushToInMemoryStorage(urlMapping: URLMapping): void {
    if (this.urlMapping.length >= 100) {
      this.urlMapping = [];
    }
    this.urlMapping.push(urlMapping);
  }
}

export default new FirebaseProvider();
