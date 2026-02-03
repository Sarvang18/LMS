import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate()
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  // RTK query vala part

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSucess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSucess,
    },
  ] = useLoginUserMutation();

  //

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") setSignupInput({ ...signupInput, [name]: value });
    else setLoginInput({ ...loginInput, [name]: value });
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;

    await action(inputData);
  };

  useEffect(() => {
    if(registerIsSucess && registerData) toast.success(registerData.message || "Signup successful")
      if(registerError) toast.error(registerData.data.message || "Signup failed") 

    if(loginIsSucess && loginData){
      toast.success(loginData.message || "Login successful")
      navigate("/")
    } 
      if(loginError) toast.error(loginData.data.message || "Login failed")
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex w-full items-center justify-center mt-20">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="Signup">
          <TabsList>
            <TabsTrigger value="Signup">Signup</TabsTrigger>
            <TabsTrigger value="Login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="Signup">
            <Card>
              <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>Signup krr santi mein kr lee</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input
                    type="text"
                    placeholder="eg. suresh"
                    required="true"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => {
                      changeInputHandler(e, "signup");
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Email</Label>
                  <Input
                    type="email"
                    placeholder="eg. suresh@gmail.com"
                    required="true"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => {
                      changeInputHandler(e, "signup");
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Password</Label>
                  <Input
                    type="Password"
                    placeholder="kuch bhi xyz"
                    required="true"
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => {
                      changeInputHandler(e, "signup");
                    }}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={registerIsLoading}
                  onClick={(e) => {
                    handleRegistration("signup");
                  }}
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="" /> please wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Login krr santi mein kr le bhai
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input
                    type="email"
                    placeholder="eg. suresh@gmail.com"
                    required="true"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => {
                      changeInputHandler(e, "login");
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input
                    type="Password"
                    placeholder="kuch bhi xyz"
                    required="true"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => {
                      changeInputHandler(e, "login");
                    }}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={loginIsLoading}
                  onClick={(e) => {
                    handleRegistration("login");
                  }}
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="" /> please wait
                    </>
                  ) : (
                    "login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Login;
