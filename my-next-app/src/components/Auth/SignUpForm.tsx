'use client'
import { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { validateEmail,validatePassword,signUpCheck } from './auth-utils';

interface SignUpFormProps {
    type?: string;
}

export default function SignUpForm({type}:SignUpFormProps){
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [submitted, setSubmitted] = useState(true);

    const showEmailError = validateEmail(enteredEmail);
    const showPasswordError = validatePassword(enteredPassword);
    const formInvalid = !!showEmailError || !!showPasswordError;
    
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        if (formInvalid) {
            setSubmitted(false);
            setEnteredEmail('');
            setEnteredPassword('');
            return;
        }
        
        const result = await signUpCheck(enteredEmail, enteredPassword);
        if(result.success){
            setSubmitted(true);
            // console.log('sign up success:', result.data.uid);
        }else{
            setSubmitted(false);
            console.log('Sign up fail');
            setEnteredEmail('');
            setEnteredPassword('');
            alert('Sign up fail');
        }
    }


    return(
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-6">
                <Input
                    label = 'Email'
                    type="email"
                    value={enteredEmail}
                    invalid={!submitted && !!showEmailError}
                    errorMessage={!submitted && showEmailError ? showEmailError : ''}
                    onChange={(e) => setEnteredEmail(e.target.value)}
                    />
                <Input
                    label = 'Password'
                    type="password"
                    value={enteredPassword}
                    invalid={!submitted && !!showPasswordError}
                    autoComplete='new-password'
                    errorMessage={!submitted && showPasswordError ? showPasswordError : ''}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    />
            </ div>
            <div className="flex justify-end gap-2">
                <Button 
                    variant="solid" 
                    width='full' 
                    type="submit">
                        {type}
                </Button>
            </div>
        </form>
    )
}