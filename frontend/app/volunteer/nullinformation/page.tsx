"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Volunteer = {
  id: number;
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

export default function NullInformationPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const getVolunteers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/volunteer/getVolunteersWithMissingInfo"
        );

        console.log("Response:", response.data);

        setVolunteers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getVolunteers();
  }, []);

  return (
    <div>
      <h1>Volunteers With Missing Information</h1>

      {volunteers.map((volunteer) => (
        <div key={volunteer.id}>
          <p>ID: {volunteer.id}</p>
          <p>Username: {volunteer.username}</p>
          <p>Full Name: {volunteer.fullName || "Missing"}</p>
          <p>Email: {volunteer.email || "Missing"}</p>
          <p>Phone: {volunteer.phone || "Missing"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}