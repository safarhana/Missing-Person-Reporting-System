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
      <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
        <div className="card w-full max-w-2xl border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="font-semibold text-primary">Volunteer Portal</p>
            <h1 className="card-title text-3xl">Create your volunteer profile</h1>
            <p className="text-sm text-base-content/60">Share your details so the community can connect with you.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["username", "Username", "text"],
                ["password", "Password", "password"],
                ["fullName", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "text"],
              ].map(([name, label, type]) => (
                <div key={name} className={name === "fullName" ? "sm:col-span-2" : ""}>
                  <label className="label" htmlFor={name}><span className="label-text">{label}</span></label>
                  <input id={name} type={type} {...register(name as keyof RegisterForm)} className="input input-bordered w-full" />
                  {errors[name as keyof RegisterForm]?.message && <p className="mt-1 text-sm text-error">{errors[name as keyof RegisterForm]?.message}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary w-full">Register</button>
                <button type="button" className="btn btn-ghost mt-2 w-full" onClick={() => router.push("/volunteer/login")}>Already have an account? Login</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    )

}