import React, { useRef} from 'react'
import Link from "next/link"
import styles from '../styles/nav.module.css'

export default function Navbar(props: any) {

    var pic = props.pic

    const userPic = useRef(null)

    console.log("pic", pic)


    return (
        <nav id={styles.nav}>
            <Link href="/create" passHref >
                <img src="/plus.svg" alt="home" />
            </Link>
            <Link href="/dashboard" passHref >
                <img src="/home.svg" alt="home" />
            </Link>
            <Link href="/user" passHref >
                {pic === "/profile_placeholder.svg" ? <img src={pic} alt="user" id="profilePic" /> : 
                    <img src={pic} alt="user" id="profilePic" style={{ border: "solid 5px #631222", borderRadius: "360px" }} />
                }
            </Link>
        </nav>
    )
}
