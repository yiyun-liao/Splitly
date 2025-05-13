'use client';
import Button from "../Button"
import { useRouter } from 'next/navigation';
import { logOutUser } from "./auth-utils";


interface LogOutFormProps {
    type?: string;
}

export default function LogOutForm({type}:LogOutFormProps){
    const router = useRouter();

    function redirectPage(){
        router.push('/account');    
    }

    async function handleLogOut() {
        await logOutUser();
        console.log('Logged out!');
    }
    return(
        <div>
            <div className="flex justify-end gap-2">
                <Button 
                    variant="text-button" 
                    width='full'
                    onClick={handleLogOut} 
                    >
                        {type}
                </Button>
                <Button 
                    variant="solid" 
                    width='full' 
                    onClick={redirectPage}>
                        Account Page
                </Button>
            </div>
        </div>
    )
}