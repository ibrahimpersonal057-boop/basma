import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Brain, Code2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logicalStorage } from "@/lib/storage";

/**
 * Logical Thinking Module
 * Design: Purple gradient theme with structured layout
 * Features: Pseudocode challenges, logic puzzles, solutions
 * Storage: All progress persisted to localStorage
 */

export default function LogicalThinking() {
  const [, navigate] = useLocation();
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [stats, setStats] = useState(logicalStorage.getStats());

  const challenges = [
    {
      id: 1,
      title: "Find the Maximum",
      difficulty: "Beginner",
      description: "Write pseudocode to find the maximum number in a list",
      pseudocode: `FUNCTION findMax(list)
  max = list[0]
  FOR each number in list
    IF number > max THEN
      max = number
    END IF
  END FOR
  RETURN max
END FUNCTION`,
      question: "What would be the output for findMax([3, 7, 2, 9, 1])?",
      answer: "9",
      explanation: "The function iterates through the list and keeps track of the largest number. Starting with 3, it compares each element and updates max when a larger number is found.",
    },
    {
      id: 2,
      title: "Reverse a String",
      difficulty: "Beginner",
      description: "Write pseudocode to reverse a string",
      pseudocode: `FUNCTION reverseString(str)
  reversed = ""
  FOR i = length(str) - 1 DOWN TO 0
    reversed = reversed + str[i]
  END FOR
  RETURN reversed
END FUNCTION`,
      question: "What would reverseString('hello') return?",
      answer: "olleh",
      explanation: "The function starts from the last character and builds a new string by adding each character from right to left.",
    },
    {
      id: 3,
      title: "Count Occurrences",
      difficulty: "Intermediate",
      description: "Count how many times a value appears in a list",
      pseudocode: `FUNCTION countOccurrences(list, target)
  count = 0
  FOR each element in list
    IF element == target THEN
      count = count + 1
    END IF
  END FOR
  RETURN count
END FUNCTION`,
      question: "What would countOccurrences([1, 2, 2, 3, 2, 4], 2) return?",
      answer: "3",
      explanation: "The function counts how many times the value 2 appears in the list. It appears 3 times at indices 1, 2, and 4.",
    },
    {
      id: 4,
      title: "Check Prime Number",
      difficulty: "Intermediate",
      description: "Determine if a number is prime",
      pseudocode: `FUNCTION isPrime(n)
  IF n < 2 THEN
    RETURN false
  END IF
  FOR i = 2 TO sqrt(n)
    IF n % i == 0 THEN
      RETURN false
    END IF
  END FOR
  RETURN true
END FUNCTION`,
      question: "Is 17 a prime number?",
      answer: "true",
      explanation: "17 is only divisible by 1 and itself, making it a prime number. The function checks divisibility up to the square root of n.",
    },
    {
      id: 5,
      title: "Fibonacci Sequence",
      difficulty: "Advanced",
      description: "Generate the nth Fibonacci number",
      pseudocode: `FUNCTION fibonacci(n)
  IF n <= 1 THEN
    RETURN n
  END IF
  RETURN fibonacci(n-1) + fibonacci(n-2)
END FUNCTION`,
      question: "What is the 6th Fibonacci number?",
      answer: "5",
      explanation: "The Fibonacci sequence is: 0, 1, 1, 2, 3, 5... The 6th number (0-indexed from 0) is 5.",
    },
  ];

  const currentChallenge = challenges[selectedChallenge];
  const isCorrect = userAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase();
  const isChallengeCompleted = stats.completed >= selectedChallenge + 1;

  const handleSubmit = () => {
    if (isCorrect) {
      logicalStorage.addChallenge(currentChallenge.id, true);
      setStats(logicalStorage.getStats());
    } else {
      logicalStorage.addChallenge(currentChallenge.id, false);
    }
    setShowSolution(true);
  };

  const handleSelectChallenge = (idx: number) => {
    setSelectedChallenge(idx);
    setUserAnswer("");
    setShowSolution(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-purple-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-purple-100"
          >
            <ArrowLeft className="w-5 h-5 text-purple-600" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Logical Thinking</h1>
              <p className="text-xs text-slate-500">Master pseudocode & logic puzzles</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-900">Your Progress</h2>
              <span className="text-sm text-slate-600">
                {stats.completed} / {challenges.length} completed
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completed / challenges.length) * 100}%` }}
              />
            </div>
          </div>

          <Tabs defaultValue="challenges" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-100">
                Challenges
              </TabsTrigger>
              <TabsTrigger value="concepts" className="data-[state=active]:bg-purple-100">
                Concepts
              </TabsTrigger>
            </TabsList>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Challenge List */}
                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    {challenges.map((challenge, idx) => {
                      const completed = stats.completed >= idx + 1;
                      return (
                        <button
                          key={challenge.id}
                          onClick={() => handleSelectChallenge(idx)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedChallenge === idx
                              ? "bg-purple-100 border-2 border-purple-400"
                              : "bg-white border border-slate-200 hover:border-purple-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{challenge.title}</p>
                              <p className="text-xs text-slate-500">{challenge.difficulty}</p>
                            </div>
                            {completed && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Challenge Content */}
                <div className="lg:col-span-3 space-y-6">
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 className="w-5 h-5 text-purple-600" />
                      <h3 className="text-2xl font-bold text-slate-900">
                        {currentChallenge.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 mb-6">{currentChallenge.description}</p>

                    {/* Pseudocode Block */}
                    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                      <pre>{currentChallenge.pseudocode}</pre>
                    </div>

                    {/* Question */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-purple-900 mb-3">
                        {currentChallenge.question}
                      </p>
                      <input
                        type="text"
                        placeholder="Enter your answer..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={showSolution}
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !showSolution) handleSubmit();
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 mb-6">
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                        onClick={handleSubmit}
                        disabled={showSolution || !userAnswer.trim()}
                      >
                        Check Answer
                      </Button>
                      {showSolution && (
                        <Button variant="outline" onClick={() => setShowSolution(false)}>
                          Try Again
                        </Button>
                      )}
                    </div>

                    {/* Feedback */}
                    {showSolution && (
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-50 border-green-300"
                            : "bg-red-50 border-red-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p
                              className={`font-semibold mb-2 ${
                                isCorrect ? "text-green-900" : "text-red-900"
                              }`}
                            >
                              {isCorrect ? "Correct!" : "Not quite right"}
                            </p>
                            <p className={isCorrect ? "text-green-800" : "text-red-800"}>
                              {currentChallenge.explanation}
                            </p>
                            {!isCorrect && (
                              <p className="mt-2 font-semibold text-red-800">
                                Correct answer: {currentChallenge.answer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Concepts Tab */}
            <TabsContent value="concepts" className="space-y-6">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Pseudocode Basics</h3>

                <div className="space-y-6">
                  {[
                    {
                      title: "Variables",
                      description: "Store data values",
                      example: "x = 5\nname = 'Alice'",
                    },
                    {
                      title: "Loops",
                      description: "Repeat code blocks",
                      example: "FOR i = 1 TO 10\n  PRINT i\nEND FOR",
                    },
                    {
                      title: "Conditionals",
                      description: "Make decisions",
                      example: "IF x > 5 THEN\n  PRINT 'Greater'\nEND IF",
                    },
                    {
                      title: "Functions",
                      description: "Reusable code blocks",
                      example: "FUNCTION add(a, b)\n  RETURN a + b\nEND FUNCTION",
                    },
                  ].map((concept, i) => (
                    <div key={i} className="border-l-4 border-purple-400 pl-4 py-2">
                      <h4 className="font-bold text-purple-900 mb-1">{concept.title}</h4>
                      <p className="text-slate-600 text-sm mb-2">{concept.description}</p>
                      <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs">
                        <pre>{concept.example}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
