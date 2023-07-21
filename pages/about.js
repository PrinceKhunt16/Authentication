import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function About({ title }) {
    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <br />
            <h1>About</h1>
            <br />
            <h2>Tictac is a dynamic e-commerce platform designed to provide a seamless shopping experience for customers worldwide. Our company is dedicated to offering the best products and services to our customers, and we strive to achieve this goal by continuously improving our platform's features and functionality.</h2>
            <br />
            <h2>At Tictac, we understand that online shopping can be stressful, which is why we have designed our website to be user-friendly and easy to navigate. Our platform features a wide range of products, from fashion to electronics, and everything in between. With our extensive selection of items, customers can find the products they need in one convenient location.</h2>
            <br />
            <h2>We are committed to providing our customers with the best customer service possible. Our team is always available to assist customers with any questions or concerns they may have, and we take pride in our quick response time and efficient resolution of any issues.</h2>
            <br />
            <h2>Tictac's website is designed to provide customers with a secure and hassle-free shopping experience. We use state-of-the-art encryption technology to protect our customers' personal and financial information, ensuring that their data is always safe and secure.</h2>
            <br />
            <h2>In summary, Tictac is a reliable and efficient e-commerce platform that provides a comprehensive shopping experience for customers worldwide. With our wide selection of products, exceptional customer service, and commitment to data security, Tictac is the perfect choice for anyone looking for a hassle-free online shopping experience.</h2>
        </div>
    )
}

export const getServerSideProps = withSessionSsr(async function () {
    return {
        props: {
            title: 'About'
        }
    }
})