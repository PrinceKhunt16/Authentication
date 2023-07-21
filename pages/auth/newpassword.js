import baseToastContent from "@/utils/baseToastContent"
import validationError from "@/utils/validationError"
import { useState } from "react"
import { checkOTP, checkPassword } from "@/utils/validator"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function NewPassword({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        otp: "",
        password: ""
    })

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            otp: checkOTP(user.otp),
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
            const response = await axios.post('../api/user/auth/newpassword', user)
            toast.success(response.data.message, baseToastContent)
            router.push('/profile/account')
        } catch (error) {
            await axios.post('../api/user/auth/logout')
            error.response && toast.error(error.response.data.message, baseToastContent)
            router.push('/auth/forgotpassword')
        }
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h2>New Password</h2>
                    <label htmlFor="otp">OTP</label>
                    <input onChange={(e) => handleChange(e)} className="password-field" name="otp" id="otp" type="text" placeholder="Enter OTP" />
                    <label htmlFor="password">New Password</label>
                    <input onChange={(e) => handleChange(e)} className="password-field" name="password" id="password" type="password" placeholder="Enter new password" />
                    <button className="password-field" type="submit">Update</button>
                </form>
            </div>
        </>
    )
}

export const getServerSideProps = withSessionSsr(async function () {
    return {
        props: {
            title: "New Password"
        }
    }
})