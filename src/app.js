import express from "express";
import cors from "cors"
const app = express()

const users= []
const tweets = []

app.use(cors())
app.use(express.json())

app.post("/sign-up", (request, response) => {
    const {username, avatar} = request.body
    const user = {}
    Object.assign(user, {username, avatar})
    users.push(user)
    return response.send("OK")
})

app.post("/tweets", (request, response) => {
    const {username, tweet} = request.body
    const existsUser = users.some(user => user.username === username)

    if(!existsUser){
        return response.send("UNAUTHORIZED")
    }
    const newtweet = {}
    Object.assign(newtweet, {username, tweet})
    tweets.push(newtweet)
    return response.send("OK")
})

app.get("/tweets", (request, response) => {
    const tweetsRes = tweets.map(tweet => {
        const user = users.find(user => user.username === tweet.username)
        console.log(user)
        return {tweet: tweet.tweet, avatar: user.avatar, username: tweet.username} 
    })
    if(tweets.length <=10){
        return response.send(tweetsRes)
    }
    tweetsRes.splice(0, tweetsRes.length - 10)
    return response.send(tweetsRes)
})

app.listen(5000)