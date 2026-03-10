import RichTextEditor from "@/components/RichTextEditor.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditCourseMutation, useGetCourseByIdQuery } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";



const CourseTab = () => {
    const isPublished = 0

    const [input, setInput] = useState({
        courseTitle:"",
        subTitle:"",
        description:"",
        category:"",
        courseLevel:"",
        coursePrice:"",
        courseThumbnail:"",
    })

    const params = useParams()
    const courseId = params.courseId

    const {data:courseByIdData,isLoading:courseByIdIsLoading} =  useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true})

    const [previewThumbnail,setPreviewThumbnail] = useState("")
    
    const navigate = useNavigate()
    const [editCourse,{data,isLoading,isSuccess,error}] = useEditCourseMutation()

    const changeEventHandler =(e) =>{
        const {name,value} = e.target
        setInput({...input,[name] : value})
    }

    const selectCategory = (value) =>{
        setInput({...input,category:value})
    }

    const selectCourseLevel = (value) =>{
        setInput({...input,courseLevel:value})
    }

    const updateCourseHandler = async() =>{
        const formData = new FormData()
        formData.append("courseTitle",input.courseTitle)
        formData.append("subTitle",input.subTitle)
        formData.append("description",input.description)
        formData.append("category",input.category)
        formData.append("courseLevel",input.courseLevel)
        formData.append("coursePrice",input.coursePrice)
        formData.append("courseThumbnail",input.courseThumbnail)

        await editCourse({formData,courseId})
    }

    
    useEffect(()=>{
        if(courseByIdData?.course){
            const course = courseByIdData?.course
            setInput({
                courseTitle:course.courseTitle,
                subTitle:course.subTitle,
                description:course.description,
                category:course.category,
                courseLevel:course.courseLevel,
                coursePrice:course.coursePrice,
                courseThumbnail:"",
            })
        }
    },[courseByIdData])

    useEffect(()=>{
        if(isSuccess) {
            toast.success(data.message || "Course updated")
        }   
        if(error){
            toast.error(data.message || "Failed to updated")
        }
    },[isSuccess,error])

    if(courseByIdIsLoading) return <Loader2 className="h-4 w-4 animate-spin"/>

    // get file

    const selectThumbnail = (e) =>{
        const file = e.target.files?.[0]
        
        if(file){
            setInput({...input,courseThumbnail:file})

            const fileReader = new FileReader()
            fileReader.onloadend = () =>{
                setPreviewThumbnail(fileReader.result)
            }
            fileReader.readAsDataURL(file)
        } 
    }

  return (
    <div>
      <Card>

        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your courses here. Click save when you're done.
            </CardDescription>
          </div>
          
          <div className="space-x-2">
            <Button variant="outline">
                {   
                    isPublished ? "Unpublish" : "Publish"
                }
            </Button>
            <Button>Remove Course</Button>
          </div>
        </CardHeader>


        <CardContent>

            <div className="space-y-4 mt-5">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        name="courseTitle"
                        placeholder="Ex. Full stack developer"
                        value={input.courseTitle}
                        onChange={changeEventHandler}
                    /> 
                </div>

                <div>
                    <Label>Subtitle</Label>
                    <Input
                        type="text"
                        name="subTitle"
                        placeholder="Ex. Become Full stack developer from 0 to hero"
                        value={input.subTitle}
                        onChange={changeEventHandler}
                    /> 
                </div>

                <div>
                    <Label>Description</Label>
                    <RichTextEditor input={input} setInput={setInput} />
                </div>

                <div className="flex items-center gap-5">
                    <div>
                        <Label>Category</Label>

                        <Select onValueChange={selectCategory}>
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

                    <div>
                        <Label>Course Level</Label>
                        <Select onValueChange={selectCourseLevel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Course level" />
                            </SelectTrigger>
                
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Price</Label>
                        <Input
                            type="number"
                            name="coursePrice"
                            placeholder="999"
                            className="w-fit"
                            value={input.coursePrice}
                            onChange={changeEventHandler}
                        />
                    </div>

                </div>

                <div>
                    <Label>Course Thumbnail</Label>
                    <Input 
                        type={"file"}
                        accept="image/*"
                        className={"w-fit"}
                        onChange={selectThumbnail}
                    />
                    {
                        previewThumbnail && (
                            <img src={previewThumbnail} alt="courseThumbnail" className="w-64 my-2"/>
                        )
                    }
                </div>

                <div>
                    <Button variant="outline" onClick={()=> navigate("/admin/course")}>Cancel</Button>
                    <Button disabled = {isLoading} onClick={updateCourseHandler}>
                        {
                            isLoading ? 
                                <>
                                    <Loader2  className="mr-2 h-4 w-4 animate-spin"/>
                                    Please wait
                                </>
                                :
                                    "Save"
                        }
                    </Button>
                </div>
            </div>

        </CardContent>

      </Card>
    </div>
  );
};

export default CourseTab;
