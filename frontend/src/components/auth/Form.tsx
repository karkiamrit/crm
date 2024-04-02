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

const signupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organizationId: z.number(),
});

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const otpFormSchema = z.object({
  otp: z.string().min(5).max(8),
});

export default function AuthForm() {
  const router = useRouter();

  const [isSignupNowClicked, setIsSignupNowClicked] = useState(false);
  const [isSignupButtonClicked, setIsSignupButtonClicked] = useState(false);
  const [email, setEmail] = useState("");
  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      organizationId: 1,
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
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/users/signup`, data);
    const email = data.email;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/request-otp`, {
      email: email,
    });
    if (res) {
      setIsSignupButtonClicked(true);
    }
    setEmail(data.email);
  };

  const onSubmitLogin = async (data: z.infer<typeof loginFormSchema>) => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/login`, data);
    
    if (response.data) {
      LocalStore.remove("jwt");
      LocalStore.setAccessToken(response.data);
      LocalStore.reload();
    }
  };

  const onSubmitOTP = async (data: z.infer<typeof otpFormSchema>) => {
    console.log(data);
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL_USERS}/auth/verify-otp`, {
      otp: data.otp,
      email: email,
    });
    LocalStore.reload();
  };

  return (
    <div>
      <section className="bg-white">
        <div className="flex flex-row justify-center ">
          {isSignupNowClicked && (
            <div className="max-w-sm ">
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
                    <FormField
                      control={signupForm.control}
                      name="organizationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Organization ID"
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
