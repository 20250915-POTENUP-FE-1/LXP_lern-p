import { db } from "@/shared/lib/firebase/config";
import { doc, getDoc, } from "firebase/firestore";

export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
}