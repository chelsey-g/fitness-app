import Link from "next/link"
import { CgArrowRight } from "react-icons/cg"

interface LandingPageProps {
  isBackendConnected: boolean
}

const features = [
  {
    title: "Workout Logging",
    description:
      "Track your workouts with custom names, dates, and optional notes to stay consistent and accountable.",
    icon: "🏋️‍♀️",
  },
  {
    title: "Weight Tracking",
    description:
      "Log weight entries over time and view trends with visual progress charts to stay motivated.",
    icon: "📉",
  },
  {
    title: "Progress Visualization",
    description:
      "Filter weight data by custom date ranges to track long-term trends and short-term changes.",
    icon: "📊",
  },
  {
    title: "Team Dashboard",
    description:
      "Join or create a team to compete or collaborate with others and make progress together.",
    icon: "🫂",
  },
  {
    title: "Team Memory",
    description:
      "HabitKick remembers your last active team and brings you back automatically after login.",
    icon: "🧠",
  },
  {
    title: "Authentication",
    description:
      "Secure sign-up and login with Supabase, with persistent sessions to keep you logged in.",
    icon: "🔐",
  },
  {
    title: "Dark Mode",
    description:
      "A slick, easy-on-the-eyes dark theme for night owls and vibey log sessions.",
    icon: "🌒",
  },
  {
    title: "Mobile-First Design",
    description:
      "Fully responsive layout that works beautifully on both mobile and desktop screens.",
    icon: "📱",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    content: "HabitKick transformed my workout routine. The team feature keeps me motivated!",
    avatar: "👩‍💼"
  },
  {
    name: "Mike Chen",
    role: "Personal Trainer",
    content: "Perfect for tracking client progress. The visualization tools are incredible.",
    avatar: "👨‍🏫"
  },
  {
    name: "Emma Davis",
    role: "Busy Professional",
    content: "Finally, a fitness app that actually helps me stay consistent with my goals.",
    avatar: "👩‍💻"
  }
];

export default function LandingPage({ isBackendConnected }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Kickstart your habits with{" "}
                  <span className="text-logo-green">HabitKick</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                  Your ultimate companion for building lasting fitness habits. Track workouts, 
                  monitor progress, and achieve your goals with friends by your side.
                </p>
              </div>
              
              {!isBackendConnected && (
                <div className="bg-yellow-500/20 text-yellow-500 p-4 rounded-lg border border-yellow-500/30">
                  ⚠️ We're currently experiencing connection issues. Please try again later.
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    isBackendConnected 
                      ? "bg-logo-green text-black hover:bg-logo-green/90 hover:scale-105 shadow-lg hover:shadow-xl" 
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  href={isBackendConnected ? "/signup" : "#"}
                >
                  Start Your Journey
                </Link>
                <Link
                  className={`flex items-center px-8 py-4 rounded-lg border-2 font-semibold text-lg transition-all duration-200 ${
                    isBackendConnected 
                      ? "border-logo-green text-logo-green hover:bg-logo-green hover:text-black hover:scale-105" 
                      : "border-gray-400 text-gray-400 cursor-not-allowed"
                  }`}
                  href={isBackendConnected ? "#features" : "#"}
                >
                  Learn More <CgArrowRight className="ml-2 text-xl" />
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-logo-green">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-logo-green">50K+</div>
                  <div className="text-sm text-gray-400">Workouts Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-logo-green">95%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-logo-green/20 to-snd-bkg/20 rounded-3xl blur-3xl animate-pulse"></div>
              
              {/* Modern geometric fitness visualization */}
              <div className="relative z-10 w-80 h-80 flex items-center justify-center">
                {/* Main circular progress ring */}
                <div className="absolute w-72 h-72 rounded-full border-4 border-logo-green/30 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-logo-green rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Secondary ring */}
                <div className="absolute w-56 h-56 rounded-full border-2 border-snd-bkg/40 animate-reverse-spin">
                  <div className="absolute top-1/4 right-0 w-2 h-2 bg-snd-bkg rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Center progress badge */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-logo-green/30 to-snd-bkg/30 rounded-full backdrop-blur-sm border-4 border-logo-green/40 animate-float flex items-center justify-center">
                  {/* Progress ring inside badge */}
                  <div className="absolute inset-2 rounded-full border-2 border-logo-green/60" 
                       style={{
                         background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 252deg, transparent 252deg)`
                       }}>
                  </div>
                  {/* Checkmark icon */}
                  <div className="relative z-10 w-12 h-12 bg-logo-green rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Achievement sparkles */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-logo-green rounded-full animate-pulse"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-8 left-8 w-4 h-4 bg-logo-green/60 rounded-full animate-pulse"></div>
                <div className="absolute bottom-12 right-12 w-6 h-6 bg-snd-bkg/60 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 right-8 w-3 h-3 bg-logo-green/80 transform rotate-45 animate-ping"></div>
              </div>
              
              <div className="absolute top-10 right-10 w-20 h-20 bg-logo-green/40 rounded-full blur-xl animate-float"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-snd-bkg/40 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to <span className="text-logo-green">succeed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you build lasting habits and achieve your fitness goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-logo-green/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by <span className="text-logo-green">thousands</span>
            </h2>
            <p className="text-xl text-gray-400">
              See what our community has to say about their transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 p-8 rounded-xl border border-gray-700/30 hover:border-logo-green/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-logo-green/10 to-snd-bkg/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your fitness journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already kickstarted their habits. 
            Your future self will thank you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className={`px-10 py-5 rounded-lg font-bold text-xl transition-all duration-200 ${
                isBackendConnected 
                  ? "bg-logo-green text-black hover:bg-logo-green/90 hover:scale-105 shadow-xl" 
                  : "bg-gray-400 cursor-not-allowed text-gray-600"
              }`}
              href={isBackendConnected ? "/signup" : "#"}
            >
              Get Started Free
            </Link>
            <Link
              className={`px-10 py-5 rounded-lg border-2 font-bold text-xl transition-all duration-200 ${
                isBackendConnected 
                  ? "border-logo-green text-logo-green hover:bg-logo-green hover:text-black hover:scale-105" 
                  : "border-gray-400 text-gray-400 cursor-not-allowed"
              }`}
              href={isBackendConnected ? "/login" : "#"}
            >
              Sign In
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
