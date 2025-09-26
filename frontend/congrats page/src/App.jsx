import { useEffect, useState } from "react"
import { Trophy, Star, Crown, Medal, Sparkles } from "lucide-react"
import Cookies from "js-cookie"

const CongratsPage = () => {
    const [name, setName] = useState("")
    const [savedName, setSavedName] = useState(Cookies.get("username") || "")
    const [leaderboard, setLeaderboard] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    const fetchLeaderboard = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("https://congrats-page-backend.vercel.app/api/leaderboard")
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
            const data = await res.json()
            setLeaderboard(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [savedName])

    const submitName = async () => {
        if (!name.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch("https://congrats-page-backend.vercel.app/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            })
            const data = await res.json()
            if (res.ok) {
                Cookies.set("username", name, { expires: 7 })
                setSavedName(name)
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3000)
                fetchLeaderboard()
            } else {
                alert(data.error || "Name already taken or invalid")
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Crown className="w-5 h-5 text-yellow-500" />
            case 1: return <Medal className="w-5 h-5 text-gray-400" />
            case 2: return <Medal className="w-5 h-5 text-amber-600" />
            default: return <Star className="w-4 h-4 text-blue-500" />
        }
    }

    const getRankStyle = (index) => {
        switch (index) {
            case 0: return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800"
            case 1: return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700"
            case 2: return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800"
            default: return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce"
                            style={{
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 2 + 's',
                                animationDuration: (2 + Math.random() * 2) + 's'
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                    ))}
                </div>
            )}

            <div className="max-w-3xl w-full space-y-8">
                {!savedName ? (
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center transform transition-all duration-500 hover:scale-105">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 animate-pulse shadow-lg">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                🎉 Congratulations!
                            </h1>
                            <p className="text-gray-700 text-lg">Enter your name to join the Hall of Fame.</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter your name..."
                                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 outline-none text-center shadow-sm"
                                onKeyDown={e => e.key === 'Enter' && submitName()}
                            />
                            <button
                                onClick={submitName}
                                disabled={!name.trim() || isLoading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-8 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg shadow-lg"
                            >
                                {isLoading ? "Submitting..." : "🚀 Submit & Join Leaderboard"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center transform transition-all duration-500">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 shadow-lg">
                            <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Welcome back, {savedName}! 🎊
                        </h2>
                        <p className="text-gray-700 mt-2 text-lg">Great to see you again!</p>
                    </div>
                )}

                {/* Leaderboard */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 flex justify-center items-center space-x-3">
                        <Trophy className="w-8 h-8 text-yellow-300" />
                        <h3 className="text-2xl font-bold text-white tracking-wide">Hall of Fame</h3>
                        <Trophy className="w-8 h-8 text-yellow-300" />
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {leaderboard.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${getRankStyle(index)} shadow-md`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/50 shadow-inner">
                                                {getRankIcon(index)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold text-lg">#{index + 1}</span>
                                                    <span className="font-semibold text-lg">{user.name}</span>
                                                    {savedName === user.name && (
                                                        <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">You</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl">{user.score.toLocaleString()}</div>
                                            <div className="text-sm opacity-75">points</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CongratsPage
