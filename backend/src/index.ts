import express from 'express'

const app = express()

import amqp from 'amqplib'

if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ_URL is not defined in environment variables")
}
const rabbitUrl = process.env.RABBITMQ_URL

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect(rabbitUrl)
        console.log("Connected to RabbitMQ")
        return connection
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error)
        throw error
    }
}

app.get('/',async (req,res)=>{
    await connectToRabbitMQ()
    res.send("Hello World")
})

app.listen(8000,()=>{
    console.log("Servidor rodando na porta 8000");
})