/* eslint-disable import/no-anonymous-default-export */
import { initializeApp } from 'firebase/app';
import { query, where } from 'firebase/firestore'
import { getFirestore, collection, getDocs, updateDoc, doc, Timestamp} from 'firebase/firestore';

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

        var snippets: string[] = []

        var qb = await query(collection(db, "broilers"), where("user", "!=", req.body.user))

        await getDocs(qb).then(docs => docs.forEach(async doc => 
                snippets.push(doc.id)
        ))

        snippets.map( async id => {
            await updateDoc(doc(db, "broilers", id), {
                date: Timestamp.now()
            })

        })

        res.status(200).json({success: "success"})


    } catch(error){
        res.status(500).json({error: error})
    }
}