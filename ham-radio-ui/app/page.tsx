"use client"
import {useState , useEffect } from "react"
import Link from "next/link"
type Module = {
  id : number,
  title: string,
  level: string,
  pages : number[],
  topics: string[]
}
export default function Page() {

  const [modules , setModules ] = useState<Module[]>([])
  useEffect(() => {
    const fetchModules = async () => {
        const res = await fetch("http://localhost:8000/modules")
        const data = await res.json()
        setModules(data)
    }
    fetchModules()
}, [])
 
  return (
    <div className="min-h-screen bg-black p-8">
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white">Ham Radio ASOC Exam Prep</h1>
                <p className="text-sm text-cyan-600 mt-1">Select a module to study or practice exam questions</p>
            </div>

            {["Restricted", "General", "Both"].map(level => (
                <div key={level} className="mb-10">
                    <p className="text-xs uppercase tracking-widest text-white mb-3">
                        {level} grade
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {modules.filter(m => m.level === level).map(module => (
                            <div key={module.id} className="border border-zinc-800 rounded-lg p-4 flex flex-col gap-4 hover:border-zinc-600 transition-colors">
                                <span className="text-sm text-white">{module.title}</span>
                                <div className="flex gap-2 mt-auto">
                                            <Link href={`/study/${module.id}`} className="flex-1 py-1.5 text-xs rounded border border-zinc-700 text-zinc-400 hover:border-cyan-700 hover:text-cyan-400 transition-colors text-center">
    Study
</Link>
                                    <Link href={`/exam/${module.id}`} className="flex-1 py-1.5 text-xs rounded bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors text-center">
    Exam
</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
 
}