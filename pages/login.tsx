import axios from "axios";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [flow, setFlow] = useState("LOGIN");
  const [password, setPassword] = useState("");
  const [showCaptchaInfo, setCaptchaInfo] = useState(false);

  const signup = async () => {
    try {
      await axios.post("/api/signup", {
        email,
        name,
        password,
      });

      login();
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    // verify if the email & password is correct via signin
    try {
      const resp = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/profiles",
      });

      // if (resp?.error) {
      //     // Handle error, e.g., show an error message
      //     console.error(resp.error);
      // } else if (resp?.url) {
      //     // Successful sign-in, manually redirect
      //     router.push(resp.url);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className=" fixed h-full w-full bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-slate-900 w-full h-screen flex flex-col items-center justify-center">
        {/* <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12 mx-auto" alt="Logo" />
        </nav> */}
        <h1 className="text-white mb-2 text-4xl font-semibold text-pretty">
          Movie Time
        </h1>

        <div className="flex mt-4 gap-1 py-5">
          <p className="text-gray-400 text-[24px]">
            {flow === "LOGIN"
              ? "New to Movieflix?"
              : "Already have an account?"}{" "}
          </p>
          <button
            className="text-white hover:underline text-[24px] ml-2"
            onClick={() => setFlow(flow === "LOGIN" ? "SIGN_UP" : "LOGIN")}
          >
            {flow === "LOGIN" ? "Sign up now." : "Sign in."}
          </button>
        </div>

        <div className="bg-slate-950 shadow-lg p-5 md:px-16 md:pt-10 pb-14 self-center mt-2 lg:w-2/5 lg:max-w-md w-[90%] rounded-md">
          <h2 className="text-white text-2xl mb-6 font-semibold">
            {flow === "LOGIN" ? "Sign in" : "Register"}
          </h2>
          <div className="flex flex-col gap-4">
            {flow !== "LOGIN" && (
              <Input
                placeholder=" "
                id="name"
                type="text"
                label="Username"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            )}
            <Input
              placeholder=" "
              id="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              value={email}
              label="Email or mobile number"
              type="email"
            />
            <Input
              placeholder=" "
              id="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              value={password}
              label="Password"
              type="password"
            />
          </div>
          <Button
            className=" bg-red-600 hover:bg-red-800 text-[16px] mt-5  w-full text-white"
            onClick={flow === "LOGIN" ? login : signup}
          >
            {flow === "LOGIN" ? "Sign in" : "Get started"}
          </Button>

          {/* <div className="flex justify-center items-center gap-4  mt-5">
            <div
              onClick={() => signIn("google", { callbackUrl: "/profiles" })}
              className="
                              w-10
                              h-10
                              bg-white
                              flex
                              items-center
                              justify-center
                              rounded-full
                              cursor-pointer
                              hover:opacity-70
                              transition
                            "
            >
              <FcGoogle size={30} />
            </div>
          </div> */}

          <div className="flex mt-4 gap-2 text-white">
            <input className="block bg-black" type="checkbox" />
            <p>Remember me</p>
          </div>


          {/* 8c8c8c */}
          {/* <div className="text-[14px] text-gray-400 mt-6">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
            {!showCaptchaInfo && (
              <button
                className="text-blue-600 hover:underline ml-1"
                onClick={() => setCaptchaInfo(true)}
              >
                Learn more
              </button>
            )}
            {showCaptchaInfo && (
              <div>
                The information collected by Google reCAPTCHA is subject to the
                Google Privacy Policy and Terms of Service, and is used for
                providing, maintaining, and improving the reCAPTCHA service and
                for general security purposes (it is not used for personalised
                advertising by Google).
              </div>
            )}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Auth;
