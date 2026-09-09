"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../components/volunteerValidation";
import { useRouter } from "next/navigation";
import axios from "axios";



type LoginForm = {
    username: string;
    password: string;   
}

export default function LoginPage() {

  const router = useRouter();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async(data: LoginForm) => {
        try {
           const response = await axios.post( "http://localhost:5000/auth/volunteer-login",
             data );
              console.log("Login response:", response.data);

              localStorage.setItem("token", response.data.access_token);

               localStorage.setItem( "volunteer",
                      JSON.stringify(response.data.volunteer));

               alert("Login successful!");

               router.push("/volunteer/dashboard");
    }catch(error: any) {

        console.log(error);

        if (error.response) {
           alert( error.response.data.message || "Invalid username or password" );
          } else {
             alert("Cannot connect to backend");
            }
          }
    }

    return (
    <div>
      <h1>Volunteer Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Username</label>

          <br />

          <input
            type="text"
            {...register("username")}
            className="border border-gray-400"
          />

          <p>{errors.username?.message}</p>
        </div>

        <br />

        <div>
          <label>Password</label>

          <br />

          <input
            type="password"
            {...register("password")}
            className="border border-gray-400"
          />

          <p>{errors.password?.message}</p>
        </div>

        <br />

        <button type="submit">
          Login
        </button>

        <br />

        <button type="button" onClick={() => router.push("/volunteer/register")}>
          haven't any account? Register
        </button>

        <br/>
        <button type="button" onClick={() => router.push("/volunteer/management")} >
         Management Page 
         </button>


      </form>
    </div>
  );
}
