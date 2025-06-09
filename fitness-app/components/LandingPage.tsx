import Link from "next/link"
import { CgArrowRight } from "react-icons/cg"

interface LandingPageProps {
  isBackendConnected: boolean
}

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

      {/* Goals Showcase Section */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-logo-green/20 text-logo-green rounded-full text-sm font-medium">
                🎯 Goal Tracking
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Set goals that <span className="text-logo-green">actually stick</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Transform your fitness journey with smart goal setting. Track your progress, 
                stay motivated with visual feedback, and celebrate every milestone along the way.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Smart Progress Tracking</h3>
                    <p className="text-gray-400">See exactly how much weight you need to lose and days remaining to reach your goal.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Personalized Targets</h3>
                    <p className="text-gray-400">Set custom weight goals with realistic timelines that work for your lifestyle.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Stay Motivated</h3>
                    <p className="text-gray-400">Visual progress indicators and milestone celebrations keep you engaged and motivated.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isBackendConnected 
                      ? "bg-logo-green text-black hover:bg-logo-green/90 hover:scale-105 shadow-lg" 
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  href={isBackendConnected ? "/goals" : "#"}
                >
                  Try Goal Tracking
                  <CgArrowRight className="ml-2 text-lg" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Layered Device Composition for Goals */}
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-logo-green/20 via-snd-bkg/10 to-logo-green/30 rounded-3xl"></div>
                
                {/* Desktop Monitor - Background Layer */}
                <div className="absolute right-0 top-8 transform rotate-12 scale-75 z-10">
                  <div className="relative" style={{ width: '320px', height: '200px' }}>
                    {/* Monitor Frame */}
                    <div className="absolute inset-0 bg-gray-800 rounded-t-xl shadow-2xl">
                      {/* Monitor Bezel */}
                      <div className="absolute inset-1 bg-black rounded-t-lg">
                        {/* Monitor Screen */}
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-t-lg p-3 overflow-hidden">
                          <div className="h-full">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Goals Dashboard</h3>
                              <div className="w-4 h-4 bg-logo-green rounded-md"></div>
                            </div>
                            
                            {/* Desktop Goals Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                <div className="text-xs font-bold text-gray-900 dark:text-white">165 lbs</div>
                                <div className="text-xs text-gray-500">Target Weight</div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                <div className="text-xs font-bold text-logo-green">42 days</div>
                                <div className="text-xs text-gray-500">Remaining</div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                              <div className="bg-logo-green h-1.5 rounded-full" style={{width: '73%'}}></div>
                            </div>
                            <div className="text-xs text-gray-500">73% Complete</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Monitor Stand */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-4 bg-gray-700 rounded-b-lg"></div>
                      <div className="w-16 h-1.5 bg-gray-600 rounded-full mt-1 -ml-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* iPhone - Foreground Layer */}
                <div className="relative z-20 transform -rotate-6 scale-110">
                  <div className="relative mx-auto" style={{ width: '240px', height: '480px' }}>
                    {/* iPhone Frame */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] p-1.5 shadow-2xl">
                      <div className="w-full h-full bg-gray-900 rounded-[2rem] relative overflow-hidden">
                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>
                        
                        {/* iPhone Screen - Real Goals Mobile Layout */}
                        <div className="w-full h-full bg-white rounded-[2rem] p-3 pt-6 overflow-hidden">
                          <div className="h-full">
                            {/* Header with Add Goal Button */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Active Goals</h2>
                                <p className="text-xs text-gray-600">Track your progress and stay focused</p>
                              </div>
                              <button className="px-2 py-1 bg-logo-green text-black text-xs font-medium rounded-lg shadow-sm">
                                Goal
                              </button>
                            </div>
                            
                            {/* Mobile Goal Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">165</h3>
                                    <span className="text-xs font-medium text-gray-500">lbs</span>
                                  </div>
                                  <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-logo-green rounded-full"></span>
                                    Target: Dec 31, 2024
                                  </p>
                                </div>
                                <button className="p-1">
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                  <div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Days Left</span>
                                    <div className="text-sm font-bold text-gray-900 mt-0.5">42</div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weight Remaining</span>
                                    <div className="text-sm font-bold text-gray-900 mt-0.5 flex items-baseline gap-1">
                                      <span>8</span>
                                      <span className="text-xs text-gray-500">lbs</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Add New Goal Button */}
                            <div className="mt-4">
                              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-medium hover:border-logo-green hover:text-logo-green transition-colors">
                                + Add New Goal
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* iPhone Home Indicator */}
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full opacity-60"></div>
                  </div>
                </div>
                
                {/* Floating Accent Elements */}
                <div className="absolute top-4 left-8 w-6 h-6 bg-logo-green/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 right-12 w-4 h-4 bg-snd-bkg/40 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 left-4 w-2 h-2 bg-logo-green/60 transform rotate-45 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Tracking Showcase Section */}
      <section className="py-20 px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Layered Device Composition for Weight Tracking */}
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-snd-bkg/20 via-logo-green/10 to-snd-bkg/30 rounded-3xl"></div>
                
                {/* iPhone - Foreground Layer */}
                <div className="relative z-20 transform rotate-6 scale-110">
                  <div className="relative mx-auto" style={{ width: '240px', height: '480px' }}>
                    {/* iPhone Frame */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] p-1.5 shadow-2xl">
                      <div className="w-full h-full bg-gray-900 rounded-[2rem] relative overflow-hidden">
                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>
                        
                        {/* iPhone Screen */}
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2rem] p-3 pt-6 overflow-hidden">
                          <div className="h-full">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weight Log</h3>
                              <div className="w-6 h-6 bg-logo-green rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Current Weight Display */}
                            <div className="bg-gradient-to-r from-logo-green/20 to-snd-bkg/20 rounded-xl p-3 mb-3">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">173.2</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Current Weight (lbs)</div>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                  </svg>
                                  <span className="text-xs text-red-500 font-medium">-2.3 lbs</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">28</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Days Tracked</div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center">
                                <div className="text-sm font-bold text-logo-green">-12.4</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total Lost</div>
                              </div>
                            </div>
                            
                            {/* Log Weight Button */}
                            <button className="w-full py-2 bg-logo-green text-black font-semibold rounded-lg text-xs">
                              Log Today's Weight
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* iPhone Home Indicator */}
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full opacity-60"></div>
                  </div>
                </div>
                
                {/* Desktop Monitor - Background Layer */}
                <div className="absolute left-0 top-8 transform -rotate-12 scale-75 z-10">
                  <div className="relative" style={{ width: '320px', height: '200px' }}>
                    {/* Monitor Frame */}
                    <div className="absolute inset-0 bg-gray-800 rounded-t-xl shadow-2xl">
                      {/* Monitor Bezel */}
                      <div className="absolute inset-1 bg-black rounded-t-lg">
                        {/* Monitor Screen */}
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-t-lg p-3 overflow-hidden">
                          <div className="h-full">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weight Chart</h3>
                              <div className="w-4 h-4 bg-logo-green rounded-md"></div>
                            </div>
                            
                            {/* Mini Chart */}
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last 30 Days</div>
                              <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-between px-1 py-1">
                                {[78, 82, 75, 88, 85, 79, 92, 87, 83, 76, 81, 74, 69, 72].map((height, index) => (
                                  <div
                                    key={index}
                                    className="bg-logo-green rounded-sm w-1 transition-all"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500">Trend: ↓ 5.8 lbs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Monitor Stand */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-4 bg-gray-700 rounded-b-lg"></div>
                      <div className="w-16 h-1.5 bg-gray-600 rounded-full mt-1 -ml-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Accent Elements */}
                <div className="absolute top-4 right-8 w-6 h-6 bg-snd-bkg/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-12 w-4 h-4 bg-logo-green/40 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 right-4 w-2 h-2 bg-snd-bkg/60 transform rotate-45 animate-ping"></div>
              </div>
            </div>
            
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 bg-logo-green/20 text-logo-green rounded-full text-sm font-medium">
                📉 Weight Tracking
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Track your progress with <span className="text-logo-green">precision</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Monitor your weight journey with detailed charts, trends, and insights. 
                See your progress over time and stay motivated with visual feedback.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Visual Progress Charts</h3>
                    <p className="text-gray-400">Beautiful charts that show your weight trends over custom date ranges.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Quick Daily Logging</h3>
                    <p className="text-gray-400">Log your weight in seconds with our streamlined interface.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Trend Analysis</h3>
                    <p className="text-gray-400">Get insights into your progress with weekly and monthly trend analysis.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isBackendConnected 
                      ? "bg-logo-green text-black hover:bg-logo-green/90 hover:scale-105 shadow-lg" 
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  href={isBackendConnected ? "/tracker" : "#"}
                >
                  Start Tracking Weight
                  <CgArrowRight className="ml-2 text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 75 Day Challenge Showcase Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-logo-green/20 text-logo-green rounded-full text-sm font-medium">
                🏆 75 Day Challenge
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Transform your life in <span className="text-logo-green">75 days</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Take on the ultimate fitness challenge. Build lasting habits with daily check-ins, 
                progress tracking, and a supportive community to keep you accountable.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Daily Progress Grid</h3>
                    <p className="text-gray-400">Visual 75-day grid showing your daily completions and streaks.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Custom Challenge Rules</h3>
                    <p className="text-gray-400">Set your own rules and track completion with real-time status updates.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-logo-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Challenge Tiers</h3>
                    <p className="text-gray-400">Choose from Soft, Medium, or Hard difficulty levels to match your commitment.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isBackendConnected 
                      ? "bg-logo-green text-black hover:bg-logo-green/90 hover:scale-105 shadow-lg" 
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  href={isBackendConnected ? "/challenges" : "#"}
                >
                  Start 75 Day Challenge
                  <CgArrowRight className="ml-2 text-lg" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Layered Device Composition for 75 Day Challenge */}
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-yellow-500/10 to-orange-600/30 rounded-3xl"></div>
                
                {/* Desktop Monitor - Background Layer */}
                <div className="absolute right-0 top-8 transform rotate-12 scale-75 z-10">
                  <div className="relative" style={{ width: '320px', height: '200px' }}>
                    {/* Monitor Frame */}
                    <div className="absolute inset-0 bg-gray-800 rounded-t-xl shadow-2xl">
                      {/* Monitor Bezel */}
                      <div className="absolute inset-1 bg-black rounded-t-lg">
                        {/* Monitor Screen */}
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-t-lg p-3 overflow-hidden">
                          <div className="h-full">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Challenge Stats</h3>
                              <div className="w-4 h-4 bg-orange-500 rounded-md"></div>
                            </div>
                            
                            {/* Desktop Challenge Overview */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                <div className="text-xs font-bold text-gray-900 dark:text-white">Day 23</div>
                                <div className="text-xs text-gray-500">of 75</div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                <div className="text-xs font-bold text-orange-500">31%</div>
                                <div className="text-xs text-gray-500">Complete</div>
                              </div>
                            </div>
                            
                            {/* Mini Progress Grid */}
                            <div className="grid grid-cols-10 gap-0.5 mb-2">
                              {Array.from({ length: 30 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-sm ${
                                    i < 23 ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'
                                  }`}
                                ></div>
                              ))}
                            </div>
                            
                            <div className="text-xs text-gray-500">52 days remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Monitor Stand */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-4 bg-gray-700 rounded-b-lg"></div>
                      <div className="w-16 h-1.5 bg-gray-600 rounded-full mt-1 -ml-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* iPhone - Foreground Layer */}
                <div className="relative z-20 transform -rotate-6 scale-110">
                  <div className="relative mx-auto" style={{ width: '240px', height: '480px' }}>
                    {/* iPhone Frame */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] p-1.5 shadow-2xl">
                      <div className="w-full h-full bg-gray-900 rounded-[2rem] relative overflow-hidden">
                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>
                        
                        {/* iPhone Screen - Real 75 Day Challenge Dashboard */}
                        <div className="w-full h-full bg-white rounded-[2rem] p-3 pt-6 overflow-hidden">
                          <div className="h-full">
                            {/* Dashboard Header */}
                            <div className="mb-4">
                              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">75 Day Challenge</h2>
                              <p className="text-sm text-gray-600">Transform your habits</p>
                            </div>
                            
                            {/* 75 Day Challenge Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-900">75 Day Challenge</h3>
                                <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                </svg>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">Day 23</div>
                                  <p className="text-xs text-gray-500">of 75 - Medium Challenge</p>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{width: '31%'}}></div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <button className="flex-1 text-center px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg shadow-md">
                                    Today's Tasks
                                  </button>
                                  <button className="flex-1 text-center px-3 py-2 border border-orange-500 bg-orange-500 text-white text-xs font-semibold rounded-lg">
                                    View Progress
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Other Dashboard Cards Preview */}
                            <div className="mt-4 space-y-3">
                              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-600">Active Goals</span>
                                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <div className="text-sm font-bold text-logo-green mt-1">8 lbs to go</div>
                              </div>
                              
                              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-600">Progress Tracker</span>
                                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">28 days tracked</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* iPhone Home Indicator */}
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full opacity-60"></div>
                  </div>
                </div>
                
                {/* Floating Accent Elements */}
                <div className="absolute top-4 left-8 w-6 h-6 bg-orange-500/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 right-12 w-4 h-4 bg-yellow-500/40 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 left-4 w-2 h-2 bg-orange-600/60 transform rotate-45 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-900/30 to-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-logo-green/20 text-logo-green rounded-full text-sm font-medium mb-4">
              ⭐ Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by <span className="text-logo-green">thousands</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our community has to say about their transformation journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-6 lg:p-8 rounded-2xl border border-gray-700/30 hover:border-logo-green/40 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm shadow-xl hover:shadow-2xl ${
                  index === 2 ? 'md:col-span-2 xl:col-span-1 md:max-w-md md:mx-auto xl:max-w-none xl:mx-0' : ''
                }`}
              >
                {/* Floating gradient orb */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-logo-green/20 to-snd-bkg/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-400 font-medium">5.0</span>
                </div>
                
                {/* Quote */}
                <div className="relative mb-6">
                  <svg className="absolute -top-2 -left-2 w-6 h-6 lg:w-8 lg:h-8 text-logo-green/30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
                  </svg>
                  <p className="text-gray-300 italic text-base lg:text-lg leading-relaxed pl-4 lg:pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-logo-green/30 to-snd-bkg/30 rounded-full flex items-center justify-center text-xl lg:text-2xl mr-3 lg:mr-4 border-2 border-logo-green/20">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-base lg:text-lg">{testimonial.name}</div>
                    <div className="text-sm text-logo-green font-medium">{testimonial.role}</div>
                  </div>
                </div>
                
                {/* Verified badge */}
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 flex items-center gap-1 px-2 py-1 bg-logo-green/20 text-logo-green rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">Join thousands of satisfied users</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="flex items-center">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">4.9/5 from 2,847 reviews</span>
            </div>
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
