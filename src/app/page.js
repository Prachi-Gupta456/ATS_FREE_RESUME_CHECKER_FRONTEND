import Navbar from "./components/navbar/page";
import Image from "next/image";
import atsHeroImage from '../../public/ats-resume-checker-hero.avif'
import resumeChecker from '../../public/resume-checker-machine.webp'
import image1 from '../../public/image1.png'
import image2 from '../../public/image2.png'
import image3 from '../../public/image3.png'
import image4 from '../../public/image4.png'
import ats_image from '../../public/ats-image.avif'
import './Styles/page.css'
import UploadButton from "./components/uploadButton/page";


export default function Home() {
  return (
    <div className="container">

      {/* navbar ------- */}
     
      <Navbar />
      
      {/* -------------- */}

      {/* ====== hero-section =========== */}
      <div className="hero-section">

        {/* ======== content section ========= */}
        <div className="content-section">

          {/* heading section */}
          <header>
            <div className="hero-heading">
              <h1>My<span style={{ color: "red" }}>Resume</span>Buddy</h1>
              <h1>AI Resume Checker</h1>
            </div>
          </header>
          {/* =================== */}

          <section>
            Check how your resume performs in real Applicant Tracking Systems before you apply.
            Upload your resume and get instant feedback on ATS score, keywords, formatting, and improvements — powered by AI.
          </section>

          {/* upload area =========== */}
        
            <UploadButton />
          
          {/* ============ */}

        </div>

        {/* ========= hero section  image ===========*/}
        <div className="hero-image-container">
          <Image className="image" fill priority src={atsHeroImage} alt="hero-section-image" />
        </div>
        {/* ----------------------------------------- */}
      </div>
      {/* =================================== */}

      {/* about app section ================== */}
      <div className="box1">

        <div className="sub-box1">
          <Image className="image" fill priority src={resumeChecker} alt="resume-checker-image" />
        </div>

        <div className="sub-box2">
          <h1>How <span style={{ color: "red" }}>MyResumeBuddy</span> Evaluates Your Resume</h1>

          <p className="para">MyResumeBuddy analyzes resumes using a structured, ATS-inspired evaluation system designed to reflect how modern applicant tracking systems process applications before they reach recruiters.</p>

          <p className="para">When you apply for a role, your resume is typically scanned and indexed by an ATS long before a hiring manager reviews it. These systems rely on keyword relevance, section structure, and formatting consistency to determine whether a resume should progress further in the hiring pipeline.</p>

          <p className="para">Because of this, a resume's success depends heavily on how well it aligns with the job description, how clearly its content can be interpreted by automated systems, and how effectively skills and experience are presented.</p>

          <h2 style={{ color: "#002d6b" }}>Our Resume Scoring Methodology</h2>

          <div className="card">
            <h3>1. Content Interpretability and ATS Compatibility</h3>
            <p>Similar to an applicant tracking system, we parse your resume to determine
              how much of its content can be accurately read and categorized.
              This includes analyzing section headings, layout structure, text hierarchy, and keyword placement.
              The more clearly your resume can be interpreted by our system, the higher its
              compatibility with real-world ATS platforms.</p>
          </div>

          <div className="card">
            <h3>2. Content Quality and Impact Assessment</h3>
            <p>While applicant tracking systems focus primarily on structure and keywords,
              recruiters evaluate clarity, relevance, and measurable impact. The second component of our analysis assesses the quality of your written content, including role descriptions, skill relevance, and the presence of quantifiable achievements.
              This ensures your resume is not only machine-readable but also recruiter-ready.</p>
          </div>


        </div>
      </div>

      {/* contents */}
      {/* ==================================== */}
      <div className="box2">

        <div className="box2-sub-box1">
          <div className="box2-heading">Get Hired Faster With
            <span style={{ color: "red" }}> MyResumeBuddy</span></div>
        </div>

        <div className="box2-sub-box2">

          {/* card one =============== */}

          <div className="app-card">

            <div className="appcard-box">
              <Image className="image" fill priority src={image1} alt="image" />
            </div>

            <div className="format-box">Format </div>

            <div className="format-content-box">

              <div>
                <p>✅</p>
                <p>File format and size</p>
              </div>

              <div>
                <p>✅</p>
                <p>Resume length</p>
              </div>

              <div>
                <p>✅</p>
                <p>Long bullet points with suggestions on how to shorten</p>
              </div>

            </div>
          </div>
          {/* ======================== */}

          {/* card two   ========== */}
          <div className="app-card">

            <div className="appcard-box">
              <Image className="image" fill priority src={image2} alt="image" />
            </div>

            <div className="format-box">Resume sections</div>

            <div className="format-content-box">

              <div>
                <p>✅</p>
                <p>Contact information</p>
              </div>

              <div>
                <p>✅</p>
                <p>Essential sections</p>
              </div>

              <div>
                <p>✅</p>
                <p>Personality showcase with tips on how to improve</p>
              </div>

            </div>
          </div>
          {/* --------------------- */}

          {/* card three  ========== */}
          <div className="app-card">

            <div className="appcard-box">
              <Image className="image" fill priority src={image3} alt="image" />
            </div>

            <div className="format-box">Style</div>

            <div className="format-content-box">

              <div>
                <p>✅</p>
                <p>Resume design</p>
              </div>

              <div>
                <p>✅</p>
                <p>Email address</p>
              </div>

              <div>
                <p>✅</p>
                <p>Usage of active voice</p>
              </div>

              <div>
                <p>✅</p>
                <p>Usage of buzzwords and cliches</p>
              </div>

            </div>
          </div>
          {/* --------------------- */}

          {/* card four ========== */}
          <div className="app-card">

            <div className="appcard-box">
              <Image className="image" fill priority src={image4} alt="image" />
            </div>

            <div className="format-box">Content</div>

            <div className="format-content-box">

              <div>
                <p>✅</p>
                <p>ATS parse rate</p>
              </div>

              <div>
                <p>✅</p>
                <p>Repetition of words and phrases</p>
              </div>

              <div>
                <p>✅</p>
                <p>Spelling and grammar</p>
              </div>

              <div>
                <p>✅</p>
                <p>Quantifying impact in experience section with examples</p>
              </div>

            </div>
          </div>
          {/* --------------------- */}

        </div>

      </div>
      {/* ===================== */}

      {/* ==================== */}
      <div className="box3">
        <div className="box3-sub-box1">

          {/* image-container */}
          <div className="box3-sub-box2">
            <Image className="ats-image" src={ats_image} fill priority alt="ats-image"></Image>
          </div>

          <div className="box3-sub-box3">
            <h1>Scan Your Resume With <span style={{ color: "red" }}>MyResumeBuddy</span></h1>
            <p>Start today with the best free Resume Checker and get hired faster.</p>

            <div className="upload-box">
              <UploadButton />
              </div>
          </div>
          
          {/* --------------- */}


        </div>
      </div>
      {/* ==================== */}

      {/* ==================== */}
      <footer>
        <div className="footer-box1">

          <p>MyResumeBuddy is an independent resume analysis tool and is not affiliated with any employer or ATS provider.</p>
          <hr></hr>
          <p> © 2026 MyResumeBuddy. All rights reserved.</p>

        </div>
      </footer>

      {/* ==================== */}


    </div>
  );
}


{/* card three  ========== */ }
// <div className="app-card">

//   <div style={{paddingRight:"80px"}}className="appcard-box">
//     <Image className="image" fill priority src={image1} alt="image" />
//   </div>

//   <div className="format-box">Skills suggestion </div>

//   <div className="format-content-box">

//     <div>
//       <p>✅</p>
//       <p>Hard skills</p>
//     </div>

//     <div>
//       <p>✅</p>
//       <p>Soft skills</p>
//     </div>

//   </div>
// </div>
{/* --------------------- */ }

