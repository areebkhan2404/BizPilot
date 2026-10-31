import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import aiService from "../../services/aiService.js"
import Card from "../../components/common/Card.jsx"
import { Send, Bot, User, Sparkles } from "lucide-react"

const SUGGESTIONS = [
  "How do I register my business in India?",
  "What is GST and do I need it?",
  "How to market my business on zero budget?",
  "What is MSME registration and its benefits?",
  "Cloud kitchen shuru karne ke liye kya chahiye?"
]

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

const AiChatPage = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const [sessionId] = useState(() => {
    const saved = sessionStorage.getItem("bizpilot_chat_session")
    if (saved) return saved
    const newId = generateSessionId()
    sessionStorage.setItem("bizpilot_chat_session", newId)
    return newId
  })
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)

  const { data: messages = [] } = useQuery({
    queryKey: ["chat-history", sessionId],
    queryFn: () => aiService.getChatHistory(sessionId, user?.token),
    enabled: !!sessionId && !!user?.token,
    refetchInterval: isSending ? 2000 : false
  })

  const { mutate: sendMessage } = useMutation({
    mutationFn: (data) => aiService.sendChatMessage(data, user?.token),
    onMutate: () => setIsSending(true),
    onSuccess: () => {
      setIsSending(false)
      queryClient.invalidateQueries({ queryKey: ["chat-history", sessionId] })
    },
    onError: (error) => {
      setIsSending(false)
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isSending])

  const handleSend = () => {
    if (!message.trim() || isSending) return
    sendMessage({ sessionId, message: message.trim() })
    setMessage("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Business AI Chat</h1>
          <p className="text-slate-500 text-sm">Ask anything about starting or growing your business in India. Supports Hindi and Hinglish.</p>
        </div>

        <Card className="flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {messages.length === 0 && !isSending && (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-violet-600" />
                </div>
                <p className="font-medium text-slate-700 mb-1">Your Business Advisor</p>
                <p className="text-sm text-slate-500 mb-6">Ask me anything about business planning, GST, licenses, marketing, or funding in India.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setMessage(s); }}
                      className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-violet-300 hover:text-violet-700 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex gap-3 ${msg.isAI ? "" : "flex-row-reverse"} animate-fade-in`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.isAI ? "bg-violet-100" : "bg-emerald-100"
                }`}>
                  {msg.isAI
                    ? <Bot size={15} className="text-violet-600" />
                    : <User size={15} className="text-emerald-600" />
                  }
                </div>
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.isAI
                      ? "bg-white border border-slate-100 text-slate-700"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <Bot size={15} className="text-violet-600" />
                </div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about business licenses, GST, marketing... (Enter to send)"
                rows={2}
                className="flex-1 resize-none text-sm rounded-xl border border-slate-200 px-4 py-2.5 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 transition-all"
                disabled={isSending}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="w-11 h-11 self-end bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              AI provides general guidance only. Consult a CA, lawyer, or local mentor for specific legal or financial advice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AiChatPage

