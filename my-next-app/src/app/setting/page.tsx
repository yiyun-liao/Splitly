'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import SettingContent from "@/features/BasicLayout/SettingContent";

function SettingPage(){

    return( 
        <SettingContent/>
    )
}
export default withAuth(SettingPage);