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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = `${import.meta.env.VITE_API_BASE_URL}/media`;

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(0);
  const params = useParams();
  const { courseId, lectureId } = params;

  const navigate = useNavigate()

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeData,
      isLoading: removeIsLoading,
      isSuccess: removeIsSuccess,
      error : removeError,
    },
  ] = useRemoveLectureMutation();

  const {data : lectureData} = useGetLectureByIdQuery(lectureId)
  const lecture = lectureData?.lecture


  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);

      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.secure_url,
            publicId: res.data.data.publicId,
          });
          setButtonDisable(false);

          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async (req, res) => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async (req, res) => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate(`/admin/course/${courseId}/lecture`)
    }
    if (error) toast.error(error.data.message);
  }, [isSuccess, error]);

  useEffect(() => {
    if(removeIsSuccess){
        toast.success(removeData.message)
        navigate(`/admin/course/${courseId}/lecture`)
    }
    if(removeError) toast.error(error.removeError.message)
  }, [removeIsSuccess]);

  useEffect(()=>{
    if(lecture){
        setLectureTitle(lecture.lectureTitle)
        setIsFree(lecture.isPreviewFree)
        setUploadVideoInfo(lecture.videoInfo)
    } 
  },[lecture])

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between flex-col">
          <div>
            <CardTitle>Edit lecture</CardTitle>
            <CardDescription>
              Make changes and click save when done
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button disabled={removeIsLoading}  variant="destructive" onClick={removeLectureHandler}>
              {
                removeIsLoading ?
                    <>
                        <Loader2  className="mr-2 h-4 w-4 animate-spin" />
                        "Please wait"
                    </>
                    :
                    "Remove Lecture"
              }
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div>
            <Label>Title</Label>
            <Input
              type={"text"}
              placeholder="Ex. Introduction to JS"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type={"file"}
              accept="video/*"
              placeholder="Ex. Introduction to JS"
              className={"w-fit"}
              onChange={fileChangeHandler}
            />
          </div>

          <div className="flex items-center space-x-2 my-5">
            <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
            <Label htmlFor="airplane-mode">Is this video free</Label>
          </div>

          {/* progress Dikhao  */}

          {mediaProgress && (
            <div className="my-4 ">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}

          <div className="mt-4">
            <Button disabled={isLoading}  onClick={editLectureHandler}>
                {
                    isLoading ?
                        <>
                            <Loader2  className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                        :
                        "Update Lecture"
                }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureTab;
