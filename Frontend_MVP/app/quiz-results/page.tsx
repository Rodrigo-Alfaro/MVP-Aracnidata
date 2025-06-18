"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Download, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function QuizResultsPage() {
  // Simulación de resultados (en producción vendrían de la evaluación real)
  const complianceScore = 65
  const riskLevel = complianceScore >= 80 ? "Bajo" : complianceScore >= 60 ? "Medio" : "Alto"
  const riskColor =
    complianceScore >= 80 ? "text-green-600" : complianceScore >= 60 ? "text-yellow-600" : "text-red-600"
  const riskBadgeColor =
    complianceScore >= 80
      ? "bg-green-100 text-green-800"
      : complianceScore >= 60
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  const recommendations = [
    {
      priority: "Alta",
      title: "Implementar Encriptación Avanzada",
      description: "Tu sistema necesita encriptación AES-256 para cumplir con los estándares de la Ley 21.719",
      status: "pending",
      icon: Shield,
    },
    {
      priority: "Alta",
      title: "Actualizar Políticas de Privacidad",
      description: "Las políticas deben incluir las nuevas disposiciones de la ley de ciberseguridad",
      status: "pending",
      icon: AlertTriangle,
    },
    {
      priority: "Media",
      title: "Implementar Autenticación 2FA",
      description: "Añadir autenticación de dos factores para mejorar la seguridad de acceso",
      status: "pending",
      icon: Shield,
    },
    {
      priority: "Baja",
      title: "Plan de Respuesta a Incidentes",
      description: "Desarrollar un protocolo completo para manejo de incidentes de seguridad",
      status: "completed",
      icon: CheckCircle,
    },
  ]

  const [projectDescription, setProjectDescription] = useState("")
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleEvaluate = async () => {
    if (!projectDescription.trim()) return
    setIsEvaluating(true)
    setEvaluationResult(null)
    try {
      const response = await fetch("http://localhost:8000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "project123", 
          description: projectDescription,
        }),
      })
      if (!response.ok) throw new Error("Error en la respuesta del servidor")
      const data = await response.json()
      setEvaluationResult(data.answer)
    } catch (error) {
      setEvaluationResult("Ocurrió un error al evaluar el proyecto.")
    } finally {
      setIsEvaluating(false)
    }
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
              <span className="text-xl font-bold text-white">Resultados de Evaluación</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Overview */}
        <Card className="mb-8 border-blue-100">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Tu Nivel de Cumplimiento</CardTitle>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-6xl font-bold text-blue-600">{complianceScore}%</div>
              <div>
                <Badge className={riskBadgeColor}>Riesgo {riskLevel}</Badge>
                <p className="text-sm text-gray-600 mt-1">Ley 21.719</p>
              </div>
            </div>
            <Progress value={complianceScore} className="w-full max-w-md mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Requisitos Cumplidos</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-gray-600">Mejoras Necesarias</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600">Riesgos Críticos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl">Recomendaciones Personalizadas</CardTitle>
            <p className="text-gray-600">Acciones prioritarias para cumplir con la Ley 21.719</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${rec.status === "completed" ? "bg-green-100" : "bg-blue-100"}`}>
                    <rec.icon
                      className={`h-5 w-5 ${rec.status === "completed" ? "text-green-600" : "text-blue-600"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <Badge
                        variant={
                          rec.priority === "Alta" ? "destructive" : rec.priority === "Media" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                  {rec.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Evaluation Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(60, 60, 130, 0.08)",
            padding: 32,
            margin: "32px auto",
            maxWidth: 540,
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 12,
              color: "#2d3748",
              letterSpacing: "-0.5px",
            }}
          >
            Evaluación de Proyecto con IA
          </h2>
          <label
            htmlFor="project-description"
            style={{
              fontWeight: 500,
              color: "#475569",
              marginBottom: 6,
              fontSize: 15,
            }}
          >
            Descripción del proyecto
          </label>
          <textarea
            id="project-description"
            rows={4}
            style={{
              width: "100%",
              marginBottom: 16,
              borderRadius: 8,
              padding: "12px 14px",
              border: "1.5px solid #cbd5e1",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              background: "#fff",
              boxSizing: "border-box",
              outline: "none",
              transition: "border 0.2s",
            }}
            placeholder="Describe tu proyecto aquí de la forma mas completamente posible..."
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
          />
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !projectDescription.trim()}
            style={{
              background: "linear-gradient(90deg, #6366f1 60%, #60a5fa 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 0",
              fontWeight: 600,
              fontSize: 16,
              cursor: isEvaluating || !projectDescription.trim() ? "not-allowed" : "pointer",
              marginBottom: 8,
              boxShadow: "0 2px 8px rgba(60, 60, 130, 0.07)",
              transition: "background 0.2s",
            }}
          >
            {isEvaluating ? "Evaluando..." : "Evaluar proyecto"}
          </button>
          {evaluationResult && (
            <div
              style={{
                marginTop: 20,
                background: "#f1f5f9",
                borderRadius: 8,
                padding: 18,
                border: "1px solid #cbd5e1",
                color: "#334155",
                fontSize: 15.5,
                lineHeight: 1.6,
                boxShadow: "0 1px 4px rgba(60, 60, 130, 0.04)",
              }}
            >
              <strong style={{ color: "#6366f1" }}>Resultado:</strong>
              <div style={{ marginTop: 8, whiteSpace: "pre-line" }}>{evaluationResult}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-blue-100">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Consulta Personalizada</h3>
              <p className="text-sm text-gray-600 mb-4">
                Habla con nuestro consultor IA para obtener ayuda específica con tus recomendaciones
              </p>
              <Link href="/project_chat">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Iniciar Consulta</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Descargar Reporte</h3>
              <p className="text-sm text-gray-600 mb-4">
                Obtén un reporte PDF detallado con todas las recomendaciones y pasos a seguir
              </p>
              <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50">
                Descargar PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl">Próximos Pasos Recomendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span>Implementar encriptación AES-256 en tu base de datos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Actualizar políticas de privacidad según la nueva ley</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Configurar autenticación de dos factores</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span>Realizar nueva evaluación en 30 días</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
