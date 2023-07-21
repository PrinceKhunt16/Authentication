import { withSessionSsr } from "@/helper/iron"
import Head from "next/head"

export default function Home({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="home-banner">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Tic_tac_toe.svg/1200px-Tic_tac_toe.svg.png" alt="" />
      </div>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function (req, res) {
  return {
    props: {
      title: "Home"
    }
  }
})