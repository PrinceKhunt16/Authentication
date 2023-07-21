import Footer from "./Footer"
import Header from "./Header"
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

export default function Layout({ children }) {
    const router = useRouter()
    const [auth, setAuth] = useState(false)
    const [picture, setPicture] = useState(null)

    useEffect(() => {
        (async function () {
            try {
                const response = await axios.get('../api/user/profile/me')

                if (response.data.success) {
                    setAuth(true)
                    setPicture(response.data.user.picture)
                }
            } catch (error) {
                setAuth(false)
                setPicture(null)
            }
        })()
    }, [router.pathname])

    return (
        <div>
            <Header
                auth={auth}
                picture={picture}
            />
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                toastClassName={"toast-container"}
                closeButton={false}
            />
            <main className='container'>
                {children}
            </main>
            <Footer />
        </div>
    )
}