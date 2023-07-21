import axios from "axios"
import baseToastContent from "@/utils/baseToastContent"
import validationError from "@/utils/validationError"
import { useState } from "react"
import { checkConfirmPassword, checkEmail, checkImage, checkPassword, checkText } from "@/utils/validator"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function Register({ title }) {
    const router = useRouter()
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [picture, setPicture] = useState('')

    const imageUploader = async (image) => {
        const formData = new FormData()
        formData.append("picture", image)

        const response = await axios.post('../api/images/upload', formData)

        return response.data.filename
    }

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function checkValidation() {
        return {
            name: checkText(user.name, 3, 20),
            email: checkEmail(user.email),
            password: checkPassword(user.password),
            confirmPassword: checkConfirmPassword(user.password, user.confirmPassword),
            picture: checkImage(picture)
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

        let picturename

        try {
            picturename = await imageUploader(picture)
            const response = await axios.post('../api/user/auth/register', { ...user, picturename })
            toast.success(response.data.message, baseToastContent);
            router.push('/profile/account')
        } catch (error) {
            await axios.delete(`../api/images/${picturename}`)
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
                    <h2>Register</h2>
                    <label htmlFor="name">Name</label>
                    <input onChange={(e) => handleChange(e)} type="text" id="name" name="name" />
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => handleChange(e)} type="email" id="email" name="email" />
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => handleChange(e)} type="password" id="password" name="password" />
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input onChange={(e) => handleChange(e)} type="password" id="confirm-password" name="confirmPassword" />
                    <label htmlFor="picture">Profile Picture</label>
                    <input onChange={(e) => setPicture(e.target.files[0])} type="file" id="picture" name="picture" />
                    {picture &&
                        <img className="picture-preview" src={URL.createObjectURL(picture)} alt="" />
                    }
                    <button type="submit">Register</button>
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
            title: "Register"
        }
    }
})