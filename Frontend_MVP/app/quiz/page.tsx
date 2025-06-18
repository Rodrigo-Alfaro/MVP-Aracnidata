"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, CheckCircle, AlertTriangle, FileText, Lock, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface QuizAnswers {
  dataType: string
  encryption: string
  policies: string
  twoFA: string
  audits: string
  incidentPlan: string
}

export default function QuizPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<QuizAnswers>({
    dataType: "",
    encryption: "",
    policies: "",
    twoFA: "",
    audits: "",
    incidentPlan: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  const handleAnswerChange = (question: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const selectedLabels = questions.map((q) => {
      const selectedValue = answers[q.field]
      const selectedOption = q.options.find((opt) => opt.value === selectedValue)
      return selectedOption?.label || ""
    })

    const summary = selectedLabels.join("; ")

    try {
      const response = await fetch("/api/quiz-submit", { // url del endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "project123", 
          description: summary,
        }),
      })

      if (response.ok) {
        router.push("/quiz-results")
      } else {
        console.error("Error al enviar las respuestas del quiz")
      }
    } catch (error) {
      console.error("Error de red:", error)
    }
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return answers.dataType !== ""
      case 2:
        return answers.encryption !== ""
      case 3:
        return answers.policies !== ""
      case 4:
        return answers.twoFA !== ""
      case 5:
        return answers.audits !== ""
      case 6:
        return answers.incidentPlan !== ""
      default:
        return false
    }
  }

  const canProceed = isStepComplete(currentStep)
  const allComplete = Object.values(answers).every((answer) => answer !== "")

  const questions = [
    {
      id: 1,
      icon: FileText,
      title: "Tipo de Datos",
      question: "¿Qué tipo de datos personales maneja tu aplicación?",
      field: "dataType" as keyof QuizAnswers,
      options: [
        { value: "basic", label: "Datos básicos (nombre, email, teléfono)", points: 1 },
        { value: "sensitive", label: "Datos sensibles (financieros, médicos)", points: 2 },
        { value: "biometric", label: "Datos biométricos (huellas, reconocimiento facial)", points: 3 },
        { value: "none", label: "No manejo datos personales", points: 0 },
      ],
    },
    {
      id: 2,
      icon: Lock,
      title: "Encriptación",
      question: "¿Tienes implementado un sistema de encriptación para los datos?",
      field: "encryption" as keyof QuizAnswers,
      options: [
        { value: "advanced", label: "Sí, encriptación avanzada (AES-256 o superior)", points: 3 },
        { value: "basic", label: "Sí, encriptación básica", points: 2 },
        { value: "none", label: "No tengo encriptación implementada", points: 0 },
      ],
    },
    {
      id: 3,
      icon: FileText,
      title: "Políticas",
      question: "¿Cuentas con políticas de privacidad y términos de uso actualizados?",
      field: "policies" as keyof QuizAnswers,
      options: [
        { value: "updated", label: "Sí, actualizadas según la nueva ley", points: 3 },
        { value: "outdated", label: "Sí, pero necesitan actualización", points: 1 },
        { value: "none", label: "No tengo políticas implementadas", points: 0 },
      ],
    },
    {
      id: 4,
      icon: Shield,
      title: "Autenticación 2FA",
      question: "¿Implementas autenticación de dos factores (2FA)?",
      field: "twoFA" as keyof QuizAnswers,
      options: [
        { value: "mandatory", label: "Sí, obligatorio para todos los usuarios", points: 3 },
        { value: "optional", label: "Sí, opcional para los usuarios", points: 2 },
        { value: "none", label: "No implemento 2FA", points: 0 },
      ],
    },
    {
      id: 5,
      icon: Activity,
      title: "Auditorías",
      question: "¿Realizas auditorías de seguridad periódicas?",
      field: "audits" as keyof QuizAnswers,
      options: [
        { value: "regular", label: "Sí, cada 3-6 meses", points: 3 },
        { value: "annual", label: "Sí, anualmente", points: 2 },
        { value: "none", label: "No realizo auditorías", points: 0 },
      ],
    },
    {
      id: 6,
      icon: AlertTriangle,
      title: "Plan de Incidentes",
      question: "¿Tienes un plan de respuesta ante incidentes de ciberseguridad?",
      field: "incidentPlan" as keyof QuizAnswers,
      options: [
        { value: "comprehensive", label: "Sí, plan completo y probado", points: 3 },
        { value: "basic", label: "Sí, plan básico", points: 1 },
        { value: "none", label: "No tengo plan de respuesta", points: 0 },
      ],
    },
  ]

  const currentQuestion = questions[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
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
              <span className="text-xl font-bold text-white">Evaluación Ley 21.719</span>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white">
            Paso {currentStep} de {totalSteps}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de Evaluación</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Steps */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`p-2 rounded-lg text-center transition-all ${
                index + 1 === currentStep
                  ? "bg-blue-600 text-white"
                  : isStepComplete(index + 1)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <q.icon className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-medium">{q.title}</div>
            </div>
          ))}
        </div>

        {/* Current Question */}
        <Card className="mb-8 border-blue-100">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <currentQuestion.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
                <CardDescription className="text-lg">{currentQuestion.question}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                    answers[currentQuestion.field] === option.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.field}
                    value={option.value}
                    checked={answers[currentQuestion.field] === option.value}
                    onChange={(e) => handleAnswerChange(currentQuestion.field, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium flex-1">{option.label}</span>
                  {answers[currentQuestion.field] === option.value && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-blue-200 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            Pregunta {currentStep} de {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
              Siguiente
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!allComplete} className="bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Ver Resultados
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Esta evaluación te ayudará a identificar áreas de mejora para cumplir con la Ley 21.719 de Ciberseguridad.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Todas tus respuestas son confidenciales y se utilizan únicamente para generar recomendaciones
            personalizadas.
          </p>
        </div>
      </div>
    </div>
  )
}
