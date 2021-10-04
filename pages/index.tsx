import type { NextPage } from 'next'
import Siteinfo from '../components/siteinfo'
import styles from '../styles/Home.module.css'
import Carousel from 'react-bootstrap/Carousel'
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
                <Carousel>
                    <Carousel.Item>
                        <img className={styles.carouselPic} src="/edit.png" alt="kodensnip edit" />
                        <Carousel.Caption>
                            <p className={styles.description}>Create code snippets for you to copy</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className={styles.carouselPic} src="/dash.png" alt="kodensnip dashboard" />
                    </Carousel.Item>
                </Carousel>
                <Link href="/enter"><button className={styles.enter}>Enter</button></Link>
            </div>
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
