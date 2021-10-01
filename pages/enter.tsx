import { initializeApp } from '@firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from '@firebase/auth';
import {GetStaticProps} from 'next';
import { useRouter } from 'next/dist/client/router';
import {useState} from "react"
import styles from '../styles/enter.module.css'
import {createHmac} from 'crypto'
import Siteinfo from '../components/siteinfo'

export const getStaticProps:GetStaticProps = async (ctx) => {

    interface settings {
        apiKey: string | undefined,
        authDomain: string | undefined,
        databaseURL: string | undefined,
        projectId: string | undefined,
        storageBucket: string | undefined,
        messagingSenderId: string | undefined,
        appId: string | undefined,
        measurementId: string | undefined
    }

    const props: settings = {
        apiKey: process.env.NEXT_APP_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_APP_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_APP_MEASUREMENT_ID
    }

    return {
        props
    }
}

export default function Enter(props: object) {

    const app = initializeApp(props)

    const auth = getAuth()
    const router = useRouter()

    interface validation {lowercase: boolean, uppercase: boolean, number: boolean, special: boolean, long: boolean, user: boolean, em: boolean}

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [pic, setPic] = useState<string>("/profile_placeholder.svg")
    const [switchCondition, setSwitchCondition] = useState<boolean>(false)
    const [passwordValidator, setPasswordValidator] = useState<validation>({lowercase: false, uppercase: false, number: false, special: false, long: false, user: false, em: false})
    const [canCreate, setCanCreate] = useState<boolean>(false)
    const [theError, setTheError] = useState<string>("")

    function settingEmail(event: any){
        setEmail(event.target.value)
        if(email){
            setPasswordValidator(current =>({  ...current, em: true }))
        } else {
            setPasswordValidator(current =>({  ...current, em: false }))
        }
    }

    function settingUsername(event: any){
        setName(event.target.value)
        if(name){
            setPasswordValidator(current =>({  ...current, user: true }))
        } else {
            setPasswordValidator(current =>({  ...current, user: false }))
        }
    }

    function settingPassword(event: any){
        setPassword(event.target.value)
        if(password.match(/[a-z]/g) && !passwordValidator.lowercase){
            setPasswordValidator(current =>({  ...current, lowercase: true }))
        }
        if(password.match(/[A-Z]/g) && !passwordValidator.uppercase){
            setPasswordValidator(current =>({  ...current, uppercase: true }))
        }
        if(password.match(/[0-9]/g) && !passwordValidator.number){
            setPasswordValidator(current =>({  ...current, number: true }))
        }
        if(password.match(/[^a-zA-z0-9]/g) && !passwordValidator.special){
            setPasswordValidator(current =>({  ...current, special: true }))
        }

        if(!password.match(/[a-z]/g) && passwordValidator.lowercase){
            setPasswordValidator(current =>({  ...current, lowercase: false }))
        }
        if(!password.match(/[A-Z]/g) && passwordValidator.uppercase){
            setPasswordValidator(current =>({  ...current, uppercase: false }))
        }
        if(!password.match(/[0-9]/g) && passwordValidator.number){
            setPasswordValidator(current =>({  ...current, number: false }))
        }
        if(!password.match(/[^a-zA-z0-9]/g) && passwordValidator.special){
            setPasswordValidator(current =>({  ...current, special: false }))
        }

        if(password.length >= 8){
            setPasswordValidator(current =>({  ...current, long: true }))
        } else {
            setPasswordValidator(current =>({  ...current, long: false }))
        }

        if(passwordValidator.lowercase && passwordValidator.uppercase && passwordValidator.number && passwordValidator.special && passwordValidator.long && passwordValidator.user && passwordValidator.em){
            setCanCreate(true)
        } else {
            setCanCreate(false)
        }

        if(event.key === "Enter" && canCreate){
            signUp(email, password, name, pic)
        }
    }
    
    async function createPicture(event: any){
        const hash = createHmac('sha256', pic + name + email).update(pic + name + email).digest('hex');
        const storage = getStorage(app)
        const storageRef = ref(storage, `/profilePictures/${hash}.webp`)
        if(auth.currentUser !== null){
            uploadBytes(storageRef, event.target.files[0]).then(async (snapshot) => {
                updateProfile(auth.currentUser, {
                    displayName: name ? name : email,
                    photoURL: await getDownloadURL(snapshot.ref).then(results => results)
                }).then(() => router.push("/dashboard"))
            })
        }
    }

    async function signIn(email: string, password: string){
        await signInWithEmailAndPassword(auth, email, password).then(user => {
            router.push("/dashboard")
        }).catch(error => setTheError(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))
    }

    async function signUp(email: string, password: string, name: string, pic: string){
        let willUsePicture = await confirm("Do you want to have a profile image?")

        await createUserWithEmailAndPassword(auth, email, password).then(async newUser => {
            if(willUsePicture){
                setSwitchCondition(condition => !condition)
            } else {
                await alert("Will use placeholder as profile image")
                updateProfile(newUser.user, {
                    displayName: name ? name : email,
                    photoURL: pic
                })
                router.push("/dashboard")
            }
        }).catch(error => {
            setTheError(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", ""))
            console.log(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", ""))
        })
    }



    return (
        <>
        <Siteinfo />
        <div id={styles.container}>
            {theError && <h1>{theError}</h1>}
            <div>
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="email" />
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="password" onKeyDown={event => event.key === "Enter" && signIn(email, password)} />
                <button  onClick={event => signIn(email, password)}>Sign In</button>
            </div>

            <div>
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="email" />
                <button onClick={() => sendPasswordResetEmail(auth, email).then(() => setTheError("a link to reset your password has been sent to " + email)).catch(error => setTheError(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))}>Reset Password</button>
            </div>

            <div>
                <input type="email" value={email} onChange={settingEmail} onKeyUp={settingEmail} onKeyDown={settingEmail} placeholder="email" />
                <input type="text" value={name} onChange={settingUsername} onKeyUp={settingUsername} onKeyDown={settingUsername} placeholder="Username" />
                <input type="password" value={password}  placeholder="password" onChange={settingPassword} onKeyUp={settingPassword} onKeyDown={settingPassword} />
                {canCreate ? <button  onClick={event => signUp(email, password, name, pic)}>Sign Up</button> : <button  style={{ opacity: "0.4", cursor: "default" }}>Sign Up</button>}
                {password.length < 8 && <p>Password needs to have more than 8 characters</p> }
                {passwordValidator.uppercase ? <p>[checked] password has a capital letter</p> : <p>password needs a capital letter</p>}
                {passwordValidator.lowercase ? <p>[checked] password has a lowercase letter</p> : <p>password needs a lowercase letter</p>}
                {passwordValidator.number ? <p>[checked] password has a number</p> : <p>password needs a number</p>}
                {passwordValidator.special ? <p>[checked] password has a special character</p> : <p>password needs a special character</p>}
                {switchCondition &&
                    <>
                    <img src={pic} />
                    <input type="file" accept=".jpg, .jpeg, .png, .svg, .webp" onChange={createPicture} />
                    </>
                }
            </div>
        </div>
        </>
    );
}