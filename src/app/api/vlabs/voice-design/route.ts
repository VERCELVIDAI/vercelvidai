import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { VlabsAiProviderService } from '@/lib/vlabs/ai-provider';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || 'usr_guest_vlabs';

    const body = await req.json();
    const { prompt, genderPreference, accent, language } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Please describe the voice you would like to design in natural language.' },
        { status: 400 }
      );
    }

    const designed = await VlabsAiProviderService.designVoice({
      userId,
      prompt: prompt.trim(),
      genderPreference,
      accent,
      language,
    });

    return NextResponse.json({
      success: true,
      designedVoice: designed,
    });
  } catch (err: any) {
    console.error('Voice Design error:', err);
    return NextResponse.json(
      { error: err.message || 'Voice design analysis failed.' },
      { status: 500 }
    );
  }
}
