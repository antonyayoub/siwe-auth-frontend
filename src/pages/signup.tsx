import { ConnectKitButton, useModal } from "connectkit";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const { setIsAuthenticated } = useAuth();

  const { signMessageAsync } = useSignMessage();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { push } = useRouter();

  const { chain } = useNetwork();
  const { setOpen } = useModal();

  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async () => {
    if (!address || !chain) {
      setErrorMsg("Please connect your wallet");
      return;
    }
    if (!username) {
      setErrorMsg("Please enter your username");
      return;
    }

    const nonce = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/siwe/nonce`
    ).then((res) => res.text());

    const message = new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId: chain?.id,
      nonce,
      statement: "Sign in With Ethereum.",
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: username,
        ethAddress: address,
        nonce,
        message,
        signature,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.message === "user already exist") push("/signin");
        if (res.message === "username already exist")
          setErrorMsg("Username already taken");
        if (res.accessToken) {
          await localStorage.setItem("accessToken", res.accessToken);
          setIsAuthenticated(true);
          push("/profile");
        }
      });
  };

  useEffect(() => {
    setErrorMsg("");
    if (address) setOpen(false);
  }, [username, address, isConnecting, isDisconnected]);

  return (
    <>
      <h1 className="text-xl mb-5">Create Account</h1>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Please connect your wallet
        </label>
        <ConnectKitButton />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User Name
        </label>
        <input
          type="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      {errorMsg && (
        <div className="mb-5">
          <p className="text-red-500 text-xs italic">{errorMsg}</p>
        </div>
      )}
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={onSubmit}
      >
        Sign Up
      </button>
    </>
  );
}
