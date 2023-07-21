import baseToastContent from "@/utils/baseToastContent"
import validationError from "@/utils/validationError"
import { useState } from "react"
import { checkPassword } from "@/utils/validator"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function UpdatePassword({ title }) {
    const router = useRouter()
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })

    function handleChange(e) {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            oldPassword: checkPassword(password.oldPassword),
            newPassword: checkPassword(password.newPassword)
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
            const response = await axios.post('../api/user/auth/updatepassword', password)
            toast.success(response.data.message, baseToastContent)
            router.push('/profile/account')
        } catch (error) {
            router.push('/auth/login')
            toast.error(error.response.data.message, baseToastContent)
        }
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h2>Update Password</h2>
                    <label htmlFor="oldPassword">Old Password</label>
                    <input onChange={(e) => handleChange(e)} className="password-field" name="oldPassword" id="oldPassword" type="password" placeholder="Enter old password" />
                    <label htmlFor="newPassword">New Password</label>
                    <input onChange={(e) => handleChange(e)} className="password-field" name="newPassword" id="newPassword" type="password" placeholder="Enter new password" />
                    <button className="password-field" type="submit">Update</button>
                </form>
            </div>
        </>
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
            title: "Update Password"
        }
    }
})