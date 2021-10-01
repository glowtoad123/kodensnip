import { initializeApp } from '@firebase/app';
import {GetStaticProps} from 'next';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/dist/client/router'
import React, {useEffect, useState} from 'react'
import Navbar from '../components/navbar';
import styles from '../styles/edit.module.css'
import Editor from "@monaco-editor/react";
import Languages from '../components/languages';
import dynamic from 'next/dynamic';

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

const CodeMirror: any = dynamic(async () => {
    import('codemirror/mode/dart/dart')
    import('codemirror/mode/django/django')
    import('codemirror/mode/dockerfile/dockerfile')
    import('codemirror/mode/go/go')
    import('codemirror/mode/handlebars/handlebars')
    import('codemirror/mode/perl/perl')
    import('codemirror/mode/sql/sql')
    import('codemirror/mode/swift/swift')
    import('codemirror/mode/vue/vue')
    return import('react-codemirror2').then((theModule: any) => theModule.Controlled ).catch((error: any) => console.log(error))
}, {ssr: false})


export default function Edit(props: object) {

    initializeApp(props)

    const router = useRouter()
    const auth = getAuth()
    interface snip {
        ot: string;
        title: string;
        code: string;
        language: string;
        user: string
    }

    const id = router.query.id

    var pic: string = ""

    const monacoLanguages: string[] = ["batch", "coffeescript", "css", "cpp", "csharp", "diff", "fsharp", "handlebars", "html", "java", "javascript", "json", "less", "lua", "markdown", "objective-c", "php", "powershell", "pug", "python", "r", "razor", "ruby", "sass", "scss", "typescript", "xml"]

    const [snippet, setSnippet] = useState<snip>({
        ot: "",
        title: "",
        code: "",
        language: "javascript",
        user: "string"
    })


    useEffect(() => {
        onAuthStateChanged(auth, async (user: any) => {
            if(user){
                pic = user.photoURL
                setSnippet(current => ({...current, user: user.uid}))
            } else {
                router.replace("/enter")
            }
        })

        async function getData(){
            let res = await fetch("/api/updateSnippet", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: id,
                    method: "GET"
                })
            })
            setSnippet(await res.json())
        }

        getData()
    }, [id, auth, router])

    function settingTitle(event: any){
        setSnippet(current => ({...current, title: event.target.value}))

    }

    function settingCode(value: string, event: any){
        setSnippet(current => ({...current, code: value}))
        console.log("snippet", snippet)
    }

    function settingLanguage(event: any){
        setSnippet(current => ({...current, language: event.target.value}))
        console.log("language", event.target.value)
    }

    async function saveSnippet(){
        let res = await fetch("/api/updateSnippet", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: snippet.title,
                code: snippet.code,
                language: snippet.language,
                user: snippet.user,
                id: id,
                method: "POST"
            })
        })
        let data = await res.json()
        if(data.success){
            router.replace("/dashboard")
        }
    }

    return (
        <div id={styles.container}>
            <Navbar pic={pic ? pic : "/profile_placeholder.svg"} />
            <input type="text" value={snippet.title} onChange={settingTitle} id={styles.title} placeholder="title" />
            {monacoLanguages.includes(snippet.language) ? 
                <Editor
                    height="70vh"
                    defaultLanguage="javascript"
                    language={snippet.language}
                    value={snippet.code}
                    theme="vs-dark"
                    onChange={settingCode}
                    options={{ 
                        autoClosingBrackets: "always",
                        autoClosingDelete: "auto",
                        autoClosingOvertype: "auto",
                        autoClosingQuotes: "beforeWhitespace",
                        autoIndent: "keep",
                        dragAndDrop: true
                    }}
                /> :
                <CodeMirror
                    value={snippet.code}
                    name= "code"
                    options={{
                      theme: 'material-ocean',
                      lineNumbers: true,
                      mode: snippet.language,
                      dragDrop: true,
                    }}
                    onBeforeChange={(editor: any, data: any, value: any) => setSnippet(current => ({...current, code: value}))}
                    onChange={(editor: any, data: any, value: any) => setSnippet(current => ({...current, code: value}))}
                />
            }
            <Languages set={settingLanguage} default={snippet.language} />
            <button type="submit" onClick={saveSnippet}>Update Snippet</button>
        </div>
    )
}
