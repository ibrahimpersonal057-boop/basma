import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, BookOpen, Wind, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { moodStorage, journalStorage, type MoodEntry, type JournalEntry } from "@/lib/storage";

/**
 * Mental Health Module
 * Design: Teal gradient theme with calming elements
 * Features: Mood tracker, journaling, breathing exercises
 * Storage: All data persisted to localStorage
 */

export default function MentalHealth() {
  const [, navigate] = useLocation();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [weeklyMoods, setWeeklyMoods] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const moods = [
    { emoji: "😢", label: "Sad", value: "sad" },
    { emoji: "😔", label: "Anxious", value: "anxious" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😄", label: "Great", value: "great" },
  ];

  // Load data on mount
  useEffect(() => {
    const today = moodStorage.getTodayMood();
    if (today) {
      setTodayMood(today.mood);
    }

    setWeeklyMoods(moodStorage.getMoodsByWeek());
    setJournalEntries(journalStorage.getTodayEntries());
  }, []);

  const handleMoodSelect = (mood: string) => {
    moodStorage.addMood(mood as "sad" | "anxious" | "neutral" | "good" | "great");
    setTodayMood(mood);
    setWeeklyMoods(moodStorage.getMoodsByWeek());
  };

  const handleSaveJournal = () => {
    if (journalEntry.trim()) {
      journalStorage.addEntry(journalEntry);
      setJournalEntry("");
      setJournalEntries(journalStorage.getTodayEntries());
    }
  };

  const handleDeleteJournal = (id: string) => {
    journalStorage.deleteEntry(id);
    setJournalEntries(journalStorage.getTodayEntries());
  };

  const startBreathingExercise = () => {
    setIsBreathing(true);
    let phase: "inhale" | "hold" | "exhale" = "inhale";
    let count = 0;

    const interval = setInterval(() => {
      count++;
      if (count === 4) {
        phase = phase === "inhale" ? "hold" : phase === "hold" ? "exhale" : "inhale";
        count = 0;
        setBreathingPhase(phase);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
      setBreathingPhase("inhale");
    }, 16000);
  };

  // Get mood values for weekly chart
  const getMoodValue = (mood: string): number => {
    const values: Record<string, number> = {
      sad: 1,
      anxious: 2,
      neutral: 3,
      good: 4,
      great: 5,
    };
    return values[mood] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-teal-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-teal-100"
          >
            <ArrowLeft className="w-5 h-5 text-teal-600" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Mental Health</h1>
              <p className="text-xs text-slate-500">Track, reflect, and heal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <Tabs defaultValue="mood" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mood" className="data-[state=active]:bg-teal-100">
              Mood Tracker
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-teal-100">
              Journal
            </TabsTrigger>
            <TabsTrigger value="breathing" className="data-[state=active]:bg-teal-100">
              Breathing
            </TabsTrigger>
          </TabsList>

          {/* Mood Tracker Tab */}
          <TabsContent value="mood" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How are you feeling today?</h2>
              <div className="grid grid-cols-5 gap-4 mb-8">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMoodSelect(m.value)}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      todayMood === m.value
                        ? "bg-teal-100 scale-110 ring-2 ring-teal-400"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <div className="text-4xl mb-2">{m.emoji}</div>
                    <p className="text-sm font-medium text-slate-700">{m.label}</p>
                  </button>
                ))}
              </div>

              {todayMood && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <p className="text-teal-900">
                    ✓ Mood recorded for today. Remember to journal about what's on your mind.
                  </p>
                </div>
              )}
            </Card>

            {/* Mood History */}
            {weeklyMoods.length > 0 && (
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">This Week</h3>
                <div className="flex gap-2 items-end h-32">
                  {weeklyMoods.map((mood, i) => {
                    const value = getMoodValue(mood.mood);
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-teal-400 to-cyan-300 rounded-t-lg hover:from-teal-500 hover:to-cyan-400 transition-all"
                        style={{ height: `${(value / 5) * 100}%` }}
                        title={`${mood.date}: ${mood.mood}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  {weeklyMoods.map((mood, i) => (
                    <span key={i}>{new Date(mood.date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-slate-900">Daily Journal</h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What's on your mind?
                </label>
                <Textarea
                  placeholder="Write your thoughts, feelings, and experiences here. There's no right or wrong way to journal."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-64 resize-none border-teal-200 focus:border-teal-400"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  onClick={handleSaveJournal}
                  disabled={!journalEntry.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setJournalEntry("")}>
                  Clear
                </Button>
              </div>
            </Card>

            {/* Today's Journal Entries */}
            {journalEntries.length > 0 && (
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Today's Entries</h3>
                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-teal-600 font-medium">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteJournal(entry.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-teal-900 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Breathing Exercise Tab */}
          <TabsContent value="breathing" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
              <div className="flex items-center gap-2 mb-6">
                <Wind className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-slate-900">Breathing Exercise</h2>
              </div>

              <div className="text-center mb-8">
                <p className="text-slate-600 mb-8">
                  Follow the guided breathing exercise to calm your mind and reduce stress.
                </p>

                {/* Breathing Circle */}
                <div className="flex justify-center mb-8">
                  <div
                    className={`w-48 h-48 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl transition-all duration-1000 ${
                      isBreathing
                        ? breathingPhase === "inhale"
                          ? "scale-100"
                          : breathingPhase === "hold"
                            ? "scale-110"
                            : "scale-90"
                        : "scale-100"
                    }`}
                  >
                    {isBreathing ? (
                      <span>
                        {breathingPhase === "inhale" && "Inhale"}
                        {breathingPhase === "hold" && "Hold"}
                        {breathingPhase === "exhale" && "Exhale"}
                      </span>
                    ) : (
                      "Ready?"
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  onClick={startBreathingExercise}
                  disabled={isBreathing}
                >
                  {isBreathing ? "Breathing..." : "Start Exercise"}
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="font-semibold text-teal-900 mb-2">How it works:</h4>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• Inhale for 4 seconds</li>
                  <li>• Hold for 4 seconds</li>
                  <li>• Exhale for 4 seconds</li>
                  <li>• Repeat 4 times (total 48 seconds)</li>
                </ul>
              </div>
            </Card>

            {/* Breathing Tips */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-teal-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Tips for Better Results</h3>
              <div className="space-y-3">
                {[
                  "Find a quiet, comfortable place to sit",
                  "Keep your back straight and shoulders relaxed",
                  "Practice in the morning or when you feel stressed",
                  "Do this exercise 2-3 times daily for best results",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-teal-50 rounded-lg">
                    <span className="text-teal-600 font-bold">✓</span>
                    <p className="text-teal-900">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
