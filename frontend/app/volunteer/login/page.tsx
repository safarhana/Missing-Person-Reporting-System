"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../components/volunteerValidation";



type LoginForm = {
    username: string;
    password: string;   
}

export default function LoginPage() {
    const {
        register, handleSubmit, formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginForm) => {
        console.log(data);
        alert("Login successful!");
    };

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

      </form>
    </div>
  );
}