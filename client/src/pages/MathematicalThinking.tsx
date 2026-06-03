import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Zap, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mathStorage } from "@/lib/storage";

/**
 * Mathematical Thinking Module
 * Design: Slate/Blue gradient theme with precise layout
 * Features: Speed calculation challenges, leveled difficulty, progress tracking
 * Storage: All scores and statistics persisted to localStorage
 */

export default function MathematicalThinking() {
  const [, navigate] = useLocation();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [stats, setStats] = useState(mathStorage.getStats());
  const [weeklyStats, setWeeklyStats] = useState(mathStorage.getWeeklyStats());

  const generateQuestions = (level: "easy" | "medium" | "hard", count: number = 10) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
      let num1, num2, operation;

      if (level === "easy") {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = ["+", "-"][Math.floor(Math.random() * 2)];
      } else if (level === "medium") {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = ["+", "-", "*"][Math.floor(Math.random() * 3)];
      } else {
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
      }

      let answer;
      if (operation === "+") answer = num1 + num2;
      else if (operation === "-") answer = num1 - num2;
      else if (operation === "*") answer = num1 * num2;
      else answer = Math.floor(num1 / num2);

      newQuestions.push({
        question: `${num1} ${operation} ${num2}`,
        answer: answer.toString(),
      });
    }
    return newQuestions;
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      finishChallenge();
    }
  }, [isActive, timeLeft]);

  const startChallenge = () => {
    const newQuestions = generateQuestions(difficulty);
    setQuestions(newQuestions);
    setIsActive(true);
    setTimeLeft(60);
    setScore(0);
    setCurrentQuestion(0);
    setUserAnswer("");
    setAnswered(false);
  };

  const finishChallenge = () => {
    setIsActive(false);
    const totalQuestions = questions.length;
    const accuracy = (score / totalQuestions) * 100;
    mathStorage.addChallenge(difficulty, score, totalQuestions, 60 - timeLeft);
    setStats(mathStorage.getStats());
    setWeeklyStats(mathStorage.getWeeklyStats());
  };

  const handleSubmit = () => {
    if (currentQuestion < questions.length) {
      const correct = userAnswer === questions[currentQuestion].answer;
      setIsCorrect(correct);
      if (correct) {
        setScore(score + 1);
      }
      setAnswered(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      setAnswered(false);
    } else {
      finishChallenge();
    }
  };

  const getDifficultyColor = (level: "easy" | "medium" | "hard") => {
    if (level === "easy") return "from-green-400 to-emerald-500";
    if (level === "medium") return "from-amber-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Mathematical Thinking</h1>
              <p className="text-xs text-slate-500">Speed calculation training</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <Tabs defaultValue="challenge" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="challenge" className="data-[state=active]:bg-slate-100">
              Challenge
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-slate-100">
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Challenge Tab */}
          <TabsContent value="challenge" className="space-y-6">
            {!isActive ? (
              <>
                {/* Difficulty Selection */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Difficulty</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {(["easy", "medium", "hard"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          difficulty === level
                            ? `bg-gradient-to-br ${getDifficultyColor(level)} text-white border-current`
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold text-lg mb-2 capitalize">{level}</div>
                        <div className="text-sm">
                          {level === "easy" && "Single digits, +/-"}
                          {level === "medium" && "Double digits, +/-/*"}
                          {level === "hard" && "Large numbers, all operations"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 w-full"
                    onClick={startChallenge}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Challenge
                  </Button>
                </Card>

                {/* How It Works */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">How It Works</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-slate-400">1</span>
                      <div>
                        <p className="font-semibold text-slate-900">Choose Your Level</p>
                        <p className="text-sm text-slate-600">Start easy and progress to harder challenges</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-slate-400">2</span>
                      <div>
                        <p className="font-semibold text-slate-900">60 Second Challenge</p>
                        <p className="text-sm text-slate-600">Solve as many problems as you can in 60 seconds</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-slate-400">3</span>
                      <div>
                        <p className="font-semibold text-slate-900">Track Your Progress</p>
                        <p className="text-sm text-slate-600">Improve your speed and accuracy over time</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <>
                {/* Active Challenge */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200">
                  {/* Timer and Score */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Time Left</p>
                      <p
                        className={`text-4xl font-bold ${
                          timeLeft <= 10 ? "text-red-600" : "text-slate-900"
                        }`}
                      >
                        {timeLeft}s
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Question</p>
                      <p className="text-4xl font-bold text-slate-900">
                        {currentQuestion + 1}/{questions.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Score</p>
                      <p className="text-4xl font-bold text-blue-600">{score}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
                    <div
                      className="bg-gradient-to-r from-slate-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Question */}
                  <div className="text-center mb-8">
                    <p className="text-6xl font-bold text-slate-900 font-mono mb-4">
                      {questions[currentQuestion]?.question}
                    </p>
                  </div>

                  {/* Answer Input */}
                  <div className="mb-6">
                    <input
                      type="number"
                      placeholder="Your answer..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={answered}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !answered) handleSubmit();
                      }}
                      className="w-full px-6 py-4 text-2xl text-center border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                      autoFocus
                    />
                  </div>

                  {/* Feedback */}
                  {answered && (
                    <div
                      className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                        isCorrect
                          ? "bg-green-50 border border-green-300"
                          : "bg-red-50 border border-red-300"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <p
                          className={`font-semibold ${
                            isCorrect ? "text-green-900" : "text-red-900"
                          }`}
                        >
                          {isCorrect ? "Correct!" : "Incorrect"}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-red-800">
                            Correct answer: {questions[currentQuestion]?.answer}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {!answered ? (
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim()}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
                        onClick={nextQuestion}
                      >
                        {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
                      </Button>
                    )}
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Statistics</h2>

              {stats.totalChallenges === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No challenges completed yet. Start one to see your stats!</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-slate-600">Best Speed</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{stats.bestSpeed}/sec</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-slate-600">Accuracy</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{stats.averageAccuracy}%</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <p className="text-sm text-slate-600">Challenges</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{stats.totalChallenges}</p>
                    </div>
                  </div>

                  {/* Performance by Difficulty */}
                  <div className="mb-8">
                    <h3 className="font-bold text-slate-900 mb-4">Performance by Difficulty</h3>
                    <div className="space-y-3">
                      {[
                        { level: "Easy", data: stats.byDifficulty.easy, color: "from-green-400 to-emerald-500" },
                        {
                          level: "Medium",
                          data: stats.byDifficulty.medium,
                          color: "from-amber-400 to-orange-500",
                        },
                        { level: "Hard", data: stats.byDifficulty.hard, color: "from-red-400 to-rose-500" },
                      ].map((stat) => (
                        <div key={stat.level}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-900">{stat.level}</span>
                            <span className="text-slate-600">
                              {stat.data.completed} completed • {stat.data.accuracy}% accuracy
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                              style={{ width: `${stat.data.accuracy}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Chart */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4">This Week</h3>
                    <div className="flex gap-2 items-end h-32">
                      {weeklyStats.map((score, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-blue-400 to-indigo-300 rounded-t-lg hover:from-blue-500 hover:to-indigo-400 transition-all"
                          style={{ height: `${Math.max(10, (score / Math.max(...weeklyStats, 1)) * 100)}%` }}
                          title={`${score} points`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
