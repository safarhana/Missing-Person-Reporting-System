import { Libertinus_Keyboard } from "next/font/google";
import Link from "next/link";

export default function VolunteerHome() {
    return(
        <nav>
            <h2>Volunteer Portal</h2>

            <div>
                <Link href="/volunteer">Home</Link>{" "}
                <Link href="/volunteer/login">Login</Link>{" "}
                <Link href="/volunteer/register">Register</Link>{" "}
                <Link href="/volunteer/dashboard">Dashboard</Link>
            </div>
        </nav>
    );
}
 