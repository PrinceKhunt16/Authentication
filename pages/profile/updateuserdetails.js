import { withSessionSsr } from "@/helper/iron"
import baseToastContent from "@/utils/baseToastContent"
import { checkText } from "@/utils/validator"
import axios from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

export default function UpdateUserDetails({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        name: ''
    })

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            name: checkText(user.name, 3, 20),
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
            const response = await axios.post('../api/user/profile/details', user)
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
            <div>
                <div className="form-container">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <h2>Update User Details</h2>
                        <label htmlFor="name">Name</label>
                        <input onChange={(e) => handleChange(e)} type="text" id="name" name="name" />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = withSessionSsr(async function () {
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
            title: "Update User Details"
        }
    }
})