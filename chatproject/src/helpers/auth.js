import { app } from "../services/firebase";
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup } from "firebase/auth";


export const auth = getAuth(app);


export function signup(email, password) {
  return createUserWithEmailAndPassword(auth,email, password);
}

export function signin(email, password) {
  return signInWithEmailAndPassword(auth,email, password);
}

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth,provider);
}



export function logout() {
    return auth.signOut();
  }