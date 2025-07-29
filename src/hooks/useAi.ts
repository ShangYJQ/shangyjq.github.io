import OpenAI from 'openai'
// Please install OpenAI SDK first: `npm install openai`

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-04a42323f7ef4356a290848f9172b8cd',
  dangerouslyAllowBrowser: true,
})

export async function useAi (askMsg: string): Promise<string | undefined> {
  try {
    const completion = await openai.chat.completions.create({
      // 注意：为了更好的对话效果，messages 数组应该包含完整的对话历史
      // 这里简化为单条消息
      messages: [
        { role: 'system', content: '你是一个乐于助人的助手。' },
        { role: 'user', content: askMsg },
      ],
      model: 'deepseek-chat',
    })

    const getMsg: string = completion.choices[0].message.content || ''
    console.log('AI Response:', getMsg)
    return getMsg
  } catch (error) {
    console.error('调用 API 时出错:', error)
    return undefined
  }
}
