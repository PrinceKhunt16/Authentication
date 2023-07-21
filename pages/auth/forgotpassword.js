import baseToastContent from "@/utils/baseToastContent"
import validationError from "@/utils/validationError"
import { useState } from "react"
import { checkEmail } from "@/utils/validator"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function ForgotPassword({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        email: ""
    })

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            email: checkEmail(user.email)
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
            const response = await axios.post('../api/user/auth/forgotpassword', user)
            toast.success(response.data.message, baseToastContent)
            router.push('/auth/newpassword')
        } catch (error) {
            await axios.post('../api/user/auth/logout')
            error.response && toast.error(error.response.data.message, baseToastContent)
        }
    }

    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <form onSubmit={(e) => handleSubmit(e)}>
                <h2>Forgot Password</h2>
                <label htmlFor="forgotemail">Email</label>
                <input onChange={(e) => handleChange(e)} className="password-field" name="email" id="forgotemail" type="email" placeholder="Enter email" />
                <button className="password-field" type="submit">Send</button>
            </form>
        </div>
    )
}

export const getServerSideProps = withSessionSsr(async function () {
    return {
        props: {
            title: "Forgot Password"
        }
    }
})