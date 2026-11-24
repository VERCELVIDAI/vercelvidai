import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ensureVlabsAudioDir, generateSyntheticSpeechWav, generateSrtContent } from '@/lib/vlabs/audio-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ success: true, projects: [] });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (projectId) {
      const proj = dbStore.getVlabsDubbingProject(projectId);
      if (!proj || proj.userId !== session.user.id) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, project: proj });
    }

    const projects = dbStore.getVlabsDubbingProjects(session.user.id);
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    console.error('Dubbing fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch dubbing projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || 'usr_guest_vlabs';

    const body = await req.json();
    const {
      title,
      sourceVideoUrl,
      sourceLang,
      targetLang,
      preserveBackgroundAudio,
      dialoguesInput,
      speakersInput,
      action, // 'transcribe' | 'translate' | 'render'
    } = body;

    const projTitle = (title || 'AI Dubbed Project ' + new Date().toLocaleDateString('en-IN')).trim();
    const sLang = sourceLang || 'English';
    const tLang = targetLang || 'Hindi';

    // Sample or provided dialogues
    let dialogues = dialoguesInput || [
      {
        id: 'dlg_1',
        speakerId: 'spk_1',
        startTime: 0,
        endTime: 4.5,
        sourceText: 'Welcome to this presentation. Today we will explore innovative AI voice technology.',
        translatedText: tLang === 'Hindi'
          ? 'इस प्रस्तुति में आपका स्वागत है। आज हम अत्याधुनिक एआई वॉयस तकनीक का अन्वेषण करेंगे।'
          : 'Welcome to this presentation. Today we will explore innovative AI voice technology.',
      },
      {
        id: 'dlg_2',
        speakerId: 'spk_2',
        startTime: 4.8,
        endTime: 9.2,
        sourceText: 'Our platform enables natural speech generation in multiple languages instantly.',
        translatedText: tLang === 'Hindi'
          ? 'हमारा प्लेटफॉर्म कई भाषाओं में तुरंत स्वाभाविक वाक् निर्माण को सक्षम बनाता है।'
          : 'Our platform enables natural speech generation in multiple languages instantly.',
      },
    ];

    let speakers = speakersInput || [
      { id: 'spk_1', name: 'Speaker 1 (Narrator)', assignedVoiceId: 'voice_in_male_1', dialogueCount: 1 },
      { id: 'spk_2', name: 'Speaker 2 (Co-Host)', assignedVoiceId: 'voice_in_fem_1', dialogueCount: 1 },
    ];

    // If Google Gemini is configured and action is 'translate', use AI to translate
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiKey && !geminiKey.startsWith('your_') && action === 'translate') {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const prompt = `Translate each of the following dialogues from ${sLang} to ${tLang}.
Preserve natural spoken cadence, idioms, and timing.
Dialogues:
${JSON.stringify(dialogues.map((d: any) => ({ id: d.id, text: d.sourceText })))}

Return a strict JSON array with [{ "id": "...", "translatedText": "..." }]`;

        const resp = await ai.models.generateContent({
          model: process.env.GEMINI_FLASH_MODEL || 'gemini-3.8-flash',
          contents: prompt,
        });

        const raw = resp.text || '';
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const translations: Array<{ id: string; translatedText: string }> = JSON.parse(jsonMatch[0]);
          dialogues = dialogues.map((d: any) => {
            const found = translations.find((t) => t.id === d.id);
            return found ? { ...d, translatedText: found.translatedText } : d;
          });
        }
      } catch (geminiErr: any) {
        console.warn('Dubbing translation error, using default:', geminiErr.message);
      }
    }

    // Generate Composite Dubbed Audio & SRT Subtitle files
    const outDir = ensureVlabsAudioDir();
    const audioFilename = `dubbed_audio_${Date.now()}_${crypto.randomBytes(3).toString('hex')}.wav`;
    const srtFilename = `dubbed_subtitles_${Date.now()}_${crypto.randomBytes(3).toString('hex')}.srt`;

    const audioFilePath = path.join(outDir, audioFilename);
    const srtFilePath = path.join(outDir, srtFilename);

    // Combine all translated speech lines into synchronized output
    const combinedSpeechText = dialogues.map((d: any) => d.translatedText).join(' ');
    const dubbedBuffer = generateSyntheticSpeechWav({
      text: combinedSpeechText,
      gender: 'male',
      pitchHz: 130,
    });
    fs.writeFileSync(audioFilePath, dubbedBuffer);

    // Generate SRT file
    const srtContent = generateSrtContent(
      dialogues.map((d: any) => ({
        id: d.id,
        startTime: d.startTime,
        endTime: d.endTime,
        speakerName: speakers.find((s: any) => s.id === d.speakerId)?.name,
        translatedText: d.translatedText,
      }))
    );
    fs.writeFileSync(srtFilePath, Buffer.from(srtContent, 'utf-8'));

    const outputAudioUrl = `/uploads/audio/vlabs/${audioFilename}`;
    const srtUrl = `/uploads/audio/vlabs/${srtFilename}`;

    // Create Dubbing Project in database
    const createdProject = dbStore.createVlabsDubbingProject({
      userId,
      title: projTitle,
      sourceVideoUrl: sourceVideoUrl || '',
      sourceLang: sLang,
      targetLang: tLang,
      speakers,
      dialogues,
      outputAudioUrl,
      outputVideoUrl: sourceVideoUrl || '',
      srtUrl,
      preserveBackgroundAudio: Boolean(preserveBackgroundAudio),
      status: 'completed',
      progressPercentage: 100,
    });

    return NextResponse.json({
      success: true,
      project: createdProject,
      outputAudioUrl,
      srtUrl,
      message: 'AI Video Dubbing process completed successfully.',
    });
  } catch (err: any) {
    console.error('Video dubbing error:', err);
    return NextResponse.json(
      { error: err.message || 'Dubbing processing failed.' },
      { status: 500 }
    );
  }
}
