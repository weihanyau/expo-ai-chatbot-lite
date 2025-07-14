import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = () => {
  return wrapLanguageModel({
    model:  google("gemini-2.5-pro"),
    middleware: customMiddleware,
  });
};

export const imageGenerationModel = openai.image('dall-e-3');
