import axios from "axios"
const URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const uploadFile = async (data) => {
   try {
      const result = await axios.post(`${URL}/upload`, data)
      console.log(result.data)
      return result.data
   }
   catch (error) {
      //  backend error
      if (error.response) {
         console.log("Backend error : ", error.response.data.msg)
         return error.response.data
      }
      console.log("Error Occurred in file upload 👉", error.message)
      return { success: false, msg: "Server Error..." }
   }
}

export const getResumeData = async (resumeId) => {
   try {
      const result = await axios.get(`${URL}/${resumeId}`)
      return result.data
   }
   catch (error) {
      //  backend error
      if (error.response) {
         console.log("Backend error : ", error.response.data.msg)
         return error.response.data
      }
      //  Server error
      return { success: false, msg: "Server Error..." }
   }
}

export const getJobSpecificInsights = async (jobDescription,resumeId) => {
   try {
      const result = await axios.post(`${URL}/jd`,{role:jobDescription,resumeId:resumeId})
      return result.data
   }
   catch (error) {
      //  backend error
      if (error.response) {
         console.log("Backend error : ", error.response.data.msg)
         return error.response.data
      }
      //  Server error
      return { success: false, msg: "Server Error..." }
   }
}

export const evaluateResume = async(resumeId)=>{
    try {
      const result = await axios.get(`${URL}/analyze/${resumeId}`)
      return result.data
   }
   catch (error) {
      //  backend error
      if (error.response) {
         console.log("Backend error : ", error.response.data.msg)
         return error.response.data
      }
      //  Server error
      return { success: false, msg: "Server Error..." }
   }
}