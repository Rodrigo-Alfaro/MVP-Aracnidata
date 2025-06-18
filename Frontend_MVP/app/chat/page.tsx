"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Bot, User, ArrowLeft, Lightbulb, Code, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickQuestions = [
  {
    icon: Code,
    title: "Implementación de Encriptación",
    question: "¿Qué tipo de encriptación necesito para mi app que maneja datos de contacto?",
  },
  {
    icon: FileText,
    title: "Políticas de Privacidad",
    question: "¿Cómo debo redactar mi política de privacidad para cumplir la ley?",
  },
  {
    icon: AlertTriangle,
    title: "Auditoría de Seguridad",
    question: "¿Qué medidas de seguridad debo implementar para datos biométricos?",
  },
  {
    icon: Lightbulb,
    title: "Mejores Prácticas",
    question: "¿Cuáles son las mejores prácticas para el almacenamiento seguro de datos?",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy tu consultor especializado en cumplimiento legal para desarrollo de software. Puedo ayudarte con:\n\n• Implementación de medidas de ciberseguridad\n• Ejemplos de código específicos para tu contexto\n• Auditoría de sistemas existentes\n• Guías de cumplimiento legal\n\n¿En qué tipo de proyecto estás trabajando?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simular respuesta del chatbot (aquí integrarías tu API real)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Entiendo tu consulta sobre "${inputMessage}". Basándome en el marco legal actual, te recomiendo:\n\n1. **Análisis del contexto**: Primero necesito entender qué tipo de datos manejas\n2. **Medidas específicas**: Implementar las protecciones adecuadas según el nivel de sensibilidad\n3. **Código de ejemplo**: Te proporcionaré implementaciones prácticas\n\n¿Podrías contarme más detalles sobre tu aplicación? Por ejemplo:\n- ¿Qué tipo de datos almacenas?\n- ¿Es una app web, móvil o de escritorio?\n- ¿Tienes usuarios registrados?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/aracnidata-logo.png"
                alt="AracniData Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xl font-bold text-white">Consultor IA</span>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">
            <Bot className="h-3 w-3 mr-1" />
            En línea
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas frecuentes:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {quickQuestions.map((item, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow border-blue-100"
                  onClick={() => handleQuickQuestion(item.question)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <item.icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.question}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <Card className="mb-6 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
              Conversación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />}
                      {message.role === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Describe tu proyecto o pregunta sobre cumplimiento legal..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 min-h-[60px] resize-none border-blue-200 focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Presiona Enter para enviar, Shift+Enter para nueva línea</div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Este consultor IA proporciona orientación general. Para casos complejos, consulta con un especialista legal
            en ciberseguridad.
          </p>
        </div>
      </div>
    </div>
  )
}
