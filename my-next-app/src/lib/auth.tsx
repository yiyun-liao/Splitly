// ---------- 登入 / 登出 ----------
import { signInWithPopup, signOut, getAdditionalUserInfo } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { getRandomAvatarIndex } from "@/utils/getAvatar";
import { createNewUser } from "@/lib/userApi";
import toast from "react-hot-toast";


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
                uid_in_auth: result.user.uid,
                avatar: getRandomAvatarIndex(),
            }

            // to backend
            console.log("new member! try to ", token, newUserData)
            await createNewUser(token, newUserData);
        }
        // console.log(result.user)
        toast.success('登入成功')
        return true;
    } catch (error) {
        toast.error('登入失敗，再試一次')
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