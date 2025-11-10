import { db } from "@/shared/lib/firebase/config";
import { doc, getDoc, } from "firebase/firestore";


export const getUserProfile = async (uid) => {
  try {
    if(snap.exists()){
      return snap.data();
    }else{
      return null;
     }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export { getUserProfile };

