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

type Props = { params: Promise<{ id: string }> }

export default function StudyPage({ params }: Props) {
    const [moduleId, setModuleId] = useState<number | null>(null)
    const [module, setModule] = useState<Module | null>(null)
    const [summary, setSummary] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const init = async () => {
            const p = await params
            const id = parseInt(p.id)
            setModuleId(id)

            const res = await fetch("http://localhost:8000/modules")
            const data = await res.json()
            const found = data.find((m: Module) => m.id === id)
            setModule(found)

            setLoading(true)
            const sumRes = await fetch("http://localhost:8000/study", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: "Summarize this module and explain all key concepts clearly for an ASOC exam student",
                    module_id: id
                })
            })
            const sumData = await sumRes.json()
            setSummary(sumData.answer)
            setLoading(false)
        }
        init()
    }, [])

    const askQuestion = async () => {
        if (!question.trim() || !moduleId) return
        setLoading(true)
        const res = await fetch("http://localhost:8000/study", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, module_id: moduleId })
        })
        const data = await res.json()
        setAnswer(data.answer)
        setLoading(false)
        setQuestion("")
    }

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors mb-6 block">
                     back to modules
                </Link>

                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-white">{module?.title}</h1>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {module?.topics.map(t => (
                            <span key={t} className="text-xs bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border border-zinc-800 rounded-lg p-5 mb-6">
                    <p className="text-xs uppercase tracking-widest text-cyan-700 mb-3">Summary</p>
                    {loading && !summary ? (
                        <p className="text-sm text-zinc-500">Generating summary...</p>
                    ) : (
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
                    )}
                </div>

                {answer && (
                    <div className="border border-zinc-800 rounded-lg p-5 mb-6">
                        <p className="text-xs uppercase tracking-widest text-cyan-700 mb-3">Answer</p>
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && askQuestion()}
                        placeholder="Ask a question about this module..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-700"
                    />
                    <button
                        onClick={askQuestion}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "..." : "Ask"}
                    </button>
                </div>
            </div>
        </div>
    )
}