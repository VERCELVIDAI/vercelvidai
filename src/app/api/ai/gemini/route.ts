import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai/gemini';
import { getSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Check optional authentication for user tracking
    const session = await getSession();

    switch (action) {
      case 'status': {
        return NextResponse.json({
          configured: geminiService.isConfigured(),
          model: geminiService.getModelName(),
          capabilities: [
            'prompt_enhancement',
            'scriptwriting',
            'storyboard_generation',
            'cinematic_direction',
            'marketing_copilot',
            'creative_assistant',
          ],
        });
      }

      case 'enhance-prompt': {
        const { prompt, aspectRatio, cameraMovement, stylePreference } = body;
        if (!prompt || typeof prompt !== 'string') {
          return NextResponse.json({ error: 'Valid prompt string is required.' }, { status: 400 });
        }
        const result = await geminiService.enhancePrompt({
          prompt,
          aspectRatio,
          cameraMovement,
          stylePreference,
        });
        return NextResponse.json({ success: true, ...result });
      }

      case 'generate-script': {
        const { topic, platform, tone, durationSec } = body;
        if (!topic) {
          return NextResponse.json({ error: 'Topic or concept is required.' }, { status: 400 });
        }
        const result = await geminiService.generateScript({
          topic,
          platform,
          tone,
          durationSec: Number(durationSec) || 15,
        });
        return NextResponse.json({ success: true, script: result });
      }

      case 'generate-storyboard': {
        const { concept, targetAudience, aspectRatio, sceneCount } = body;
        if (!concept) {
          return NextResponse.json({ error: 'Concept description is required.' }, { status: 400 });
        }
        const storyboard = await geminiService.generateStoryboard({
          concept,
          targetAudience,
          aspectRatio,
          sceneCount: Number(sceneCount) || 3,
        });
        return NextResponse.json({ success: true, storyboard });
      }

      case 'marketing-copilot': {
        const { productName, productDescription, platform, targetAudience, tone } = body;
        if (!productName || !productDescription) {
          return NextResponse.json(
            { error: 'Product name and description are required.' },
            { status: 400 }
          );
        }
        const campaign = await geminiService.marketingCopilot({
          productName,
          productDescription,
          platform,
          targetAudience,
          tone,
        });
        return NextResponse.json({ success: true, campaign });
      }

      case 'assistant': {
        const { message, context } = body;
        if (!message) {
          return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }
        const reply = await geminiService.creativeAssistant({ message, context });
        return NextResponse.json({ success: true, ...reply });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: "${action}". Supported: enhance-prompt, generate-script, generate-storyboard, marketing-copilot, assistant, status.` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[FluviaFlow Gemini API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Gemini processing failed.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Fluvia Flow Gemini AI Service',
    status: 'online',
    configured: geminiService.isConfigured(),
    model: geminiService.getModelName(),
  });
}
