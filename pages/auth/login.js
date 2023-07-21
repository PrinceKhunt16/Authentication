import baseToastContent from "@/utils/baseToastContent"
import validationError from "@/utils/validationError"
import axios from "axios"
import { checkEmail, checkPassword } from "@/utils/validator"
import { useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import Link from "next/link"
import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function Login({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            email: checkEmail(user.email),
            password: checkPassword(user.password)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const validatorResponse = checkValidation()
        let cannotGoNext = false

        Object.keys(validatorResponse).forEach((field) => {
            if (!validatorResponse[field]) {
                toast.warn(validationError[field], baseToastContent);
                cannotGoNext = true
            }
        })

        if (cannotGoNext) {
            return
        }

        try {
            const response = await axios.post('../api/user/auth/login', user)
            toast.success(response.data.message, baseToastContent);
            router.push('/profile/account')
        } catch (error) {
            error.response && toast.error(error.response.data.message, baseToastContent);
        }
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="form-container">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h2>Login</h2>
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => handleChange(e)} type="email" id="email" name="email" required />
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => handleChange(e)} type="password" id="password" name="password" required />
                    <div className="forgot-password-link">
                        <Link href="/auth/forgotpassword">Forgot Password</Link>
                    </div>
                    <div className="forgot-password-link">
                        <Link href="/auth/register">If you have not account.</Link>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}

export const getServerSideProps = withSessionSsr(async function (context) {
    if (context.req.session.user) {
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            title: "Login"
        }
    }
})