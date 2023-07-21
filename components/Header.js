import Link from "next/link"

export default function Header({ auth, picture }) {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/security">Security</Link></li>
                    {auth ?
                        <>
                            {picture &&
                                <li>
                                    <Link href="/profile/account">
                                        <img src={`../images/${picture}`} className="profile-picture" alt="" />
                                    </Link>
                                </li>
                            }
                        </>
                        :
                        <li><Link href="/auth/login">Login</Link></li>
                    }
                </ul>
            </nav>
        </div>
    )
}