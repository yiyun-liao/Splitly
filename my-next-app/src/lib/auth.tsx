// ---------- 登入 / 登出 ----------
import { signInWithPopup, signOut, getAdditionalUserInfo } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { getRandomAvatarIndex } from "@/utils/avatar";
import { syncUserToBackend } from "@/lib/userApi";

export async function logInUser() {
    try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
        const token = await result.user.getIdToken();

        if (!token){
            console.error("no token")
        }

        if (isNewUser){
            const newUserData = {
                name: result.user.displayName ?? "",
                email: result.user.email ?? "",
                uidInAuth: result.user.uid,
                avatar: getRandomAvatarIndex(),
            }
            // to firebase firestore
            // await setDoc(doc(db, 'users', result.user.uid), {
            //     ...newUserData,
            //     createdAt: serverTimestamp(),
            // });

            // to backend
            console.log("new member! try to ", token, newUserData)
            await syncUserToBackend(token, newUserData);
        }
        console.log(result.user)
        return true;
    } catch (error) {
        console.error("Log in error:", error);
        return false;
    }
}

export async function logOutUser() {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
}