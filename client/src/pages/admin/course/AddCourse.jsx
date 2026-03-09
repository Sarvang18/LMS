import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully");
      navigate("/admin/course");
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col max-w-lg mx-auto mt-8 space-y-6">
      
      <div>
        <h1 className="font-bold text-2xl">
          Add New Course
        </h1>
        <p className="text-sm text-muted-foreground">
          Add some basic details to create your new course.
        </p>
      </div>

      <div className="space-y-4">

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>

          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>

                <SelectItem value="nextjs">NEXT JS</SelectItem>
                <SelectItem value="datascience">Data Science</SelectItem>
                <SelectItem value="mern">MERN Stack Development</SelectItem>
                <SelectItem value="react">React JS</SelectItem>
                <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                <SelectItem value="machinelearning">Machine Learning</SelectItem>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="cloud">Cloud Computing (AWS)</SelectItem>
                <SelectItem value="mongodb">MongoDB & Database Design</SelectItem>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="backend">Backend Development</SelectItem>
                <SelectItem value="fullstack">Full Stack Web Development</SelectItem>
                <SelectItem value="blockchain">Blockchain Development</SelectItem>

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/course")}
          >
            Back
          </Button>

          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AddCourse;