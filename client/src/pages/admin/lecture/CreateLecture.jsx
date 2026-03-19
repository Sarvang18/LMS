import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'

import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture.jsx'

const CreateLecture = () => {
    const navigate = useNavigate()

    const params = useParams()
    const courseId = params.courseId

    const [lectureTitle,setLectureTitle] = useState("")

    const [createLecture,{data,isLoading,isSuccess,error}] = useCreateLectureMutation()
    const {data:lectureData,isLoading:lectureIsLoading,isError:lectureIsError,refetch} = useGetCourseLectureQuery(courseId)

    const createLectureHandler = async()=>{
        await createLecture({lectureTitle,courseId})
        setLectureTitle("")
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data.message || "Lecture Created")
            refetch()
        }
        if(error){
            toast.error(error.data.message || "Error in creating lecture")
        }
    },[isSuccess,error])

  return (
    <div className="flex flex-col max-w-lg space-y-6">
      
      <div>
        <h1 className="font-bold text-2xl">
          Let's add Lecture
        </h1>
        <p className="text-sm text-muted-foreground">
          Add some basic details to create your new lectures.
        </p>
      </div>

      <div className="space-y-4">

        <div className="space-y-2">
          <Label>Lecture title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Ex. Course overview lecture"
          />
        </div>


        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>

          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture" 
            )}
          </Button>
        </div>

        <div className='mt-10'>
            {
                lectureIsLoading ?
                    (<p>Loading Lectures...</p>)
                :
                    lectureIsError ?
                        (<p>Failed to load lectures</p>)
                        :
                            lectureData.lectures?.length === 0 ? 
                                (<p>No lecture available</p>)
                                    :
                                        lectureData.lectures.map((lecture,index) =>(
                                            <Lecture 
                                                key={lecture._id} 
                                                lecture={lecture} 
                                                courseId={courseId} 
                                                index={index}
                                            />
                                        ))
            }
        </div>

      </div>
    </div>
  )
}

export default CreateLecture