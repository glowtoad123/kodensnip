/* eslint-disable import/no-anonymous-default-export */
import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, updateDoc, doc, Timestamp} from 'firebase/firestore';

export default async function(req: any, res: any) {

    try {
        const app = initializeApp({
            apiKey: process.env.NEXT_APP_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.NEXT_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_APP_FIREBASE_APP_ID,
            measurementId: process.env.NEXT_APP_MEASUREMENT_ID
        })

        const db = getFirestore(app)

        interface publicData {
            ot: string | undefined,
            title: string | undefined,
            code: string | undefined,
            language: string | undefined,
            user: string | undefined,
        }
        var snippet: publicData = {
            ot: "",
            title: "",
            code: "",
            language: "",
            user: ""
        }


        if(req.body.method === "GET"){
            await getDoc(doc(db, "broilers", req.body.id)).then(doc => snippet = {
                ot: doc.data().title,
                title: doc.data().title,
                code: doc.data().code,
                language: doc.data().language,
                user: doc.data().user
            })
            res.status(200).json(snippet)
        } else {
            await updateDoc(doc(db, "broilers", req.body.id), {
                title: req.body.title,
                code: req.body.code,
                language: req.body.language,
                user: req.body.user,
                date: Timestamp.now()
            })
            res.status(200).json({success: "success"})
        }




    } catch(error){
        res.status(500).json({error: error})
    }
}