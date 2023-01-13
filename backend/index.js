import express from "express";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors"
import bodyParser from "body-parser"

const configuration = new Configuration({
    apiKey: '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'
  });

const openai = new OpenAIApi(configuration);
const app = express()
app.use(cors())
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/postData', jsonParser, async function (req, res) {

    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please look up how to change API key"
            }
        });
        return;
    }
    
    var resume = req.body.inputResume;
    var job = req.body.inputJob;

    if ((resume.length === 0) || (job.length === 0)) {
        res.status(400).json({
            error:{
                message: "Resume and Job are required"
            }
        });
        return;
    }
    
    try{
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Here is my resume, ${resume}, write a cover letter for ${job}, only list qualities that are outlined in my resume and please express and exeragate your passion to work at the company`, 
            temperature: 0,
            max_tokens: 1500,
        });
        res.status(200).json(
            {
                result: completion.data.choices[0].text
            }
        );

    } catch(error){
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                message: 'An error occurred during your request.',
            }
        });
        }

    } 

});

app.listen(8000,() =>  console.log("app available on http://localhost:8000"))

