"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {volunteerValidation} from "../components/volunteerValidation";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

type RegisterForm = {
    username:string;
    fullName:string;
    email:string;
    phone:string;
    password:string;
}

export default function VolunteerRegister() {
    const router = useRouter();

    const{
        register,handleSubmit,formState:{errors}
    } = useForm<RegisterForm>({
        resolver:zodResolver(volunteerValidation),
    });

    const onSubmit = async(data: RegisterForm) => {

    try {
        const response = await axios.post( "http://localhost:5000/volunteer", data );

        console.log(response.data);
        alert("Registration successful!");
    }catch (error: any) {
        console.log(error);
        if (error.response) {
         alert( error.response.data.message || "Registration failed" 

         ); 
         } else { 
            alert("Cannot connect to backend"); 
        } 
        }
    
    };

    return (
        <div>
            <h1>Volunteer Registration</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                

                <div>
                    <label>Username</label>
                    <br />

                    <input type="text" {...register("username")} 
                    className="border border-gray-400"/>

                    <p>{errors.username?.message}</p>
                </div>

                <div>
                    <label>Password</label>
                    <br />

                    <input type="password" {...register("password")}
                    className="border border-gray-400"/>

                    <p>{errors.password?.message}</p>
                </div>


                <div>
                    <label>Full Name</label>
                    <br />

                    <input type="text" {...register("fullName")}
                    className="border border-gray-400" />

                    <p>{errors.fullName?.message}</p>
                </div>

                <div>
                    <label>Email</label>
                    <br />  

                    <input type="email" {...register("email")} 
                    className="border border-gray-400" />  

                    <p>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Phone</label>
                    <br />

                    <input type="text" {...register("phone")} 
                    className="border border-gray-400" />

                    <p>{errors.phone?.message}</p>
                </div>

                <br />

                <button type="submit">Register</button>

                <br />

                <button type="button" onClick={() => router.push("/volunteer/login")}>
                    Already have an account? Login
                </button>
            </form>

        </div>
    )

}