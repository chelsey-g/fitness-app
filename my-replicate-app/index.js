import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'anthropic/claude-3.7-sonnet:81a891bd00c339f3565bda15b255b372eb8bf6c669fe996b66eea5d677454a46'
const input = {
  prompt: 'Give me a recipe for pancakes that could feed all of California.',
  max_tokens: 8192,
  system_prompt: '',
  max_image_resolution: 0.5,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
