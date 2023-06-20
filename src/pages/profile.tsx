import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface User {
  userName: string;
  ethAddress: string;
}

export default function Profile() {
  const { address } = useAccount();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile/${address}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res.user);
      });
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center mb-10">
        <h1 className="text-6xl font-bold">Profile Page</h1>
      </main>
      <div className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-2xl font-bold">User Info</h1>
        <p className="text-xl font-bold">User Name: {user?.userName}</p>
        <p className="text-xl font-bold">Eth Address: {user?.ethAddress}</p>
      </div>
    </div>
  );
}
