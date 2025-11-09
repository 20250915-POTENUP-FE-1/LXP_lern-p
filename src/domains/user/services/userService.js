import { db } from "@/shared/lib/firebase/config";
import { doc, getDoc, } from "firebase/firestore";


const getUserProfile = async (uid) => {
  // 1. "users" 컬렉션에서 uid 문서를 가리키는 docRef를 만든다.
  // 2. getDoc(docRef) 실행 → 결과를 snap 이라고 하자.
  // 3. snap.exists() 이면 → snap.data() 반환
  //    아니라면 → null 반환
  const snap = await getDoc(doc(db, "users", uid));
  if(snap.exists()){
    return snap.data();
  }else{
    return null;
  }
  // (await getDoc(doc(db, "users", uid))).data() ?? null;
}

export { getUserProfile };

