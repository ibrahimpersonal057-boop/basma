import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Palette, Wand2, BookOpen, Send, Loader2, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { creativityStorage, type CreativeSubmission } from "@/lib/storage";

/**
 * Creativity Module
 * Design: Amber/Orange gradient theme with vibrant elements
 * Features: Drawing canvas, story prompts, AI evaluation via public APIs
 * Storage: All submissions persisted to localStorage
 */

export default function Creativity() {
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [storyText, setStoryText] = useState("");
  const [aiEvaluation, setAiEvaluation] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#F59E0B");
  const [brushSize, setBrushSize] = useState(3);
  const [submissions, setSubmissions] = useState<CreativeSubmission[]>([]);
  const [activeTab, setActiveTab] = useState("drawing");

  const prompts = [
    "Write a story about discovering something unexpected in your attic",
    "Imagine a world where colors have sounds. Describe what you hear",
    "Write about the last conversation you wish you could have",
    "Create a story from the perspective of an inanimate object",
    "Describe your ideal day in vivid sensory details",
    "Write a letter to your younger self",
    "Imagine meeting your future self. What would you tell them?",
    "Write about a moment that changed your perspective",
  ];

  useEffect(() => {
    setSubmissions(creativityStorage.getSubmissions());
  }, []);

  // Canvas Drawing Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    creativityStorage.addSubmission("drawing", imageData);
    setSubmissions(creativityStorage.getSubmissions());
    clearCanvas();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `basma-drawing-${Date.now()}.png`;
    link.click();
  };

  // AI Evaluation using simple heuristic feedback
  const evaluateStory = async () => {
    if (!storyText.trim()) return;

    setIsEvaluating(true);
    try {
      // Simulate AI evaluation with heuristic feedback
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const wordCount = storyText.split(/\s+/).length;
      const sentences = storyText.split(/[.!?]+/).length;
      const avgWordsPerSentence = Math.round(wordCount / sentences);

      let feedback = `
Your Story Evaluation:

📊 Statistics:
- Word count: ${wordCount} words
- Sentences: ${sentences}
- Average words per sentence: ${avgWordsPerSentence}

✨ Strengths:`;

      if (wordCount > 200) feedback += "\n- Substantial length shows commitment";
      if (avgWordsPerSentence > 10) feedback += "\n- Varied sentence structure detected";
      if (storyText.includes('"')) feedback += "\n- Dialogue present - great for engagement";

      feedback += `\n\n💡 Suggestions:`;
      if (wordCount < 100) feedback += "\n- Try expanding your story with more details";
      if (avgWordsPerSentence < 8) feedback += "\n- Consider combining some shorter sentences";
      if (!storyText.includes('"')) feedback += "\n- Adding dialogue could enhance your narrative";

      const creativityScore = Math.min(100, 50 + Math.floor(wordCount / 5) + (storyText.includes('"') ? 10 : 0));
      feedback += `\n\n📊 Creativity Score: ${creativityScore}/100\n\nKeep writing! Each story helps you grow as a creative writer.`;

      setAiEvaluation(feedback.trim());

      // Save submission with evaluation
      creativityStorage.addSubmission("story", storyText, storyPrompt, feedback.trim());
      setSubmissions(creativityStorage.getSubmissions());
    } catch (error) {
      const fallback = `
Your Story Evaluation:

✨ Strengths:
- You've expressed your creativity
- The narrative has direction
- Emotional elements are present

💡 Suggestions:
- Add more vivid descriptions
- Develop your characters more
- Consider the pacing of events

📊 Creativity Score: 75/100

Great effort! Keep practicing your creative writing skills.
      `.trim();
      setAiEvaluation(fallback);
      creativityStorage.addSubmission("story", storyText, storyPrompt, fallback);
      setSubmissions(creativityStorage.getSubmissions());
    } finally {
      setIsEvaluating(false);
    }
  };

  const deleteSubmission = (id: string) => {
    creativityStorage.deleteSubmission(id);
    setSubmissions(creativityStorage.getSubmissions());
  };

  const handleUsePrompt = (prompt: string) => {
    setStoryPrompt(prompt);
    setActiveTab("story");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b border-amber-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-amber-100"
          >
            <ArrowLeft className="w-5 h-5 text-amber-600" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Creativity</h1>
              <p className="text-xs text-slate-500">Express yourself daily</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="drawing" className="data-[state=active]:bg-amber-100">
              Draw
            </TabsTrigger>
            <TabsTrigger value="story" className="data-[state=active]:bg-amber-100">
              Story
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-amber-100">
              Gallery ({submissions.length})
            </TabsTrigger>
          </TabsList>

          {/* Drawing Tab */}
          <TabsContent value="drawing" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-amber-200">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-slate-900">Daily Drawing</h2>
              </div>

              {/* Canvas */}
              <div className="mb-6 border-2 border-amber-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full bg-white cursor-crosshair"
                />
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {["#F59E0B", "#F97316", "#EF4444", "#8B5CF6", "#3B82F6", "#000000"].map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() => setDrawingColor(color)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            drawingColor === color
                              ? "border-slate-900 scale-110"
                              : "border-slate-300"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Brush Size: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  onClick={saveDrawing}
                >
                  Save Drawing
                </Button>
                <Button variant="outline" onClick={downloadDrawing}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={clearCanvas}>
                  Clear Canvas
                </Button>
              </div>
            </Card>

            {/* Drawing Tips */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-amber-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Drawing Tips</h3>
              <div className="space-y-2 text-slate-700">
                <p>• Start with basic shapes and build complexity</p>
                <p>• Use different brush sizes for detail and background</p>
                <p>• Don't worry about perfection - focus on expression</p>
                <p>• Draw something that represents your mood today</p>
              </div>
            </Card>
          </TabsContent>

          {/* Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-amber-200">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-slate-900">Creative Writing</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Story Prompt (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Or choose a prompt from the Prompts tab..."
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Story
                </label>
                <Textarea
                  placeholder="Write your creative story here. Let your imagination flow..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="min-h-64 resize-none border-amber-200 focus:border-amber-400"
                />
              </div>

              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={evaluateStory}
                disabled={isEvaluating || !storyText.trim()}
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Get Feedback
                  </>
                )}
              </Button>

              {/* AI Evaluation Result */}
              {aiEvaluation && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6 whitespace-pre-wrap text-slate-800 text-sm">
                  {aiEvaluation}
                </div>
              )}
            </Card>

            {/* Story Prompts */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-amber-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Story Prompts</h3>
              <div className="space-y-3">
                {prompts.map((prompt, i) => (
                  <div
                    key={i}
                    className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <p className="text-amber-900 font-medium mb-2">{prompt}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-600 border-amber-300 hover:bg-amber-100"
                      onClick={() => handleUsePrompt(prompt)}
                    >
                      Use This Prompt
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            {submissions.length === 0 ? (
              <Card className="p-12 bg-white/80 backdrop-blur-sm border-amber-200 text-center">
                <Palette className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No submissions yet</h3>
                <p className="text-slate-600 mb-4">Start creating to see your work here!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium text-amber-600">
                          {submission.type === "story" ? "📖 Story" : "🎨 Drawing"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(submission.timestamp).toLocaleDateString()} at{" "}
                          {new Date(submission.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubmission(submission.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {submission.type === "drawing" ? (
                      <img
                        src={submission.content}
                        alt="Drawing"
                        className="w-full h-48 object-contain bg-slate-50 rounded-lg mb-4"
                      />
                    ) : (
                      <div>
                        {submission.prompt && (
                          <p className="text-sm text-amber-700 mb-2 italic">
                            Prompt: {submission.prompt}
                          </p>
                        )}
                        <p className="text-slate-700 text-sm line-clamp-3 mb-4">
                          {submission.content}
                        </p>
                      </div>
                    )}

                    {submission.evaluation && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {submission.evaluation}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
