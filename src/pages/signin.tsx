import { useAuth } from "@/context/AuthContext";
import { ConnectKitButton, useModal } from "connectkit";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

export default function Signin() {
  const { setIsAuthenticated } = useAuth();

  const { signMessageAsync } = useSignMessage();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { push } = useRouter();

  const { chain } = useNetwork();
  const { setOpen } = useModal();

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async () => {
    if (!address || !chain) {
      setErrorMsg("Please connect your wallet");
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethAddress: address,
        nonce,
        message,
        signature,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.message === "user not found") push("/signup");
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
  }, [address, isConnecting, isDisconnected]);
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center mb-10">
        <h1 className="text-6xl font-bold">Signin Page</h1>
      </main>
      <ConnectKitButton />
      <button
        className="py-2 px-4 cursor-pointer bg-slate-600 rounded-xl mt-10"
        onClick={onSubmit}
      >
        Sign In
      </button>
      {errorMsg && (
        <div className="mb-5">
          <p className="text-red-500 text-xs italic">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
