"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {volunteerValidation} from "../components/volunteerValidation";
import { useForm } from "react-hook-form";

type RegisterForm = {
    username:string;
    fullName:string;
    email:string;
    phone:string;
    password:string;
}

export default function VolunteerRegister() {
    const{
        register,handleSubmit,formState:{errors}
    } = useForm<RegisterForm>({
        resolver:zodResolver(volunteerValidation),
    });

    const onSubmit = (data: RegisterForm) => {
        console.log(data);
        alert("Registration successful!");
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

                <button type="submit" >Register</button>
            </form>

        </div>
    )

}