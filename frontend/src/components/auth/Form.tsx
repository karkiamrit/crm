"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LocalStore } from "@/store/localstore";
import { useToast } from "../ui/use-toast";

export const signupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // organizationId: z.string().transform(Number),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const otpFormSchema = z.object({
  otp: z.string().min(5).max(8),
});

export default function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [isSignupNowClicked, setIsSignupNowClicked] = useState(false);
  const [isSignupButtonClicked, setIsSignupButtonClicked] = useState(false);
  const [email, setEmail] = useState("");
  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      // organizationId: NaN,
    },
  });
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmitSignup = async (data: z.infer<typeof signupFormSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/users/signup`,
        {...data, organizationId: 1}
      );
      const email = data.email;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/request-otp`,
        {
          email: email,
        }
      );
      if (res) {
        setIsSignupButtonClicked(true);
      }
      setEmail(data.email);

      if (response.status === 200 || response.status === 201) {
        // Handle success
        toast({
          variant: "default",
          title: "Signup Successful.",
        });
      } else {
        throw new Error("An error occurred while signing up.");
      }
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message || "An error occurred while signing up.",
      });
      console.error("An error occurred while signing up:", err);
    }
  };

  const onSubmitLogin = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/login`,
        data
      );

      if (response.data) {
        LocalStore.remove("jwt");
        LocalStore.setAccessToken(response.data);
        router.push("/dashboard");
      }
      if (response.status === 200 || response.status === 201) {
        // Handle success
        toast({
          variant: "default",
          title: "User logged In Successfully.",
        });
      } else {
        throw new Error("An error occured while logging in.");
      }
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message || "An error occurred while logging in.",
      });
      console.error("An error occurred while creating the organization:", err);
    }
  };

  const onSubmitOTP = async (data: z.infer<typeof otpFormSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/verify-otp`,
        {
          otp: data.otp,
          email: email,
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Handle success
        toast({
          variant: "default",
          title: "Otp Submitted Successfully.",
        });
      } else {
        throw new Error("An error occured while submitting otp.");
      }
      LocalStore.reload();
    } catch (err: any) {
      // Handle error
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          err.response?.data?.message ||
          "An error occurred while submitting otp.",
      });
      console.error("An error occurred while submitting otp:", err);
    }
  };

  return (
    <div >
      <section className="bg-white w-fit items-center m-4 mt-44 lg:mt-28 drop-shadow-2xl border-slate-300 p-4 lg:ml-[35%] border rounded-lg">
        <div className="flex flex-row justify-center ">
          {isSignupNowClicked && (
            <div className="max-w-sm drop-shadow-xl ">
              <div className="text-center"> 
                <Image
                  src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo-symbol.svg"
                  alt=""
                  width={120}
                  height={40}
                  className="w-auto h-12 mx-auto"
                />
                <h1 className="mt-8 text-3xl font-bold text-gray-900">
                  Signup
                </h1>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Six Designs Is A Creative Agency that builds custom CRM
                  solutions and Websites.
                </p>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="px-2 text-sm text-gray-400 bg-white"> </span>
                </div>
              </div>

              {!isSignupButtonClicked && (
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(onSubmitSignup)}
                    className="mt-4 space-y-4"
                  >
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Email address"
                              className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password (min. 8 characters)"
                              className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={signupForm.control}
                      name="organizationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Your Organization ID"
                              className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <Button
                      type="submit"
                      variant="default"
                      className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
                    >
                      Sign Up
                    </Button>
                  </form>
                </Form>
              )}
              {isSignupButtonClicked && (
                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(onSubmitOTP)}
                    className="mt-4 space-y-4"
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter Your Otp"
                              className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="default"
                      className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-primary border border-transparent rounded-md"
                      onClick={() => setIsSignupButtonClicked(true)}
                    >
                      Submit Otp
                    </Button>
                  </form>
                </Form>
              )}

              {!isSignupButtonClicked && (
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-gray-900">
                    Already have an account?{" "}
                    <Link
                      href="#"
                      passHref
                      className="font-bold hover:underline"
                      onClick={() => setIsSignupNowClicked(false)}
                    >
                      Login now
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}

          {!isSignupNowClicked && (
            <div className="max-w-sm ">
              <div className="text-center">
                <Image
                  src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/logo-symbol.svg"
                  alt=""
                  width={120}
                  height={40}
                  className="w-auto h-12 mx-auto"
                />
                <h1 className="mt-8 text-3xl font-bold text-gray-900">Login</h1>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Six Designs Is A Creative Agency that builds custom CRM
                  solutions and Websites.
                </p>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="px-2 text-sm text-gray-400 bg-white"> </span>
                </div>
              </div>

              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                  className="mt-4 space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email address"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password (min. 8 characters)"
                            className="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg sm:text-sm "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="relative flex items-center">
                    <div className="flex items-center h-5">
                      <Checkbox className="text-primary h-5 w-5 rounded-md border-gray-300" />
                    </div>

                    <div className="ml-3">
                      <label
                        htmlFor="remember-password"
                        className="text-sm font-medium text-gray-900"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 "
                  >
                    Login
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-gray-900">
                  Don&apos;t have an account?
                  <Link
                    href="#"
                    passHref
                    className="font-bold hover:underline"
                    onClick={() => setIsSignupNowClicked(true)}
                  >
                    Signup Now
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
