require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

(async function () {
    const { ChatGPTAPIBrowser } = await import("chatgpt")
    const chatgptApi = new ChatGPTAPIBrowser({
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        isGoogleLogin: process.env.IS_GOOGLE ?? false,
        isMicrosoftLogin: process.env.IS_MICROSOFT ?? false,
    })
    await chatgptApi.initSession()
    console.log(`ChatGPT session init success!`)
    const queryChatgpt = async (query, conversations) => {
        if (!conversations) {
            return await chatgptApi.sendMessage(query)
        } else {
            return await chatgptApi.sendMessage(query, {
                conversationId: conversations.conversationId,
                parentMessageId: conversations.messageId
            })
        }
    }
    app.post("/send", async (req, res) => {
        const { query, conversations } = req.body
        const response = (await queryChatgpt(query, conversations))
        res.json(response)
    })
})();

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})