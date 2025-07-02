const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {parseResultText} = require('../utils/parseTextToJSON');
require('dotenv').config();



// router.post("/upload", upload.single("resume"), async (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "File upload failed" });
//     console.log(req.body.skills);
//     console.log(req.file)

//     const filePath = req.file.path;

//     try {
//         // Extract text from PDF
//         const dataBuffer = fs.readFileSync(filePath);
//         const pdfData = await pdfParse(dataBuffer);

//         // Delete the file after extraction
//         fs.unlink(filePath, (err) => {
//             if (err) console.error("Error deleting file:", err);
//         });

//         res.json({ text: pdfData.text });
//     } catch (error) {
//         console.error("Error processing file:", error);
//         res.status(500).json({ message: "Error processing resume" });
//     }
// });

router.post("/analyze-resume",  upload.single("resume"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "File upload failed" });
    console.log(req.body.jobDescription);
    console.log(req.file)

    const filePath = req.file.path;

    try {
        // Extract text from PDF
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        // Delete the file after extraction
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        req.body.text = pdfData.text;
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "Error processing resume" });
    }
    try {
        const resumeText = req.body.text;

        const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Analyze the following resume and provide an evaluation in three sections: Strengths, Weaknesses, and Suggestions for Improvement. The response should be an array of four elements i.e strengths, weakness, suggestions, score and structured as follows:

Result : {
    Strength : {List the key strengths of the resume, focusing on technical skills, relevant experience, projects, and achievements.}
    Weakness : {List the resume's weaknesses, such as formatting issues, missing information, lack of clarity, or areas that need improvement.}
    Suggestion : {Provide actionable recommendations to enhance the resume, including formatting improvements, content additions, better structuring, or keyword optimizations.}
    Score : {Provide a score from 1 to 100 based on the overall quality of the resume, considering factors like clarity, relevance, and completeness. A higher score indicates a better resume.}
    }

Ensure the response is clear, concise, and free of bullet points or symbols. The feedback should be in plain text format without any asterisks or special characters. Here is the resume text:

${resumeText}`;

        const result = await model.generateContent(prompt);
        const textData = result.response.text();

        
        const jsonData = parseResultText(textData);
        // console.log(textData)

        res.json({ analysis: jsonData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error analyzing resume" });
    }
});





module.exports = router;