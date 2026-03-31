"use client"
import { getJobSpecificInsights, evaluateResume,getResumeData } from "@/services/api"
import { useParams } from "next/navigation"
import Image from "next/image"
import {  useEffect, useState,useRef } from "react"
import '../../Styles/analysisPage.css'
import Navbar from "@/app/components/navbar/page"

export default function AnalyzeResume() {

    const { resumeId } = useParams()
    const [loading, setLoading] = useState(false)
    const [openSections, setOpenSections] = useState(new Set())
    const textareaRef = useRef(null)
    const [hasText, setHasText] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [resumeResult, setResumeResult] = useState(null)
    const [tailoredResult, setTailoredResult] = useState(null)


    useEffect(() => {
        async function analyzeResume() {
            const resp = await evaluateResume(resumeId)
            if (!resp.success) {
                alert(resp.msg)
            }
            setResumeResult(resp.result)
        }
        setLoading(true)
        analyzeResume()
        setLoading(false)
    }, [])

    const getResume = () => {
        const data = getResumeData(resumeId)
    }

    const toggleSection = (key) => {
        setOpenSections(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            return next
        })
    }

    const handleScoreBoxToggle = (key) => {
        const keys = ["content", "ats-essentials", "tailoring", "sections"]

        setOpenSections(prev => {
            let newSet = new Set(prev)

            //close other score sections

            keys.forEach((k) => {
                if (k !== key) {
                    newSet.delete(k)
                }
            })

            // toggle
            if (newSet.has(key)) {
                newSet.delete(key)
            } else {
                newSet.add(key)
            }
            return newSet

        })

    }

    const handleTailoredInsights = async () => {
        if (jobDescription === "") return;

        const jobDescriptionText = jobDescription
        setHasText(false)
        textareaRef.current.value = ""

        const result = await getJobSpecificInsights(jobDescriptionText, resumeId)

        if (!result.success) {
            return alert(result.msg)
        }

        setTailoredResult(result.tailoring_result)

    }

    const handleTextarea = (e) => {

        const jobDescriptionText = e.target.value.trim()

        if (jobDescriptionText !== "") {
            setJobDescription(jobDescriptionText)
        }
        setHasText(jobDescriptionText !== "")
    }

    const clearTextarea = () => {
        textareaRef.current.value = "";
        setHasText(false)
    }

    return (
        <>
            {
                loading ? (
                    <div className="loader-container">
                        <img src="/loader.gif" alt="loader-image" />
                    </div>
                ) :
                    (
                        <>
                            <Navbar />
                            <div className="container">

                                <div className="resume-data-box">

                                    {/* score container */}
                                    <div className="score-container">
                                        <h2>Your Score</h2>
                                        <h3 style={{ color: "orange" }}>{resumeResult ? (resumeResult.totalScore + (tailoredResult ? tailoredResult.score : 0)) : "❓"} / 100</h3>
                                        <h3 style={{ color: "rgb(78, 79, 78)" }}>{resumeResult ? (resumeResult.totalIssues + (tailoredResult ? tailoredResult.issues : 0)) : "❓"} Issues</h3>

                                        <hr style={{ height: "1px", width: "90%" }}></hr>

                                        <div className="box1">

                                            {/* CONTENT SCORE OVERVIEW */}
                                            <div className="score-card">

                                                <div className="score-card-box1" onClick={() => handleScoreBoxToggle("content")}>

                                                    <div className="box1-heading">CONTENT</div>

                                                    <div className="score-rate-wrapper">

                                                        <div className="score-rate">
                                                            {
                                                                resumeResult?.breakdown?.Content?.percentage ?? "??"
                                                            }%
                                                        </div>

                                                        <div>{openSections.has("content") ? "➖" : "➕"}</div>
                                                    </div>

                                                </div>

                                                <div className={`score-card-box2 ${openSections.has("content") ? "visible" : "hide"}`}>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">ATS Parse Rate</div>

                                                        <div className="box2-issue-box">{
                                                            resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.hasIssue ? "1 issue"
                                                                : "No issue"
                                                        }</div>

                                                    </div>


                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Quantifying Impact</div>

                                                        <div className="box2-issue-box">{
                                                            resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.hasIssue ? "1 issue"
                                                                : "No issue"
                                                        }</div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Repetition</div>

                                                        <div className="box2-issue-box" >{
                                                            resumeResult?.breakdown?.Content?.breakdown?.Repetition?.hasIssue ? "1 issue"
                                                                : "No issue"
                                                        }</div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Spelling & Grammar</div>

                                                        <div className="box2-issue-box" >{
                                                            resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.hasIssue ? "1 issue"
                                                                : "No issue"
                                                        }</div>

                                                    </div>

                                                </div>

                                            </div>
                                            {/* ========================================= */}

                                            {/* SECTION SCORE OVERVIEW */}

                                            <div className="score-card">

                                                <div className="score-card-box1" onClick={() => handleScoreBoxToggle("sections")}>

                                                    <div className="box1-heading">SECTIONS</div>

                                                    <div className="score-rate-wrapper">

                                                        <div className="score-rate">
                                                            {
                                                                resumeResult?.breakdown?.Section?.percentage ?? "??"
                                                            }%
                                                        </div>

                                                        <div>{openSections.has("sections") ? "➖" : "➕"}</div>
                                                    </div>

                                                </div>

                                                <div className={`score-card-box2 ${openSections.has("sections") ? "visible" : "hide"}`}>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Essential Sections</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.EssentialScetions?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>


                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Contact Information</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                            {/* ========================================== */}

                                            {/* ATS ESSENTIALS OVERVIEW */}
                                            <div className="score-card">
                                                <div className="score-card-box1" onClick={() => handleScoreBoxToggle("ats-essentials")}>

                                                    <div className="box1-heading">ATS ESSENTIALS</div>

                                                    <div className="score-rate-wrapper">

                                                        <div className="score-rate">
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.percentage ?? "??"
                                                            }%
                                                        </div>

                                                        <div>{openSections.has("ats-essentials") ? "➖" : "➕"}</div>
                                                    </div>

                                                </div>

                                                <div className={`score-card-box2 ${openSections.has("ats-essentials") ? "visible" : "hide"}`}>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">File Format & Size</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>


                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Design</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Email Address</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Hyperlink in Header</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.hasIssue ? "1 issue"
                                                                    : "No issue"
                                                            }
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                            {/* =========================================== */}

                                            {/* TAILORING OVERVIEW */}
                                            <div className="score-card">
                                                <div className="score-card-box1" onClick={() => handleScoreBoxToggle("tailoring")}>

                                                    <div className="box1-heading">TAILORING</div>

                                                    <div className="score-rate-wrapper">

                                                        <div className="score-rate">
                                                            {
                                                                tailoredResult?.percentage ?? "??"
                                                            }%
                                                        </div>

                                                        <div>{openSections.has("tailoring") ? "➖" : "➕"}</div>
                                                    </div>

                                                </div>

                                                <div className={`score-card-box2 ${openSections.has("tailoring") ? "visible" : "hide"}`}>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Hard Skills</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                tailoredResult ?
                                                                    tailoredResult.breakdown?.HardSkills?.hasIssue ? "1 issue"
                                                                        : "No issue"
                                                                    : "??"
                                                            }
                                                        </div>

                                                    </div>


                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Soft Skills</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                tailoredResult ?
                                                                    tailoredResult.breakdown?.softSkills?.hasIssue ? "1 issue"
                                                                        : "No issue"
                                                                    : "??"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Action Verbs</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                tailoredResult ?
                                                                    tailoredResult.breakdown?.ActionVerbs?.hasIssue ? "1 issue"
                                                                        : "No issue"
                                                                    : "??"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
                                                        <div className="box2-heading">Tailored Title</div>

                                                        <div className="box2-issue-box">
                                                            {
                                                                tailoredResult ?
                                                                    tailoredResult.breakdown?.TailoredTitle?.hasIssue ? "1 issue"
                                                                        : "No issue"
                                                                    : "??"
                                                            }
                                                        </div>

                                                    </div>

                                                </div>


                                            </div>
                                            {/* =========================================== */}

                                        </div>

                                    </div>

                                    <div className="wrap-suggestion">

                                        {/* CONTENT */}
                                        <div className="suggestion-container">

                                            {/* main-heading */}
                                            <div className="content-heading">

                                                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

                                                    <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
                                                    <div className="sugg-cont-heading">CONTENT</div>

                                                </div>

                                                <div className="issue-box">
                                                    {
                                                        `${resumeResult?.breakdown?.Content?.issues} `
                                                    }
                                                    issues found
                                                </div>


                                            </div>
                                            {/* -------------------------- */}

                                            {/* ATS PARSE RATE */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "450", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>ATS PARSE RATE</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("ats-parse-content")}>{
                                                        openSections.has("ats-parse-content") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>An <b>Applicant Tracking System</b> (ATS) helps employers quickly screen thousands of resumes by extracting key information automatically.</p>

                                                    <p>A higher parse rate means your resume is read correctly by the ATS, ensuring your skills and experience are not missed—giving you a better chance of reaching recruiters.</p>

                                                </div>

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.title ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* =========================== */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.explanation ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* =========================== */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* =========================== */}



                                            </div>
                                            {/* --------------------------*/}

                                            {/* QUANTIFY IMPACT*/}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">

                                                    <h2 style={{ fontWeight: "450", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>QUANTIFY IMPACT</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("quantify-impact")}>{
                                                        openSections.has("quantify-impact") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>A good resume doesn’t just list responsibilities—it shows the impact you created in your past roles.</p>
                                                    <p>Quantifying your impact on your resume is the key to building a strong application that will get recruiters to pick up the phone and invite you to an interview.</p>
                                                </div>

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.title ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.explanation ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================== */}

                                            </div>
                                            {/* ------------------------- */}

                                            {/* REPETITION*/}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "450", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>REPETITION</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("repetition")}>{
                                                        openSections.has("repetition") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>Using the same words repeatedly in your resume can make it seem less polished and suggest limited language variety.</p>
                                                    <p>Vary your language by using synonyms and action-oriented verbs to make your accomplishments stand out.</p>
                                                </div>


                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.Repetition?.title ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.Repetition.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.Repetition?.explanation ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.Repetition.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.Repetition?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.Repetition.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================== */}

                                            </div>

                                            {/* --------------------------*/}

                                            {/* SPELLING & GRAMMAR */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "450", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>SPELLING AND GRAMMAR</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("spelling and grammar")}>{
                                                        openSections.has("spelling and grammar") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>An error-free resume is essential for making a strong first impression on hiring managers. Reviewing your resume carefully—such as reading it aloud—can help catch spelling and grammatical mistakes.</p>
                                                    <p>Automated content checkers can help identify overlooked errors and improve overall quality.</p>

                                                </div>

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.title ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.explanation ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================== */}



                                            </div>
                                            {/* --------------------------*/}

                                        </div>
                                        {/* ============= */}


                                        {/* SECTIONS */}
                                        <div className="suggestion-container">

                                            {/* main-heading */}
                                            <div className="content-heading">

                                                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

                                                    <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
                                                    <div className="sugg-cont-heading">SECTIONS</div>

                                                </div>

                                                <div className="issue-box">
                                                    {
                                                        `${resumeResult?.breakdown?.Section?.issues} `
                                                    }
                                                    issues found
                                                </div>

                                            </div>
                                            {/* -------------------------- */}

                                            {/* sections card-1*/}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>ESSENTIAL SECTIONS</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("essential-sections")}>{
                                                        openSections.has("essentials-sections") ? "Show Less" : "Show More"}</div>

                                                </div>

                                                {/* ------- */}

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.title ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.explanation ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================== */}

                                            </div>

                                            {/* --------------------------*/}

                                            {/* sections card-2*/}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>CONTACT INFORMATION</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("contact-information")}>{
                                                        openSections.has("contact-information") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.title ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.explanation ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}

                                                <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.suggestion ?
                                                                    ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================== */}

                                            </div>
                                            {/*  */}
                                        </div>

                                        {/*=================*/}


                                        {/* ATS ESSENTIALS */}
                                        <div className="suggestion-container">

                                            {/* main-heading */}
                                            <div className="content-heading">

                                                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

                                                    <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
                                                    <div className="sugg-cont-heading">ATS ESSENTIALS</div>


                                                </div>

                                                <div className="issue-box">
                                                    {
                                                        `${resumeResult?.breakdown?.ATSEssential?.issues} `
                                                    }
                                                    issues found
                                                </div>

                                            </div>
                                            {/* -------------------------- */}

                                            {/* file format & size */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>FILE FORMAT & SIZE</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("file-format")}>{
                                                        openSections.has("file-format") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* file format & size */}
                                                <div className="content-card-box1">

                                                    <p>Many job platforms, such as Indeed, enforce file size limits when uploading resumes. Ideally, your resume should be under 2MB larger files may be rejected during upload.</p>
                                                    <p>File format also plays a crucial role in ATS screening. PDF files are preferred because they are easier for applicant tracking systems to read. Avoid using DOCX, PNG, or JPG formats whenever possible.</p>

                                                </div>

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.title ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.explanation ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.suggestion ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                    {/* ========================== */}


                                                </div>


                                            </div>
                                            {/* --------------------------*/}

                                            {/* design */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>DESIGN</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("design")}>{
                                                        openSections.has("design") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>The design of your resume directly impacts readability and engagement. Thoughtfully designed templates help present information clearly through structured sections, bullet points, and visual highlights.</p>
                                                </div>


                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.title ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.explanation ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.suggestion ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================== */}
                                            </div>
                                            {/* ------------------------- */}

                                            {/* email address */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>EMAIL ADDRESS</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("email-address")}>{
                                                        openSections.has("email-address") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}

                                                {/* content */}
                                                <div className="content-card-box1">

                                                    <p>Email is one of the most common ways recruiters reach out to candidates. A valid, professional email address is essential, particularly when applying for remote or global opportunities.</p>

                                                </div>

                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.title ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.explanation ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.suggestion ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            {/* ========================== */}

                                            {/* --------------------------*/}

                                            {/* header links */}
                                            <div className="content-card">

                                                {/* heading*/}
                                                <div className="content-heading">
                                                    <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>HEADER LINKS</h2>
                                                    <div className="issue-box" onClick={() => toggleSection("header-links")}>{
                                                        openSections.has("header-links") ? "Show Less" : "Show More"}</div>

                                                </div>
                                                {/* ------- */}


                                                {/* Title */}
                                                <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Title</div>
                                                        <div className="resume-suggestion">
                                                            <p>🏷️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.title ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.title}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================= */}

                                                {/* Explanation */}
                                                <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Explanation</div>
                                                        <div className="resume-suggestion">
                                                            <p>ℹ️</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.explanation ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.explanation}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* ========================= */}

                                                {/* Suggestion */}
                                                <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

                                                    <div className="resume-suggestion-wrapper">
                                                        <div className="resume-suggestion-heading">Suggestion</div>
                                                        <div className="resume-suggestion">
                                                            <p>✅</p>
                                                            {
                                                                resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.suggestion ?
                                                                    ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.suggestion}` :
                                                                    `Loading...`

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ========================== */}
                                            </div>
                                            {/* ------------------------- */}




                                        </div>
                                        {/* --------------------------*/}


                                        {/* RESUME TAILORING */}
                                        <div className="suggestion-container">

                                            {/* main-heading */}
                                            <div className="content-heading">

                                                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

                                                    <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
                                                    <div className="sugg-cont-heading">TAILORING</div>

                                                    {tailoredResult && (
                                                        <div className="issue-box">
                                                            {
                                                                `${tailoredResult?.issues} `
                                                            }
                                                            issues found
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                            {/* -------------------------- */}

                                            <div style={{ fontSize: "21px", color: "rgb(91, 88, 88)" }}>
                                                Paste <b>the job you're applying for</b> and our checker will give you job-specific resume tailoring suggestions.
                                            </div>

                                            <div className="tailored-box">

                                                {/* heading */}
                                                <div className="content-heading" style={{ fontSize: "20px", color: "rgb(64, 62, 62)" }}>

                                                    <p>Get a job-specific report</p>
                                                    <div style={{ textDecoration: "underline", cursor: "pointer" }} onClick={clearTextarea}>Clear</div>

                                                </div>
                                                {/* ==================== */}

                                                {/* textarea */}

                                                <div className="textarea-wrapper">

                                                    <textarea ref={textareaRef} placeholder="Paste your job description here..." onChange={handleTextarea}></textarea>
                                                    <hr style={{ height: "0.6px", width: "100%", color: "rgb(251, 244, 244)" }}></hr>

                                                    <div className={`insights-box ${hasText ? "active" : ""}`} onClick={handleTailoredInsights}>Get Tailored Insights</div>
                                                </div>
                                                {/* --------------------- */}

                                            </div>


                                            {/* Hard Skills */}
                                            {tailoredResult && (
                                                <>
                                                    <div className="content-card">

                                                        {/* heading*/}
                                                        <div className="content-heading">
                                                            <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>HARD SKILLS</h2>
                                                            <div className="issue-box" onClick={() => toggleSection("hard-skills")}>{
                                                                openSections.has("hard-skills") ? "Show Less" : "Show More"}</div>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Hard skills */}
                                                        <div className="content-card-box1">

                                                            <p>Recruiters and ATS systems look for specific technical skills mentioned in the job description.</p>
                                                            <p>Make sure your resume includes the most relevant hard skills in both the skills section and work experience.</p>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Title */}
                                                        <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Title</div>
                                                                <div className="resume-suggestion">
                                                                    <p>🏷️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.HardSkills?.title ?
                                                                            ` ${tailoredResult.breakdown.HardSkills.title}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Explanation */}
                                                        <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Explanation</div>
                                                                <div className="resume-suggestion">
                                                                    <p>ℹ️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.HardSkills?.explanation ?
                                                                            ` ${tailoredResult.breakdown.HardSkills.explanation}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Suggestion */}
                                                        <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Suggestion</div>
                                                                <div className="resume-suggestion">
                                                                    <p>✅</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.HardSkills?.suggestion ?
                                                                            ` ${tailoredResult.breakdown.HardSkills.suggestion}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* =========================== */}

                                                    </div>
                                                </>

                                            )
                                            }
                                            {/* ================= */}

                                            {/* Soft Skills */}
                                            {tailoredResult && (
                                                <>
                                                    <div className="content-card">

                                                        {/* heading*/}
                                                        <div className="content-heading">
                                                            <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>SOFT SKILLS</h2>
                                                            <div className="issue-box" onClick={() => toggleSection("soft-skills")}>{
                                                                openSections.has("soft-skills") ? "Show Less" : "Show More"}</div>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Soft skills */}
                                                        <div className="content-card-box1">

                                                            <p>Soft skills help employers understand how you collaborate, communicate, and solve problems.</p>
                                                            <p>Instead of listing them generically, demonstrate soft skills through real work examples.</p>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Title */}
                                                        <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Title</div>
                                                                <div className="resume-suggestion">
                                                                    <p>🏷️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.SoftSkills?.title ?
                                                                            ` ${tailoredResult.breakdown.SoftSkills.title}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Explanation */}
                                                        <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Explanation</div>
                                                                <div className="resume-suggestion">
                                                                    <p>ℹ️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.SoftSkills?.explanation ?
                                                                            ` ${tailoredResult.breakdown.SoftSkills.explanation}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Suggestion */}
                                                        <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Suggestion</div>
                                                                <div className="resume-suggestion">
                                                                    <p>✅</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.SoftSkills?.suggestion ?
                                                                            ` ${tailoredResult.breakdown.SoftSkills.suggestion}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* =========================== */}

                                                    </div>
                                                </>)
                                            }
                                            {/* ================= */}

                                            {/* Action Verbs */}
                                            {tailoredResult && (
                                                <>
                                                    <div className="content-card">

                                                        {/* heading*/}
                                                        <div className="content-heading">
                                                            <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>ACTION VERBS</h2>
                                                            <div className="issue-box" onClick={() => toggleSection("action-verbs")}>{
                                                                openSections.has("action-verbs") ? "Show Less" : "Show More"}</div>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Action Verbs */}
                                                        <div className="content-card-box1">

                                                            <p>Strong action verbs make your resume more impactful and easier for recruiters to scan.</p>
                                                            <p>Begin bullet points with clear verbs that highlight your contributions and achievements.</p>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Title */}
                                                        <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Title</div>
                                                                <div className="resume-suggestion">
                                                                    <p>🏷️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.ActionVerbs?.title ?
                                                                            ` ${tailoredResult.breakdown.ActionVerbs.title}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Explanation */}
                                                        <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Explanation</div>
                                                                <div className="resume-suggestion">
                                                                    <p>ℹ️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.ActionVerbs?.explanation ?
                                                                            ` ${tailoredResult.breakdown.ActionVerbs.explanation}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Suggestion */}
                                                        <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Suggestion</div>
                                                                <div className="resume-suggestion">
                                                                    <p>✅</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.ActionVerbs?.suggestion ?
                                                                            ` ${tailoredResult.breakdown.ActionVerbs.suggestion}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* =========================== */}

                                                    </div>
                                                </>)
                                            }
                                            {/* ================= */}

                                            {/* Tailored Title */}
                                            {tailoredResult && (
                                                <>
                                                    <div className="content-card">

                                                        {/* heading*/}
                                                        <div className="content-heading">
                                                            <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>Tailored Title</h2>
                                                            <div className="issue-box" onClick={() => toggleSection("tailored-title")}>{
                                                                openSections.has("tailored-title") ? "Show Less" : "Show More"}</div>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Action Verbs */}
                                                        <div className="content-card-box1">

                                                            <p>Improves visibility and ATS matching: A tailored resume title includes relevant keywords that help your resume pass Applicant Tracking Systems and reach recruiters.</p>
                                                            <p>Highlights your specialization: It quickly shows recruiters that your skills and experience align with the specific job role you are applying for.</p>

                                                        </div>
                                                        {/* ------------ */}

                                                        {/* Title */}
                                                        <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Title</div>
                                                                <div className="resume-suggestion">
                                                                    <p>🏷️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.TailoredTitle?.title ?
                                                                            ` ${tailoredResult.breakdown.TailoredTitle.title}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Explanation */}
                                                        <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Explanation</div>
                                                                <div className="resume-suggestion">
                                                                    <p>ℹ️</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.TailoredTitle?.explanation ?
                                                                            ` ${tailoredResult.breakdown.TailoredTitle.explanation}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* ========================= */}

                                                        {/* Suggestion */}
                                                        <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                                <div className="resume-suggestion-heading">Suggestion</div>
                                                                <div className="resume-suggestion">
                                                                    <p>✅</p>
                                                                    {
                                                                        tailoredResult?.breakdown?.TailoredTitle?.suggestion ?
                                                                            ` ${tailoredResult.breakdown.TailoredTitle.suggestion}` :
                                                                            `Loading...`

                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        {/* =========================== */}

                                                    </div>
                                                </>
                                            )
                                            }
                                            {/* ================= */}

                                            {tailoredResult && (
                                                <>
                                                    {/* =============TOP SUGGESTIONS=============== */}
                                                    <div className="content-card">

                                                        {/* heading*/}
                                                        <div className="content-heading">
                                                            <h2 style={{ fontWeight: "550", alignSelf: "flex-end", color: "#334155" }}><b>TOP 3 SUGGESTIONS</b></h2>
                                                            <div className="issue-box" onClick={() => toggleSection("top-suggestions")}>{
                                                                openSections.has("top-suggestions") ? "Show Less" : "Show More"}</div>

                                                        </div>
                                                        {/* ---------------------*/}

                                                        {/* Suggestion----------- */}
                                                        <div className={`content-card-box2 ${openSections.has("top-suggestions") ? "visible" : "hide"}`}>

                                                            <div className="resume-suggestion-wrapper">
                                                              
                                                                {
                                                                tailoredResult.top_suggestions.map((data,index) => 
                                                                    (
                                                                      < div key={index} className="resume-suggestion">
                                                                       <p>✅ {data}</p>
                                                                       </div>
                                                                    )
                                                                )
                                                                    
                                                            }




                                                        </div>

                                                    </div>
                                                    {/* ------------------ */}

                                                </div>
                                            {/* =========================================== */}

                                        </>
                                        )
                                            }

                                    </div>

                                </div>
                                {/* ============= */}

                            </div>
                            {/* ------------------------------- */}


                        </div>

            <button onClick={getResume}>click me!</button>

        </>
    )
}


        </>
    )
}




// "use client"
// import { getJobSpecificInsights, evaluateResume } from "@/app/services/page"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import { use, useEffect, useState } from "react"
// import { useRef } from "react"
// import '../../Styles/analysisPage.css'
// import Navbar from "@/app/components/navbar/page"


// export default function AnalyzeResume() {

//     const { resumeId } = useParams()
//     const [loading, setLoading] = useState(false)
//     const [openSections, setOpenSections] = useState(new Set())
//     const textareaRef = useRef(null)
//     const [hasText, setHasText] = useState(false)
//     const [jobDescription, setJobDescription] = useState("")
//     const [resumeResult, setResumeResult] = useState(null)
//     const [tailoredResult, setTailoredResult] = useState(null)


//     const toggleSection = (key) => {
//         setOpenSections(prev => {
//             const next = new Set(prev)
//             next.has(key) ? next.delete(key) : next.add(key)
//             return next
//         })
//     }

//     const handleScoreBoxToggle = (key) => {
//         const keys = ["content", "ats-essentials", "tailoring", "sections"]

//         setOpenSections(prev => {
//             let newSet = new Set(prev)

//             //close other score sections

//             keys.forEach((k) => {
//                 if (k !== key) {
//                     newSet.delete(k)
//                 }
//             })

//             // toggle
//             if (newSet.has(key)) {
//                 newSet.delete(key)
//             } else {
//                 newSet.add(key)
//             }
//             return newSet

//         })

//     }

//     const handleTailoredInsights = async () => {
//         if (jobDescription === "") return;

//         const result = await getJobSpecificInsights(jobDescription, resumeId)

//         if (!result.success) {
//             return alert(result.msg)
//         }

//         setTailoredResult(result.tailoring_result)

//     }

//     const handleTextarea = (e) => {

//         const jobDescriptionText = e.target.value.trim()

//         if (jobDescriptionText !== "") {
//             setJobDescription(jobDescriptionText)
//         }
//         setHasText(jobDescriptionText !== "")
//     }

//     const clearTextarea = () => {
//         textareaRef.current.value = "";
//         setHasText(false)
//     }

//     useEffect(() => {
//         async function analyzeResume() {
//             const resp = await evaluateResume(resumeId)
//             if (!resp.success) {
//                 alert(resp.msg)
//             }
//             setResumeResult(resp.result)
//         }
//         setLoading(true)
//         analyzeResume()
//         setLoading(false)
//     }, [])




//     return (
//         <>
//             {
//                 loading ? (
//                     <div className="loader-container">
//                         <img src="/loader.gif" alt="loader-image" />
//                     </div>
//                 ) :
//                     (
//                         <>
//                             <Navbar />
//                             <div className="container">

//                                 <div className="resume-data-box">

//                                     {/* score contain */}
//                                     <div className="score-container">
//                                         <h2>Your Score</h2>
//                                         <h3 style={{ color: "orange" }}>{resumeResult ? (resumeResult.totalScore + (tailoredResult ? tailoredResult.score : 0)) : "❓"} / 100</h3>
//                                         <h3 style={{ color: "rgb(78, 79, 78)" }}>{resumeResult ? (resumeResult.totalIssues + (tailoredResult ? tailoredResult.issues : 0)) : "❓"} Issues</h3>

//                                         <hr style={{ height: "1px", width: "90%" }}></hr>

//                                         <div className="box1">

//                                             {/* CONTENT SCORE OVERVIEW */}
//                                             <div className="score-card">

//                                                 <div className="score-card-box1" onClick={() => handleScoreBoxToggle("content")}>

//                                                     <div className="box1-heading">CONTENT</div>

//                                                     <div className="score-rate-wrapper">

//                                                         <div className="score-rate">
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.percentage ?? "??"
//                                                             }%
//                                                         </div>

//                                                         <div>{openSections.has("content") ? "➖" : "➕"}</div>
//                                                     </div>

//                                                 </div>

//                                                 <div className={`score-card-box2 ${openSections.has("content") ? "visible" : "hide"}`}>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">ATS Parse Rate</div>

//                                                         <div className="box2-issue-box">{
//                                                             resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.hasIssue ? "1 issue"
//                                                                 : "No issue"
//                                                         }</div>

//                                                     </div>


//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Quantifying Impact</div>

//                                                         <div className="box2-issue-box">{
//                                                             resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.hasIssue ? "1 issue"
//                                                                 : "No issue"
//                                                         }</div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Repetition</div>

//                                                         <div className="box2-issue-box" >{
//                                                             resumeResult?.breakdown?.Content?.breakdown?.Repetition?.hasIssue ? "1 issue"
//                                                                 : "No issue"
//                                                         }</div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Spelling & Grammar</div>

//                                                         <div className="box2-issue-box" >{
//                                                             resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.hasIssue ? "1 issue"
//                                                                 : "No issue"
//                                                         }</div>

//                                                     </div>

//                                                 </div>

//                                             </div>
//                                             {/* ========================================= */}

//                                             {/* SECTION SCORE OVERVIEW */}

//                                             <div className="score-card">

//                                                 <div className="score-card-box1" onClick={() => handleScoreBoxToggle("sections")}>

//                                                     <div className="box1-heading">SECTIONS</div>

//                                                     <div className="score-rate-wrapper">

//                                                         <div className="score-rate">
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.percentage ?? "??"
//                                                             }%
//                                                         </div>

//                                                         <div>{openSections.has("sections") ? "➖" : "➕"}</div>
//                                                     </div>

//                                                 </div>

//                                                 <div className={`score-card-box2 ${openSections.has("sections") ? "visible" : "hide"}`}>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Essential Sections</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.EssentialScetions?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>


//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Contact Information</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                 </div>

//                                             </div>
//                                             {/* ========================================== */}

//                                             {/* ATS ESSENTIALS OVERVIEW */}
//                                             <div className="score-card">
//                                                 <div className="score-card-box1" onClick={() => handleScoreBoxToggle("ats-essentials")}>

//                                                     <div className="box1-heading">ATS ESSENTIALS</div>

//                                                     <div className="score-rate-wrapper">

//                                                         <div className="score-rate">
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.percentage ?? "??"
//                                                             }%
//                                                         </div>

//                                                         <div>{openSections.has("ats-essentials") ? "➖" : "➕"}</div>
//                                                     </div>

//                                                 </div>

//                                                 <div className={`score-card-box2 ${openSections.has("ats-essentials") ? "visible" : "hide"}`}>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">File Format & Size</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>


//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Design</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Email Address</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Hyperlink in Header</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.hasIssue ? "1 issue"
//                                                                     : "No issue"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                 </div>

//                                             </div>
//                                             {/* =========================================== */}

//                                             {/* TAILORING OVERVIEW */}
//                                             <div className="score-card">
//                                                 <div className="score-card-box1" onClick={() => handleScoreBoxToggle("tailoring")}>

//                                                     <div className="box1-heading">TAILORING</div>

//                                                     <div className="score-rate-wrapper">

//                                                         <div className="score-rate">
//                                                             {
//                                                                 tailoredResult?.percentage ?? "??"
//                                                             }%
//                                                         </div>

//                                                         <div>{openSections.has("tailoring") ? "➖" : "➕"}</div>
//                                                     </div>

//                                                 </div>

//                                                 <div className={`score-card-box2 ${openSections.has("tailoring") ? "visible" : "hide"}`}>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Hard Skills</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 tailoredResult?.breakdown?.HardSkills?.hasIssue ? "1 issue"
//                                                                     : "??"
//                                                             }
//                                                         </div>

//                                                     </div>


//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Soft Skills</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 tailoredResult?.breakdown?.SoftSkills?.hasIssue ? "1 issue"
//                                                                     : "??"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Action Verbs</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 tailoredResult?.breakdown?.ActionVerbs?.hasIssue ? "1 issue"
//                                                                     : "??"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                     <div className="content-heading" style={{ padding: "0.3rem 0.3rem 0.3rem  0.3rem" }}>
//                                                         <div className="box2-heading">Tailored Title</div>

//                                                         <div className="box2-issue-box">
//                                                             {
//                                                                 tailoredResult?.breakdown?.TailoredTitle?.hasIssue ? "1 issue"
//                                                                     : "??"
//                                                             }
//                                                         </div>

//                                                     </div>

//                                                 </div>


//                                             </div>
//                                             {/* =========================================== */}

//                                         </div>

//                                     </div>

//                                     <div className="wrap-suggestion">

//                                         {/* CONTENT */}
//                                         <div className="suggestion-container">

//                                             {/* main-heading */}
//                                             <div className="content-heading">

//                                                 <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

//                                                     <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
//                                                     <div className="sugg-cont-heading">CONTENT</div>

//                                                 </div>

//                                                 <div className="issue-box">
//                                                     {
//                                                         `${resumeResult?.breakdown?.Content?.issues} `
//                                                     }
//                                                     issues found
//                                                 </div>


//                                             </div>
//                                             {/* -------------------------- */}

//                                             {/* ATS PARSE RATE */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>ATS PARSE RATE</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("ats-parse-content")}>{
//                                                         openSections.has("ats-parse-content") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>An <b>Applicant Tracking System</b> (ATS) helps employers quickly screen thousands of resumes by extracting key information automatically.</p>

//                                                     <p>A higher parse rate means your resume is read correctly by the ATS, ensuring your skills and experience are not missed—giving you a better chance of reaching recruiters.</p>

//                                                 </div>

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.title ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* =========================== */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* =========================== */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("ats-parse-content") ? "visible" : "hide"}`}>
//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.ATSParseRate?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.ATSParseRate.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* =========================== */}



//                                             </div>
//                                             {/* --------------------------*/}

//                                             {/* QUANTIFY IMPACT*/}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">

//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>QUANTIFY IMPACT</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("quantify-impact")}>{
//                                                         openSections.has("quantify-impact") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>A good resume doesn’t just list responsibilities—it shows the impact you created in your past roles.</p>
//                                                     <p>Quantifying your impact on your resume is the key to building a strong application that will get recruiters to pick up the phone and invite you to an interview.</p>
//                                                 </div>

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.title ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("quantify-impact") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.QuantifyingImpact?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.QuantifyingImpact.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================== */}

//                                             </div>
//                                             {/* ------------------------- */}

//                                             {/* REPETITION*/}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>REPETITION</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("repetition")}>{
//                                                         openSections.has("repetition") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>Using the same words repeatedly in your resume can make it seem less polished and suggest limited language variety.</p>
//                                                     <p>Vary your language by using synonyms and action-oriented verbs to make your accomplishments stand out.</p>
//                                                 </div>


//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.Repetition?.title ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.Repetition.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.Repetition?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.Repetition.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("repetition") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.Repetition?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.Repetition.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================== */}

//                                             </div>

//                                             {/* --------------------------*/}

//                                             {/* SPELLING & GRAMMAR */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>SPELLING AND GRAMMAR</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("spelling and grammar")}>{
//                                                         openSections.has("spelling and grammar") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>An error-free resume is essential for making a strong first impression on hiring managers. Reviewing your resume carefully—such as reading it aloud—can help catch spelling and grammatical mistakes.</p>
//                                                     <p>Automated content checkers can help identify overlooked errors and improve overall quality.</p>

//                                                 </div>

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.title ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("spelling and grammar") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Content?.breakdown?.SpellingAndGrammar?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Content.breakdown.SpellingAndGrammar.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================== */}



//                                             </div>
//                                             {/* --------------------------*/}

//                                         </div>
//                                         {/* ============= */}


//                                         {/* SECTIONS */}
//                                         <div className="suggestion-container">

//                                             {/* main-heading */}
//                                             <div className="content-heading">

//                                                 <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

//                                                     <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
//                                                     <div className="sugg-cont-heading">SECTIONS</div>

//                                                 </div>

//                                                 <div className="issue-box">
//                                                     {
//                                                         `${resumeResult?.breakdown?.Section?.issues} `
//                                                     }
//                                                     issues found
//                                                 </div>

//                                             </div>
//                                             {/* -------------------------- */}

//                                             {/* sections card-1*/}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>ESSENTIAL SECTIONS</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("essential-sections")}>{
//                                                         openSections.has("essentials-sections") ? "Show Less" : "Show More"}</div>

//                                                 </div>

//                                                 {/* ------- */}

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.title ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("essential-sections") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.EssentialSections?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.EssentialSections.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================== */}

//                                             </div>

//                                             {/* --------------------------*/}

//                                             {/* sections card-2*/}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>CONTACT INFORMATION</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("contact-information")}>{
//                                                         openSections.has("contact-information") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.title ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.explanation ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}

//                                                 <div className={`content-card-box2 ${openSections.has("contact-information") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.Section?.breakdown?.ContactInformation?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.Section.breakdown.ContactInformation.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================== */}

//                                             </div>
//                                             {/*  */}
//                                         </div>

//                                         {/*=================*/}


//                                         {/* ATS ESSENTIALS */}
//                                         <div className="suggestion-container">

//                                             {/* main-heading */}
//                                             <div className="content-heading">

//                                                 <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

//                                                     <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
//                                                     <div className="sugg-cont-heading">ATS ESSENTIALS</div>


//                                                 </div>

//                                                 <div className="issue-box">
//                                                     {
//                                                         `${resumeResult?.breakdown?.ATSEssential?.issues} `
//                                                     }
//                                                     issues found
//                                                 </div>

//                                             </div>
//                                             {/* -------------------------- */}

//                                             {/* file format & size */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>FILE FORMAT & SIZE</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("file-format")}>{
//                                                         openSections.has("file-format") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* file format & size */}
//                                                 <div className="content-card-box1">

//                                                     <p>Many job platforms, such as Indeed, enforce file size limits when uploading resumes. Ideally, your resume should be under 2MB larger files may be rejected during upload.</p>
//                                                     <p>File format also plays a crucial role in ATS screening. PDF files are preferred because they are easier for applicant tracking systems to read. Avoid using DOCX, PNG, or JPG formats whenever possible.</p>

//                                                 </div>

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.title ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.explanation ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("file-format") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.FileFormatResult?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.FileFormatResult.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                     {/* ========================== */}


//                                                 </div>


//                                             </div>
//                                             {/* --------------------------*/}

//                                             {/* design */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>DESIGN</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("design")}>{
//                                                         openSections.has("design") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>The design of your resume directly impacts readability and engagement. Thoughtfully designed templates help present information clearly through structured sections, bullet points, and visual highlights.</p>
//                                                 </div>


//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.title ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.explanation ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("design") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.DesignResult?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.DesignResult.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================== */}
//                                             </div>
//                                             {/* ------------------------- */}

//                                             {/* email address */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>EMAIL ADDRESS</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("email-address")}>{
//                                                         openSections.has("email-address") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}

//                                                 {/* content */}
//                                                 <div className="content-card-box1">

//                                                     <p>Email is one of the most common ways recruiters reach out to candidates. A valid, professional email address is essential, particularly when applying for remote or global opportunities.</p>

//                                                 </div>

//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.title ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.explanation ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("email-address") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.EmailResult?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.EmailResult.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>

//                                             </div>
//                                             {/* ========================== */}

//                                             {/* --------------------------*/}

//                                             {/* header links */}
//                                             <div className="content-card">

//                                                 {/* heading*/}
//                                                 <div className="content-heading">
//                                                     <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>HEADER LINKS</h2>
//                                                     <div className="issue-box" onClick={() => toggleSection("header-links")}>{
//                                                         openSections.has("header-links") ? "Show Less" : "Show More"}</div>

//                                                 </div>
//                                                 {/* ------- */}


//                                                 {/* Title */}
//                                                 <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Title</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>🏷️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.title ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.title}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Explanation */}
//                                                 <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Explanation</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>ℹ️</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.explanation ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.explanation}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {/* ========================= */}

//                                                 {/* Suggestion */}
//                                                 <div className={`content-card-box2 ${openSections.has("header-links") ? "visible" : "hide"}`}>

//                                                     <div className="resume-suggestion-wrapper">
//                                                         <div className="resume-suggestion-heading">Suggestion</div>
//                                                         <div className="resume-suggestion">
//                                                             <p>✅</p>
//                                                             {
//                                                                 resumeResult?.breakdown?.ATSEssential?.breakdown?.HyperLinkResult?.suggestion ?
//                                                                     ` ${resumeResult.breakdown.ATSEssential.breakdown.HyperLinkResult.suggestion}` :
//                                                                     `Loading...`

//                                                             }
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 {/* ========================== */}
//                                             </div>
//                                             {/* ------------------------- */}




//                                         </div>
//                                         {/* --------------------------*/}


//                                         {/* RESUME TAILORING */}
//                                         <div className="suggestion-container">

//                                             {/* main-heading */}
//                                             <div className="content-heading">

//                                                 <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>

//                                                     <Image style={{ mixBlendMode: "darken" }} src="/content-logo.png" alt="content-logo" height={70} width={70} />
//                                                     <div className="sugg-cont-heading">TAILORING</div>

//                                                     {tailoredResult && (
//                                                         <div className="issue-box">
//                                                             {
//                                                                 `${tailoredResult?.issues} `
//                                                             }
//                                                             issues found
//                                                         </div>
//                                                     )}

//                                                 </div>

//                                             </div>
//                                             {/* -------------------------- */}

//                                             <div style={{ fontSize: "21px", color: "rgb(91, 88, 88)" }}>
//                                                 Paste <b>the job you're applying for</b> and our checker will give you job-specific resume tailoring suggestions.
//                                             </div>

//                                             <div className="tailored-box">

//                                                 {/* heading */}
//                                                 <div className="content-heading" style={{ fontSize: "20px", color: "rgb(64, 62, 62)" }}>

//                                                     <p>Get a job-specific report</p>
//                                                     <div style={{ textDecoration: "underline", cursor: "pointer" }} onClick={clearTextarea}>Clear</div>

//                                                 </div>
//                                                 {/* ==================== */}

//                                                 {/* textarea */}

//                                                 <div className="textarea-wrapper">

//                                                     <textarea ref={textareaRef} placeholder="Paste your job description here..." onChange={handleTextarea}></textarea>
//                                                     <hr style={{ height: "0.6px", width: "100%", color: "rgb(251, 244, 244)" }}></hr>

//                                                     <div className={`insights-box ${hasText ? "active" : ""}`} onClick={handleTailoredInsights}>Get Tailored Insights</div>
//                                                 </div>
//                                                 {/* --------------------- */}

//                                             </div>


//                                             {/* Hard Skills */}
//                                             {tailoredResult && (
//                                                 <>
//                                                     <div className="content-card">

//                                                         {/* heading*/}
//                                                         <div className="content-heading">
//                                                             <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>HARD SKILLS</h2>
//                                                             <div className="issue-box" onClick={() => toggleSection("hard-skills")}>{
//                                                                 openSections.has("hard-skills") ? "Show Less" : "Show More"}</div>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Hard skills */}
//                                                         <div className="content-card-box1">

//                                                             <p>Recruiters and ATS systems look for specific technical skills mentioned in the job description.</p>
//                                                             <p>Make sure your resume includes the most relevant hard skills in both the skills section and work experience.</p>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Title */}
//                                                         <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Title</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>🏷️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.HardSkills?.title ?
//                                                                             ` ${tailoredResult.breakdown.HardSkills.title}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Explanation */}
//                                                         <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Explanation</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>ℹ️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.HardSkills?.explanation ?
//                                                                             ` ${tailoredResult.breakdown.HardSkills.explanation}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Suggestion */}
//                                                         <div className={`content-card-box2 ${openSections.has("hard-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Suggestion</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>✅</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.HardSkills?.suggestion ?
//                                                                             ` ${tailoredResult.breakdown.HardSkills.suggestion}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* =========================== */}

//                                                     </div>
//                                                 </>)
//                                             }
//                                             {/* ================= */}


//                                             {/* Soft Skills */}
//                                             {tailoredResult && (
//                                                 <>
//                                                     <div className="content-card">

//                                                         {/* heading*/}
//                                                         <div className="content-heading">
//                                                             <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>SOFT SKILLS</h2>
//                                                             <div className="issue-box" onClick={() => toggleSection("soft-skills")}>{
//                                                                 openSections.has("soft-skills") ? "Show Less" : "Show More"}</div>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Soft skills */}
//                                                         <div className="content-card-box1">

//                                                             <p>Soft skills help employers understand how you collaborate, communicate, and solve problems.</p>
//                                                             <p>Instead of listing them generically, demonstrate soft skills through real work examples.</p>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Title */}
//                                                         <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Title</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>🏷️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.SoftSkills?.title ?
//                                                                             ` ${tailoredResult.breakdown.SoftSkills.title}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Explanation */}
//                                                         <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Explanation</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>ℹ️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.SoftSkills?.explanation ?
//                                                                             ` ${tailoredResult.breakdown.SoftSkills.explanation}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Suggestion */}
//                                                         <div className={`content-card-box2 ${openSections.has("soft-skills") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Suggestion</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>✅</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.SoftSkills?.suggestion ?
//                                                                             ` ${tailoredResult.breakdown.SoftSkills.suggestion}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* =========================== */}

//                                                     </div>
//                                                 </>)
//                                             }
//                                             {/* ================= */}

//                                             {/* Action Verbs */}
//                                             {tailoredResult && (
//                                                 <>
//                                                     <div className="content-card">

//                                                         {/* heading*/}
//                                                         <div className="content-heading">
//                                                             <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>SOFT SKILLS</h2>
//                                                             <div className="issue-box" onClick={() => toggleSection("action-verbs")}>{
//                                                                 openSections.has("action-verbs") ? "Show Less" : "Show More"}</div>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Action Verbs */}
//                                                         <div className="content-card-box1">

//                                                             <p>Strong action verbs make your resume more impactful and easier for recruiters to scan.</p>
//                                                             <p>Begin bullet points with clear verbs that highlight your contributions and achievements.</p>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Title */}
//                                                         <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Title</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>🏷️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.ActionVerbs?.title ?
//                                                                             ` ${tailoredResult.breakdown.ActionVerbs.title}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Explanation */}
//                                                         <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Explanation</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>ℹ️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.ActionVerbs?.explanation ?
//                                                                             ` ${tailoredResult.breakdown.ActionVerbs.explanation}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Suggestion */}
//                                                         <div className={`content-card-box2 ${openSections.has("action-verbs") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Suggestion</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>✅</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.ActionVerbs?.suggestion ?
//                                                                             ` ${tailoredResult.breakdown.ActionVerbs.suggestion}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* =========================== */}

//                                                     </div>
//                                                 </>)
//                                             }
//                                             {/* ================= */}

//                                             {/* Tailored Title */}
//                                             {tailoredResult && (
//                                                 <>
//                                                     <div className="content-card">

//                                                         {/* heading*/}
//                                                         <div className="content-heading">
//                                                             <h2 style={{ fontWeight: "400", alignSelf: "flex-end", color: "rgb(44, 43, 43)" }}>Tailored Title</h2>
//                                                             <div className="issue-box" onClick={() => toggleSection("tailored-title")}>{
//                                                                 openSections.has("tailored-title") ? "Show Less" : "Show More"}</div>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Action Verbs */}
//                                                         <div className="content-card-box1">

//                                                             <p>Strong action verbs make your resume more impactful and easier for recruiters to scan.</p>
//                                                             <p>Begin bullet points with clear verbs that highlight your contributions and achievements.</p>

//                                                         </div>
//                                                         {/* ------------ */}

//                                                         {/* Title */}
//                                                         <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Title</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>🏷️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.TailoredTitle?.title ?
//                                                                             ` ${tailoredResult.breakdown.TailoredTitle.title}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Explanation */}
//                                                         <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Explanation</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>ℹ️</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.TailoredTitle?.explanation ?
//                                                                             ` ${tailoredResult.breakdown.TailoredTitle.explanation}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         {/* ========================= */}

//                                                         {/* Suggestion */}
//                                                         <div className={`content-card-box2 ${openSections.has("tailored-title") ? "visible" : "hide"}`}>

//                                                             <div className="resume-suggestion-wrapper">
//                                                                 <div className="resume-suggestion-heading">Suggestion</div>
//                                                                 <div className="resume-suggestion">
//                                                                     <p>✅</p>
//                                                                     {
//                                                                         tailoredResult?.breakdown?.TailoredTitle?.suggestion ?
//                                                                             ` ${tailoredResult.breakdown.TailoredTitle.suggestion}` :
//                                                                             `Loading...`

//                                                                     }
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                         {/* =========================== */}

//                                                     </div>
//                                                 </>)
//                                             }
//                                             {/* ================= */}


//                                         </div>

//                                     </div>
//                                     {/* ============= */}

//                                 </div>
//                                 {/* ------------------------------- */}

//                                 {
//                                     resumeResult && console.log(resumeResult)
//                                 }
//                             </div>

//                         </>
//                     )
//             }


//         </>
//     )
// }
