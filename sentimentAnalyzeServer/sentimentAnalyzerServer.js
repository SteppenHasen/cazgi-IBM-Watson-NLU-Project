const express = require('express');
const app = new express();
require('dotenv').config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

   // return res.send({"happy":"90","sad":"10"});
   const analyzeEmotion = {
        'url': req.query.url,
        'features': {
            'emotion': {
                'limit': 5
            }
        }
    }

    getNLUInstance().analyze(analyzeEmotion)
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
            return res.send(results.result.emotion.document.emotion);
        })
        .catch(err => {
            console.log('error:', err);
        }); 

});

app.get("/url/sentiment", (req,res) => {
    //return res.send("url sentiment for "+req.query.url);

     const analyzeSentiment = {
        'url': req.query.url,
        'features': {
            'sentiment': {}
        }
    }

    getNLUInstance().analyze(analyzeSentiment)
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
            return res.send(results.result.sentiment.document.label);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/emotion", (req,res) => {
    //return res.send({"happy":"10","sad":"90"});

    const analyzeEmotion = {
        'text': req.query.text,
        'features': {
            'emotion': {
                'limit': 5
            }
        }
    }

    getNLUInstance().analyze(analyzeEmotion)
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
            return res.send(results.result.emotion.document.emotion);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/sentiment", (req,res) => {
    //return res.send("text sentiment for "+req.query.text);
    const analyzeSentiment = {
        'text': req.query.text,
        'features': {
            'sentiment': {}
        }
    }

    getNLUInstance().analyze(analyzeSentiment)
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
            return res.send(results.result.sentiment.document.label);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

