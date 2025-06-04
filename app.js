import express from 'express'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
let app=express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
const API_KEY = process.env.OPENWEATHER_API_KEY;
console.log("MY API KEY:",API_KEY)

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/weather',async(req,res)=>{
    const city = req.query.city;
    if(!city){
        return res.status(400).json({error:'City is required'});
    }
    try{
        const response=await fetch(
           `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        )

        const data =await response.json();
        if(data.cod !==200){
            return res.status(data.cod).json({error:data.message})
        }
        res.json({
            city:data.name,
            temp:data.main.temp,
            icon:data.weather[0].icon
        })
    }catch(error){
        res.status(500).json({error:'Failed to fetch weather data'})
    }
})

app.listen(3000,()=>{
    console.log('Server is runnning on:http://localhost:3000')
})
