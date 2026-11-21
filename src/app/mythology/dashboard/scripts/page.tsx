"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, Sparkles, Copy, Check, ExternalLink, Search, 
  ArrowRight, Flame
} from "lucide-react";
import { PURANIC_STORY_PRESETS, MYTH_ART_STYLES } from "@/lib/mythology/constants";
import { MythProject } from "@/lib/mythology/types";

export default function MythologyScriptsPage() {
  const [projects, setProjects] = useState<MythProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "presets">("projects");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/mythology/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error("Failed to load scripts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleCopyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Projects with scenes
  const scriptProjects = projects.filter(p => p.scenes && p.scenes.length > 0);
  const filteredProjects = scriptProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          (p.storyConcept && p.storyConcept.toLowerCase().includes(search.toLowerCase()));
    const matchesLang = selectedLanguage === "all" || p.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  const filteredPresets = PURANIC_STORY_PRESETS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.summary.toLowerCase().includes(search.toLowerCase()) ||
                          p.source.toLowerCase().includes(search.toLowerCase()) ||
                          p.hookLine.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Script Vault & Viral Ideas
          </h1>
          <p className="text-sm text-slate-500">
            Access your generated video scripts, scene narrations, and curated Puranic story presets.
          </p>
        </div>
        <Link
          href="/mythology/studio"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-sm shadow-sm hover:opacity-95 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Script
        </Link>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "projects"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            My Generated Scripts ({scriptProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "presets"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Viral Story Vault ({PURANIC_STORY_PRESETS.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts or epics..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Tab 1: My Generated Scripts */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading scripts...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/50">
                <FileText className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">No scripts generated yet</h3>
              <p className="text-xs text-slate-500 mb-6">
                Start a video project in the studio to generate scene-by-scene narrated mythology scripts.
              </p>
              <Link
                href="/mythology/studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors"
              >
                Launch Studio Wizard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((proj) => {
                const fullNarration = proj.scenes.map(s => s.narration).join("\n\n");
                const styleName = MYTH_ART_STYLES.find(s => s.id === proj.artStyleId)?.name || proj.artStyleId;
                return (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-300 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                          {proj.language} • {proj.targetDurationSec}s
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyScript(proj.id, fullNarration)}
                            title="Copy full script"
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {copiedId === proj.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/mythology/studio/${proj.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Open in Studio"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{proj.storyConcept}</p>

                      {/* Scene breakdown accordion/snippet */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {proj.scenes.map((s, idx) => (
                          <div key={idx} className="text-[11px] leading-relaxed">
                            <span className="font-bold text-amber-600">Scene {s.sceneNumber}:</span>{" "}
                            <span className="text-slate-700">{s.narration}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{proj.scenes.length} scenes • {styleName}</span>
                      <Link
                        href={`/mythology/studio/${proj.id}`}
                        className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Edit & Render
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Viral Story Vault Presets */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 font-black text-[10px] uppercase">
                    {preset.culture.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {preset.source}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{preset.title} ({preset.titleHindi})</h3>
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/5 to-indigo-500/5 border border-amber-200/40 mb-3">
                  <p className="text-[11px] font-medium text-amber-900 italic">
                    "{preset.hookLine}"
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {preset.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/mythology/studio?preset=${preset.id}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Create Video with this Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
