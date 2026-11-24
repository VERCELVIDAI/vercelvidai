import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id;
    const voices = dbStore.getVlabsVoices(userId);

    return NextResponse.json({
      success: true,
      voices,
      count: voices.length,
    });
  } catch (err: any) {
    console.error('Error fetching vlabs voices:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required to save custom voice.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, category, gender, language, accent, sampleAudioUrl, characteristics } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Voice name is required.' }, { status: 400 });
    }

    const created = dbStore.createVlabsVoice({
      userId: session.user.id,
      name: name.trim(),
      description: description || 'Custom designed voice profile',
      category: category || 'designed',
      gender: gender || 'neutral',
      language: language || 'Hindi & English',
      accent: accent || 'Neutral',
      sampleAudioUrl: sampleAudioUrl || '/media/audio/samples/aarav-narrator.mp3',
      isCustom: true,
      voiceCharacteristics: characteristics || {},
    });

    return NextResponse.json({
      success: true,
      voice: created,
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving custom voice:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to save voice profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const voiceId = searchParams.get('id');
    if (!voiceId) {
      return NextResponse.json({ error: 'Voice ID is required' }, { status: 400 });
    }

    const deleted = dbStore.deleteVlabsVoice(voiceId, session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Voice not found or cannot delete system library voice' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Voice deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting voice:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete voice' }, { status: 500 });
  }
}
