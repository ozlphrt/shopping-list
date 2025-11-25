# How to Get OpenAI API Key for OCR

## Steps:

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com/api-keys
   - Sign in or create an account

2. **Create API Key**
   - Click "Create new secret key"
   - Give it a name (e.g., "Shopping List OCR")
   - Copy the key immediately (you won't see it again)

3. **Add to Your Project**
   - Create or edit `.env.local` file in the project root
   - Add this line:
     ```
     VITE_OPENAI_API_KEY=sk-your-actual-key-here
     ```
   - Replace `sk-your-actual-key-here` with your actual API key

4. **Restart Dev Server**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again

## Pricing:
- GPT-4o Vision: ~$0.01 per image (very affordable)
- First $5 of usage is free for new accounts

## Note:
The API key is only used for OCR scanning. All other features work without it.

