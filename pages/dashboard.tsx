import { initializeApp } from '@firebase/app';
import {GetStaticProps} from 'next';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/dist/client/router'
import React, {useEffect, useState} from 'react'
import Navbar from '../components/navbar';
import Card from '../components/card';
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
    initializeApp(props)

    interface user {
        name: string,
        id: string,
        pic: string
    }

    interface aDate {
        nanoseconds: number,
        seconds: number
    }

    interface snipData {
        title: string,
        code: string,
        user: string,
        language: string,
        date: aDate
    }

    interface snip {
        id: string,
        data: snipData
    }

    const auth = getAuth()
    const router = useRouter()
    const [theUser, SetTheUser] = useState<user>({        
        name: "",
        id: "",
        pic: ""
    })
    const [snippets, setSnippets] = useState<snip[]>([])

    async function getData(){
        onAuthStateChanged(auth, async (user: any) => {
            if(!user){
                router.replace("/enter")
            } else {
                SetTheUser({
                    name: user.displayName,
                    id: user.uid,
                    pic: user.photoURL ? user.photoURL : "/profile_placeholder.svg"
                })

                let res = await fetch("/api/data", {
                    headers: {"Content-Type": "application/json"},
                    method: "POST",
                    body: JSON.stringify({user: user.uid})
                })
                setSnippets(await res.json())
                setSnippets(current => {
                    var theNewArray = [...current]
                    theNewArray.sort((a, b) => b.data.date.seconds - a.data.date.seconds)
                    return theNewArray
                })
                console.log("snippets", snippets)
            }
        })
    }


    useEffect(() => {
        getData()
    }, [])

    async function remove(id: string, index: number){
        let res = await fetch("/api/deleteSnippet", {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                id: id
            })
        })

        setSnippets(current => current.filter((snippet, ind) => index !== ind))
    }

    console.log(snippets)

    return (
        <div>
            <Siteinfo />
            <Navbar pic={theUser ? theUser.pic : "/profile_placeholder.svg"} />
            {snippets && snippets.map((snippet, index: number) => <Card key={index} index={index} id={snippet.id} title={snippet.data.title} code={snippet.data.code} language={snippet.data.language} delete={remove} />)}
        </div>
    )
}
