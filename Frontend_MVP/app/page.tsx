import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Code, Users, BookOpen, MessageCircle, CheckCircle, ArrowRight, Zap, Target, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/images/aracnidata-logo.png" alt="AracniData Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-2xl font-bold text-white">AracniData</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
              Características
            </Link>
            <Link href="#solutions" className="text-gray-300 hover:text-blue-400 transition-colors">
              Soluciones
            </Link>
            <Link href="/quiz" className="text-gray-300 hover:text-blue-400 transition-colors">
              Evaluación
            </Link>
          </nav>
          <Link href="/chat">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Consultar Ahora
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Adaptate al Marco Legal de la
            <span className="text-blue-600"> Ley 21.719</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Te ayudamos a implementar medidas de ciberseguridad claras y prácticas para cumplir con el nuevo marco
            legal, adaptándose a cada contexto específico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                Consultor IA Gratuito
              </Button>
            </Link>
            <Link href="#examples">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-blue-200 hover:bg-blue-50">
                Ver Ejemplos Prácticos
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solución Integral para Cumplimiento Legal</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reducimos la carga de investigación y trabajo proporcionando medidas claras adaptadas a tu contexto
              específico de desarrollo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Code className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Ejemplos Prácticos de Código</CardTitle>
                <CardDescription>
                  Implementaciones reales y buenas prácticas de ciberseguridad adaptadas a diferentes tipos de
                  aplicaciones y datos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Asesoría Contextual</CardTitle>
                <CardDescription>
                  Recomendaciones específicas según el tipo de datos que manejes: desde contactos básicos hasta datos
                  biométricos en tiempo real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Mejora de Software Existente</CardTitle>
                <CardDescription>
                  No solo para nuevos desarrollos. Te ayudamos a actualizar sistemas existentes para cumplir el nuevo
                  marco legal.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section id="solutions" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Diseñado para Ti</h2>
            <p className="text-xl text-gray-600">Soluciones específicas para cada perfil profesional</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-blue-100 hover:shadow-xl transition-all">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Desarrolladores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Implementación práctica de medidas de seguridad</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Código de ejemplo para diferentes contextos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Auditoría y mejora de sistemas existentes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Guías de cumplimiento por tipo de aplicación</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100 hover:shadow-xl transition-all">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Estudiantes TIC</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Fundamentos de ciberseguridad legal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Casos de estudio reales y actuales</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Preparación para el mercado laboral</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Recursos educativos interactivos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contextos Específicos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada tipo de aplicación requiere medidas diferentes. Te mostramos exactamente qué implementar según tu
              caso específico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">App de Contactos</CardTitle>
                <CardDescription>Almacena solo datos personales básicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    Encriptación básica
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Consentimiento simple
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Backup seguro
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">App Financiera</CardTitle>
                <CardDescription>Maneja datos financieros sensibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    Encriptación avanzada
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    2FA obligatorio
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Auditoría completa
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">App Biométrica</CardTitle>
                <CardDescription>Procesa datos biométricos en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    Encriptación militar
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Consentimiento explícito
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Procesamiento local
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <Globe className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Comienza a Cumplir el Marco Legal Hoy</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            No esperes a que sea demasiado tarde. Nuestro consultor IA te guiará paso a paso para implementar las
            medidas necesarias en tu proyecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" variant="secondary" className="text-blue-700 hover:text-blue-800">
                <MessageCircle className="h-5 w-5 mr-2" />
                Iniciar Consulta
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-800 border-2 border-white"
              >
                <Shield className="h-5 w-5 mr-2" />
                Evaluar mi Proyecto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/images/aracnidata-logo.png"
                alt="AracniData Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xl font-bold">AracniData</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 AracniData. Simplificando el cumplimiento legal en desarrollo de software.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
