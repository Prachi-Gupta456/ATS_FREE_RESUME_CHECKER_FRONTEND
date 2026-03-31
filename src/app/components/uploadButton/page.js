'use client'
import { useEffect, useState } from 'react'
import '../../Styles/uploadBtnStyle.css'
import { uploadFile } from '@/services/api'
import Loader from '../loader/page'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'


export default function UploadButton() {

    const [fileLoading, setFileLoading] = useState(false)
    const [resumeId, setResumeId] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (resumeId) {

            setTimeout(() => {
                router.push(`/analyze/${resumeId}`)
            },1000)
            
        }

    }, [resumeId])

    const handleFile = async (e) => {

        setFileLoading(true)

        const file = e.target.files[0];

        if (!file.name.endsWith('.pdf') &&
            !file.name.endsWith('.docx')) {
            alert("You can upload pdf or docx file only.")
            setFileLoading(false)
            return
        }

        const size = file.size

        if (size > 2*1024*1024) {
            alert("File size can't be greater than 2MB.")
            setFileLoading(false)
            return
        }

        const form = new FormData()
        form.append("file", file)

        const resp = await uploadFile(form)

        if (!resp.success) {
            alert(resp.msg)
            setFileLoading(false)
            return
        }

        setResumeId(resp.resumeId)
        setFileLoading(false)

    }

    return (
        <div className="upload-container">

            {
                resumeId ? (
                    <>
                        <Image src="/analyze_resume_img.png" height={70} width={70} alt="resume-analysis-img"></Image>
                        <div style={{fontWeight:"600"}} className='loader-box'>
                            <p>Your resume report is ready.</p>
                            <p>View it here!</p>
                        </div>
                        <div className='loader-box'>
                            <p >If your resume report is not opening automatically.</p>
                            <Link style={{color:"violet"}} href={`/analyze/:${resumeId}`}>click here</Link>
                            
                        </div>
             

                    </>
                ) : 
                (
                    <>
                        <div className='content'>
                            {
                                fileLoading ? <div className='loader-box'>
                                    <Loader />
                                    <p>We are Scanning your file</p>
                                </div> : (
                                    <>
                                        <p>Drop your resume here or choose a file.</p>
                                        <p>PDF & DOCX only.Max 2MB file size.</p>
                                    </>
                                )
                            }

                        </div>

                        <input type="file" id="file-input" hidden onChange={handleFile}></ input>
                        <label htmlFor='file-input'>Upload Your Resume</label>
                        <p>🔒Privacy Guaranteed</p>
                    </>
                )
            }

        </div>

    )
}


