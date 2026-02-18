import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  // 1️⃣ First: All hooks at top
  // Reason: React requires same order every render

  const { data, isLoading,refetch } = useLoadUserQuery()
  const [name, setName] = useState("");
  // Reason: useState must always run
  const [profilePhoto, setprofilePhoto] = useState("");
  // Reason: hooks cannot be after return
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();
  // Reason: this is also a hook


  // 2️⃣ Then: event handlers
  // Reason: normal functions, no restriction

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setprofilePhoto(file);
  };

  const updateUserHandler = async() => {
    const formData = new FormData()
    formData.append("name",name)
    formData.append("profilePhoto",profilePhoto)

    await updateUser(formData)
  };

  useEffect(() =>{
    refetch()
  },[])

  useEffect(() => {
    if(isSuccess){
      refetch()
      toast.success(data.message || "Profile updated")
    } 
    if(isError) toast.error(error.message || "Failed to update profile")
  }, [error,updateUserData,isSuccess,isError])
  

  // 3️⃣ Then: conditional return
  // Reason: after all hooks declared

  if (isLoading) return <h1>Profile loading ...</h1>;

  // 4️⃣ Then: normal variables
  // Reason: now safe

  const  user  = data && data.user;

  return (
    <div className="max-w-4xl mx-auto px-4 my-24 ">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-4">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name :
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>

          <div className="mb-4">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email :
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>

          <div className="mb-4">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role :
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Name"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                    onChange={onChangeHandler}
                  ></Input>
                </div>
              </div>

              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg">Courses you are enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length == 0 ? (
            <h1>You haven't enrolled in any courses</h1>
          ) : (
            user.enrolledCourses.map((course, index) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
