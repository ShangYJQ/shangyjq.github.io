import axios from 'axios'

const POST_URL = 'http://116.62.79.107:29999/api'

const template
  = {
    INSERT: 'INSERT INTO users(username, passwd) VALUES (?, ?)',
    DELETE: 'DELETE FROM users WHERE username=?',
    UPDATE: 'UPDATE users SET passwd=? WHERE username=?',
    SELECT: 'SELECT * FROM users WHERE username=?',
  }

export default async function useSql (mode: keyof typeof template, value: (number | string)[]) {
  const startTime = Date.now()
  const operation = {
    template: template[mode],
    values: value,
  }
  const response = await axios.post(POST_URL, operation)
  const endTime = Date.now()
  console.log('耗时 ' + (endTime - startTime) + ' 毫秒')
  const data = response.data
  return JSON.parse(data[0]['result'])
}
