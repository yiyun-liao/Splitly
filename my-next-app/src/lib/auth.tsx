// ---------- 登入 / 登出 ----------
import { signInWithPopup, signOut, getAdditionalUserInfo, signInWithRedirect , UserCredential , getRedirectResult, } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { getRandomAvatarIndex } from "@/utils/getAvatar";
import { createNewUser } from "@/lib/userApi";

export async function logInUser() {
    const ua = navigator.userAgent;
    const inWebView = /Line|FBAN|FBAV|Instagram|Messenger|Twitter|MicroMessenger/i.test(ua);

    try {
        let result: UserCredential;

        if (inWebView) {
            // 在 WebView 裡走 redirect
            await signInWithRedirect(auth, provider);
            // signInWithRedirect 會重載頁面，後面用 getRedirectResult 拿到
            return true;
        } else {
            // 正常瀏覽器走 Popup
            result = await signInWithPopup(auth, provider);
        }

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
        console.log(result.user)
        return true;
    } catch (error) {
        console.error("Log in error:", error);
        return false;
    }
}

export async function handleRedirectResult(): Promise<UserCredential | null> {
    try {
        const result = await getRedirectResult(auth);
        return result;
    } catch (e) {
        console.warn("No redirect result:", e);
        return null;
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