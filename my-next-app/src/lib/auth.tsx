// ---------- 登入 / 登出 ----------
import { signInWithPopup, signOut, getAdditionalUserInfo,createUserWithEmailAndPassword,signInWithEmailAndPassword,UserCredential,setPersistence, browserLocalPersistence } from "firebase/auth";
import { FirebaseError } from "firebase/app";  
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
            // console.log("new member! try to ", token, newUserData)
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


// =========== demo account ==============

const DEMO_EMAIL = "testtest.splitly@example.com";
const DEMO_PWD   = "Splitly1234";

export async function logInDemoUser() {
    try {
        // 1. 確保 local persistence 已設定
        await setPersistence(auth, browserLocalPersistence);
    
        // 2. 如果已經有 user，先登出
        if (auth.currentUser) {
            await signOut(auth);
        }
    
        try {
            // 3. 嘗試用 email/password 登入
            await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PWD);
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
            switch (err.code) {
                case "auth/user-not-found":
                toast.error("查無用戶");
                break;

                case "auth/wrong-password":
                toast.error("測試帳號密碼錯誤");
                return false;

                case "auth/invalid-email":
                toast.error("Demo Email 格式不正確");
                return false;
                
                default:
                console.error("Demo 登入錯誤:", err);
                toast.error("Demo 登入失敗");
                return false;
            }
            }
            throw err;
        }
    
        toast.success("以測試帳號登入成功");
        return true;
    } catch (error) {
        console.error("Demo 登入失敗:", error);
        toast.error("Demo 登入失敗，再試一次");
        return false;
    }
}

export async function signupDemoUser() {
    try {
        // 1. 確保 local persistence 已設定
        await setPersistence(auth, browserLocalPersistence);
    
        // 2. 如果已經有 user，先登出
        if (auth.currentUser) {
            await signOut(auth);
        }
  
        // 5. 拿 ID token
        const cred = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PWD);
        const token = await cred.user.getIdToken();
        console.log("建立測試帳號");
        // 6. call 後端
        await createNewUser(token, {
            name: "Demo User",
            email: DEMO_EMAIL,
            uid_in_auth: cred.user.uid,
            avatar: 1,
        });
    
        toast.success("以測試帳號登入成功");
        return true;
    } catch (error) {
        console.error("Demo 登入失敗:", error);
        toast.error("Demo 登入失敗，再試一次");
        return false;
    }
}

