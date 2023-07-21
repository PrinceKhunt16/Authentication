import { withSessionSsr } from "@/helper/iron"
import baseToastContent from "@/utils/baseToastContent"
import { checkImage } from "@/utils/validator"
import axios from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

export default function UpdateProfilePicture({ title }) {
    const router = useRouter()
    const [picture, setPicture] = useState('')

    const imageUploader = async (image) => {
        const formData = new FormData()
        formData.append("picture", image)

        const response = await axios.post('../api/images/upload', formData)

        return response.data.filename
    }

    function checkValidation() {
        return {
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
        let previouspicturename

        try {
            picturename = await imageUploader(picture)
            const user = await axios.get('../api/user/profile/me')

            previouspicturename = user.data.user.picture

            await axios.post('../api/images/picture', { picturename })
            await axios.delete(`../api/images/${previouspicturename}`)

            toast.success("Picture update successfully.", baseToastContent)
            router.push('/profile/account')
        } catch (error) {
            axios.delete(`../api/images/${picturename}`)
            await axios.post('../api/images/picture', { picturename: previouspicturename })
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
                        <label htmlFor="picture">Profile Picture</label>
                        <input onChange={(e) => setPicture(e.target.files[0])} type="file" id="picture" name="picture" placeholder="Select Profile Picture" />
                        {picture &&
                            <img src={URL.createObjectURL(picture)} className="picture-preview" alt="Picture Preview" />
                        }
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
            title: "Update Profile Picture"
        }
    }
})