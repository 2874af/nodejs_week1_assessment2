import type { Request, Response } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const PORT = 3000;

const app = express();
app.use(express.json());


const logPath = path.join(__dirname, "orderTrackLog.txt");


async function readLog():Promise<string>{
    try {
        const content = await fs.readFile(logPath, "utf-8");
        return content;
    } catch (error) {
        console.log(error);
        return "";
    }
}

app.get("/api/orders", async (req: Request, res: Response) => {
    const content = await readLog();
    res.status(200).send(content);
});

async function writeNewLog(name: string, date: string, status: string){
    const newLog = `${name}, ${date}, ${status}\n`;
    await fs.appendFile(logPath, newLog, "utf-8");

    return newLog;
}

app.post("/api/orders", async (req:Request, res: Response) => {
    const {name, date, status} = req.body;

    if (!name || !date || !status) {
        return res.status(400).send("name, date and status can not be empty.");
    }

    const newLog = await writeNewLog(name, date, status);
    res.status(201).send(newLog);
})

app.listen(PORT, () => {
    console.log("listen successfully.")
});