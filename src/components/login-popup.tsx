/*"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { X } from "lucide-react"

export function LoginPopup() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mx-2 mb-2 py-2 h-fit rounded-4xl cursor-pointer">
          Login
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between align-center">
            <AlertDialogTitle>Login</AlertDialogTitle>
            <AlertDialogCancel className="bg-transparent cursor-pointer h-[36px] w-[36px]">
                <X />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            Login to use our service, no signup required.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="pointer-events-none" value="email">Email</TabsTrigger>
            <TabsTrigger className="pointer-events-none" value="code">Login Code</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="mb-3">Email</Label>
                  <Input id="email" type="email" placeholder="person@company.com" />
                </div>
                <div className="flex items-center mt-2 space-x-1">
                  <Checkbox className="cursor-pointer" id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none select-none cursor-pointer ml-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-1/1 cursor-pointer">Get Code</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Enter OTP Code</CardTitle>
                <CardDescription>
                  Enter the OTP code sent to your email to login. This code is only valid for 15 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-center">
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-1/1 cursor-pointer">Login</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
}*/



















/*
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginPopup() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [tabValue, setTabValue] = useState<string>('email');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const { sendOTP, loginWithOTP, isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push('/chatbot');
    return null;
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    try {
      await sendOTP(email);
      setTabValue('code'); // Switch to OTP tab
    } catch (error) {
      alert('Failed to send OTP: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithOTP(email, otp);
      router.push('/chatbot'); // Redirect on success
    } catch (error) {
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mx-2 mb-2 py-2 h-fit rounded-4xl cursor-pointer">
          Login
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <AlertDialogTitle>Login</AlertDialogTitle>
            <AlertDialogCancel className="bg-transparent cursor-pointer h-[36px] w-[36px]">
              <X />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            Login to use our service, no signup required.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="pointer-events-none" value="email">
              Email
            </TabsTrigger>
            <TabsTrigger className="pointer-events-none" value="code">
              Login Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div className="space-y-1">
                  <Label htmlFor="email" className="mb-3">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="person@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center mt-2 space-x-1">
                  <Checkbox
                    className="cursor-pointer"
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none select-none cursor-pointer ml-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full cursor-pointer" onClick={handleSendOTP}>
                  Get Code
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Enter OTP Code</CardTitle>
                <CardDescription>
                  Enter the OTP code sent to your email to login. Valid for 15 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full cursor-pointer" onClick={handleLogin}>
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
}*/

"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"


export function LoginPopup() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [tabValue, setTabValue] = useState<string>('email');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false); // Disable "Get Code"
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);   // Disable "Login"
  const { sendOTP, loginWithOTP, isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push('/');
    return null;
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    } else if (!email) {
      toast.error('Email is required');
      return;
    }
    setIsSendingOTP(true); // Disable button
    try {
      await sendOTP(email);
      setTabValue('code'); // Switch to OTP tab
      toast.success('OTP Code sent successfully');
    } catch (error) {
      toast.error('Failed to send OTP: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSendingOTP(false); // Re-enable button
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true); // Disable button
    try {
      await loginWithOTP(email, otp);
      router.push('/'); // Redirect on success
      toast.success('Logged in successfully');
    } catch (error) {
      toast('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoggingIn(false); // Re-enable button
    }
  };

  return (
    <>
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="mx-2 mb-2 py-2 h-fit rounded-4xl cursor-pointer">
            Login
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <div className="flex justify-between items-center">
                <AlertDialogTitle>Login</AlertDialogTitle>
                <AlertDialogCancel className="bg-transparent cursor-pointer h-[36px] w-[36px]">
                <X />
                </AlertDialogCancel>
            </div>
            <AlertDialogDescription>
                Login to use our service, no signup required.
            </AlertDialogDescription>
            </AlertDialogHeader>

            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger className="pointer-events-none" value="email">
                Email
                </TabsTrigger>
                <TabsTrigger className="pointer-events-none" value="code">
                Login Code
                </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
                <Card>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                    <CardTitle className="pb-3">Enter Email</CardTitle>
                    <Input
                        id="email"
                        type="email"
                        placeholder="person@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="flex items-center pt-2 space-x-1">
                    <Checkbox
                        className="cursor-pointer"
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none select-none cursor-pointer ml-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Accept terms and conditions
                    </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={handleSendOTP}
                      disabled={isSendingOTP} // Disable when sending
                    >
                    {isSendingOTP ? 'Sending Code...' : 'Get Code'}
                    </Button>
                </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="code">
                <Card>
                <CardHeader>
                    <CardTitle>Enter OTP Code</CardTitle>
                    <CardDescription>
                      Enter the OTP code sent to your email to login. Valid for 15 minutes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                    className="w-full cursor-pointer"
                    onClick={handleLogin}
                    disabled={isLoggingIn} // Disable when logging in
                    >
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                </CardFooter>
                </Card>
            </TabsContent>
            </Tabs>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </>
  );
}