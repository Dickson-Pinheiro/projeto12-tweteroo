import express from "express";
import cors from "cors"
const app = express()

const users = []
const tweets = []

app.use(cors())
app.use(express.json())

app.post("/sign-up", (request, response) => {
    const { username, avatar } = request.body

    if (!username || !avatar) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    if (!(typeof username === "string") || !(typeof avatar === "string")) {
        return res.status(400).send()
    }

    const user = {}
    Object.assign(user, { username, avatar })
    users.push(user)
    return response.status(201).send("OK")
})

app.post("/tweets", (request, response) => {
    const { username, tweet } = request.body
    const existsUser = users.some(user => user.username === username)

    if (!existsUser) {
        return response.send("UNAUTHORIZED")
    }

    if (!tweet || !username) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }
    if (!(typeof tweet === "string")) {
        return res.status(400).send()
    }

    const newtweet = {}
    Object.assign(newtweet, { username, tweet })
    tweets.push(newtweet)
    return response.status(201).send("OK")
})

app.get("/tweets", (request, response) => {

    const { page } = request.query
    const pageAtual = Number(page)

    const tweetsRes = tweets.map(tweet => {
        const user = users.find(user => user.username === tweet.username)
        console.log(user)
        return { tweet: tweet.tweet, avatar: user.avatar, username: tweet.username }
    })

    if (tweets.length <= 10) {
        return response.send(tweetsRes)
    }

    if (page !== undefined) {
        if (pageAtual <= 0) {
            return res.status(400).send("Informe uma página válida!")
        }
        if (pageAtual === 1) {
            tweetsRes.splice(10, tweetsRes.length - 10)
        } else {
            tweetsRes.splice(0, (10 * (pageAtual - 1)))
            tweetsRes.splice(10, tweetsRes.length - 10)
        }
    }
    else {
        tweetsRes.splice(0, tweetsRes.length - 10)
    }


    return response.send(tweetsRes)
})

app.get("/tweets/:username", (request, response) => {
    const { username } = request.params

    const userTweets = tweets.filter(tweet => tweet.username === username)
    return response.status(200).send(userTweets)

})

app.listen(5000)