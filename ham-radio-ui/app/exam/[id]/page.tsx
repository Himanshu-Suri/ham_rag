"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

type Module = {
    id: number
    title: string
    level: string
    pages: number[]
    topics: string[]
}

type Question = {
    question: string
    options: { A: string, B: string, C: string, D: string }
    correct: string
    explanation: string
}

type Result = {
    correct: boolean
    message: string
}

type Props = { params: Promise<{ id: string }> }

export default function ExamPage({ params }: Props) {
    const [moduleId, setModuleId] = useState<number | null>(null)
    const [module, setModule] = useState<Module | null>(null)
    const [question, setQuestion] = useState<Question | null>(null)
    const [selected, setSelected] = useState<string | null>(null)
    const [result, setResult] = useState<Result | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [score, setScore] = useState({ correct: 0, total: 0 })

    useEffect(() => {
        const init = async () => {
            const p = await params
            const id = parseInt(p.id)
            setModuleId(id)
            const res = await fetch("http://localhost:8000/modules")
            const data = await res.json()
            setModule(data.find((m: Module) => m.id === id))
            fetchQuestion(id)
        }
        init()
    }, [])

    const fetchQuestion = async (id: number) => {
        setLoading(true)
        setSelected(null)
        setResult(null)
        const res = await fetch("http://localhost:8000/exam/question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ module_id: id })
        })
        const data = await res.json()
        setQuestion(data)
        setLoading(false)
    }

    const submitAnswer = async (option: string) => {
        if (!question || result) return
        setSelected(option)
        const res = await fetch("http://localhost:8000/exam/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_answer: option,
                correct_answer: question.correct,
                explanation: question.explanation
            })
        })
        const data = await res.json()
        setResult(data)
        setScore(s => ({
            correct: s.correct + (data.correct ? 1 : 0),
            total: s.total + 1
        }))
    }

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors mb-6 block">
                     back to modules
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-white">{module?.title}</h1>
                        <p className="text-xs text-zinc-500 mt-1">Exam mode</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-zinc-500">Score</p>
                        <p className="text-lg font-semibold text-cyan-400">{score.correct}/{score.total}</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-zinc-500">Generating question...</p>
                ) : question ? (
                    <div className="flex flex-col gap-4">
                        <div className="border border-zinc-800 rounded-lg p-5">
                            <p className="text-xs uppercase tracking-widest text-cyan-700 mb-3">Question</p>
                            <p className="text-sm text-white leading-relaxed">{question.question}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {Object.entries(question.options).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => submitAnswer(key)}
                                    disabled={!!result}
                                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                                        result
                                            ? key === question.correct
                                                ? "border-cyan-500 text-cyan-400 bg-cyan-950"
                                                : key === selected
                                                    ? "border-red-800 text-red-400 bg-red-950"
                                                    : "border-zinc-800 text-zinc-600"
                                            : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                                    }`}
                                >
                                    <span className="font-medium mr-2">{key}.</span>{value}
                                </button>
                            ))}
                        </div>

                        {result && (
                            <div className={`border rounded-lg p-4 text-sm ${result.correct ? "border-cyan-800 text-cyan-300" : "border-red-900 text-red-300"}`}>
                                {result.message}
                            </div>
                        )}

                        {result && (
                            <button
                                onClick={() => moduleId && fetchQuestion(moduleId)}
                                className="py-2 text-sm rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors"
                            >
                                Next question →
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}