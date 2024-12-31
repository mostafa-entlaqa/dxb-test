'use server'
import { client } from "@/utils/openai";

     export  const generateText = async (text: string ) => {
        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'o1-preview',
          });
          return chatCompletion.choices[0].message.content
        }

  