import type { NextPage } from 'next'
import Siteinfo from '../components/siteinfo'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
    <Siteinfo />
    <div className={styles.titleContainer}>
        <img className={styles.titlePic} src="/favicon.svg" alt="kodensnip icon" />
        <h1 className={styles.titleText}>Kodensnip</h1>
    </div>
    <div className={styles.featureContainerContainer}>
        <div className={styles.featureContainer}>
            <img className={styles.featurePic} src="/creation.jpeg" alt="kodensnip creation page" />
            <p className={styles.description}>create snippet for your coding projects so that use will no longer have to use templates. Just copy and paste your code whenever they need it.</p>
        </div>
        <Link href="/enter" passHref><button className={styles.enter}>Enter</button></Link>
    </div>


    <br />
    <br />

    <div className={styles.footerContainer}>
        <h1 className={styles.footerText}>Made using NextJS + Firebase + Vercel</h1>
    </div>
</div>
  )
}

export default Home
