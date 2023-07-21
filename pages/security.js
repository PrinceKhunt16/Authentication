import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function Seqare({ title }) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <br />
                <h1>Security</h1>
                <br />
                <h2>Security is a critical aspect of any online platform or system. With the increasing amount of personal and sensitive information that is shared and stored online, it is more important than ever to ensure that this data is kept safe and secure.</h2>
                <br />
                <h2>At its core, security involves protecting information from unauthorized access, theft, or misuse. This can be achieved through a combination of physical, technical, and administrative measures. For example, physical security measures may include securing data centers, restricting access to sensitive areas, and implementing video surveillance systems. Technical measures may include using encryption technologies to secure data in transit and at rest, implementing firewalls and intrusion detection systems, and performing regular security audits and vulnerability assessments. Administrative measures may include implementing security policies and procedures, providing employee training and awareness programs, and performing background checks on personnel.</h2>
                <br />
                <h2>In the context of online platforms, security is especially critical as these platforms are often targeted by malicious actors seeking to exploit vulnerabilities and steal sensitive information. Therefore, it is crucial for platform operators to implement a comprehensive security strategy that covers all aspects of the platform, from infrastructure to application security.</h2>
                <br />
                <h2>In summary, security is a critical aspect of any online platform or system, and it involves protecting information from unauthorized access, theft, or misuse through a combination of physical, technical, and administrative measures. For online platforms, it is especially important to implement a comprehensive security strategy to protect against malicious actors and ensure that customer data is kept safe and secure.</h2>
            </div>
        </>
    )
}

export const getServerSideProps = withSessionSsr(async function (context) {
    if (!context.req.session.user) {
        return {
            redirect: {
                destination: '/auth/login' || '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            title: "Seqare"
        }
    }
})