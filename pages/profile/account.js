import { withSessionSsr } from "@/helper/iron"
import baseToastContent from "@/utils/baseToastContent"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function Account({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        name: "",
        email: ""
    })

    async function handleLogout() {
        try {
            const response = await axios.post('../api/user/auth/logout')
            toast.success(response.data.message, baseToastContent)
            router.push('/auth/login')
        } catch (error) {
            toast.error(error.response.data.message, baseToastContent)
        }
    }

    async function deleteAccount() {
        try {
            const response = await axios.delete(`../api/user/profile/me`)
            toast.success(response.data.message, baseToastContent)
            router.push('/auth/register')
        } catch (error) {
            router.push('/auth/login')
        }
    }

    useEffect(() => {
        (async function () {
            try {
                const response = await axios.get(`../api/user/profile/me`)

                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email
                })
            } catch (error) {
                await axios.post('../api/user/auth/logout')
                router.push('/auth/login')
            }
        })()
    }, [])

    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>Name {user.name}</h1>
            <br />
            <h1>Email {user.email}</h1>
            <br />
            <br />
            <Link className="account-button" href="/profile/updateprofilepicture">Update Profile Picture</Link>
            <br />
            <Link className="account-button" href="/profile/updateuserdetails">Update User Details</Link>
            <br />
            <Link className="account-button" href="/auth/updatepassword">Update Password</Link>
            <br />
            <Link className="account-button" href="/auth/forgotpassword">Forgot Password</Link>
            <br />
            <button className="account-button" onClick={() => handleLogout()}>Logout</button>
            <br />
            <button className="account-button" onClick={() => deleteAccount()}>Delete Account</button>
        </div>
    )
}

export const getServerSideProps = withSessionSsr(async function (context) {
    if (!context.req.session.user) {
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            title: 'Account'
        }
    }
})