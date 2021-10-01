import { initializeApp } from '@firebase/app';
import {GetStaticProps} from 'next';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/dist/client/router'
import React, {useEffect, useState} from 'react'
import Navbar from '../components/navbar';
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

export default function Dashboard(props: object) {
    const app = initializeApp(props)

    interface user {
        name: string,
        id: string,
        pic: string,
        email: string,
        password: string,
        newPassword: string,
    }

    const auth = getAuth()
    const router = useRouter()
    const [theUser, SetTheUser] = useState<user>({        
        name: "",
        id: "",
        pic: "/profile_placeholder.svg",
        email: "",
        password: "",
        newPassword: "",
    })
    const [updateOption, setUpdateOption] = useState<string>("")
    const [status, setStatus] = useState<string>("")

    async function getData(){
        onAuthStateChanged(auth, async (user: any) => {
            if(user){
                SetTheUser({
                    name: user.displayName,
                    id: user.uid,
                    pic: user.photoURL ? user.photoURL : "/profile_placeholder.svg",
                    email: user.email,
                    password: "",
                    newPassword: "",
                })
            }
        })
    }

    function changePic(event){
        const hash = createHmac('sha256', theUser.pic + theUser.name + theUser.email).update(theUser.pic + theUser.name + theUser.email).digest('hex');
        const storage = getStorage(app)
        const storageRef = ref(storage, `/profilePictures/${hash}.webp`)
        let theNewPic: string = ""
        if(auth.currentUser !== null){
            uploadBytes(storageRef, event.target.files[0]).then(async (snapshot) => {
                updateProfile(auth.currentUser, {
                    photoURL: await getDownloadURL(snapshot.ref).then(results => results)
                })
                .then(async () => {
                    theNewPic = await getDownloadURL(snapshot.ref).then(results => results)
                    SetTheUser(current => ({...current, pic: theNewPic}))
                })
                .catch(error => setStatus(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))
            })
        }
    }

    async function update(){
        if(updateOption === "email"){
            await updateEmail(auth.currentUser, theUser.email)
            .then(user => setStatus("Your email address is now: " + theUser.email))
            .catch(error => setStatus(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))
        } else if(updateOption === "username"){
            await updateProfile(auth.currentUser, {
                displayName: theUser.name
            }).then(user => setStatus("Your username is now: " + theUser.name))
            .catch(error => setStatus(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))
        } else {
            await signOut(auth)
            await signInWithEmailAndPassword(auth, theUser.email, theUser.password)
            .then(async user => {
                updatePassword(auth.currentUser, theUser.newPassword)
                setStatus("Your password has been updated")
            })
            .catch(error => setStatus(error.toString().replace("(auth/", "").replace(")", "").replace("FirebaseError: Firebase:", "")))
        }
    }


    useEffect(() => {
        getData()
    }, [])

    return (
        <>
        <Siteinfo />
        <Navbar pic={theUser ? theUser.pic : "/profile_placeholder.svg"} />
        {status && <h1>{status}</h1>}
        <div id={styles.container}>
            <div>
                <img src={theUser.pic ? theUser.pic : "/profile_placeholder.svg"} />
                <input type="file" accept=".jpg, .jpeg, .png, .svg, .webp" id={styles.picInput}  onChange={changePic} />
                <input type="email" value={theUser.email} placeholder="email" onChange={event => SetTheUser(current => ({...current, email: event.target.value}))} />
                <input type="text" value={theUser.name} placeholder="username" onChange={event => SetTheUser(current => ({...current, name: event.target.value}))} />
                <input type="password" value={theUser.password} placeholder="old password" onChange={event => SetTheUser(current => ({...current, password: event.target.value}))} />
                <input type="password" value={theUser.newPassword} placeholder="new password" onChange={event => SetTheUser(current => ({...current, newPassword: event.target.value}))} />
                <select onChange={event => setUpdateOption(event.target.value)}>
                    <option value="email">update Email</option>
                    <option value="username">update Username</option>
                    <option value="password">update Password</option>
                </select>
                <button type="submit" onClick={update}>Update</button>
            </div>
        </div>
        </>
    )
}
