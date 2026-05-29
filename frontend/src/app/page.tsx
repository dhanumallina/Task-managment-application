import Link from 'next/link';
import { Sparkles, CheckSquare, BarChart3, Shield, Users, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      name: 'Intentional Clarity',
      description: 'Clean layouts inspired by Apple & Notion design principles to help you focus on what really matters.',
      icon: CheckSquare,
    },
    {
      name: 'Dynamic Analytics',
      description: 'Track task trends, completion rates, and daily streaks with beautiful real-time chart dashboards.',
      icon: BarChart3,
    },
    {
      name: 'Collaborative Workspaces',
      description: 'Instantly sync and share projects with team members with built-in real-time socket events.',
      icon: Users,
    },
    {
      name: 'SaaS Grade Security',
      description: 'JWT authorization, rate limiting, and encrypted sessions protect your workspace from day one.',
      icon: Shield,
    },
  ];

  const plans = [
    {
      name: 'Personal',
      price: 'Free',
      description: 'Ideal for solo developers and planners who want structured daily clarity.',
      features: ['Up to 50 active tasks', 'Basic task analytics', 'Subtasks and tags support', 'Personal calendar view'],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$12',
      period: '/mo',
      description: 'Perfect for startups and teams that need visual workflow boards.',
      features: [
        'Unlimited tasks & projects',
        'Advanced visual analytics',
        'Real-time socket task sync',
        'AI-powered smart alerts',
        'Prioritized support queue',
      ],
      cta: 'Try Pro 14-days',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] selection:bg-[#FEF3C7] selection:text-[#B45309]">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto flex items-center justify-between px-6 py-5 border-b border-[#D97706]/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D97706] text-white">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-lg text-[#92400E] tracking-tight">Lumio</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-semibold text-[#78716C]">
          <Link href="#features" className="hover:text-[#92400E] transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-[#92400E] transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-[#92400E] transition-colors">Sign in</Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] text-white hover:bg-[#B45309] shadow-warm-sm transition-all text-xs"
          >
            Start Free
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-[#D97706]/20 text-xs text-[#92400E] font-semibold mb-6 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Productivity Redefined — Introducing Lumio SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#92400E] leading-[1.1] mb-6 animate-fade-up delay-75">
          Bring order and <span className="gradient-amber-text">clarity</span> <br />
          to every task you capture.
        </h1>

        <p className="text-lg text-[#78716C] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-150">
          Lumio is a premium task manager that cleans the noise from project tracking. Enjoy minimal Apple-style aesthetic layouts, subtasks, kanban boards, and interactive progress graphs.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-up delay-225">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#D97706] text-white hover:bg-[#B45309] font-semibold shadow-warm-lg transition-all"
          >
            Create Your Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/80 border border-[#D97706]/15 hover:bg-[#FEF3C7] hover:border-[#D97706]/35 font-semibold text-[#92400E] shadow-warm-sm transition-all"
          >
            Live Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-[#D97706]/10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#92400E]">Designed for modern builders</h2>
          <p className="text-[#78716C] mt-2">Skip the complexity. Experience direct workspace tracking.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-[#D97706]/10 shadow-warm-sm flex flex-col hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border border-[#D97706]/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#D97706]" />
                </div>
                <h3 className="font-bold text-[#92400E] text-base mb-2">{feature.name}</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-[#D97706]/10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#92400E]">Simple, transparent plans</h2>
          <p className="text-[#78716C] mt-2">Get started free and upgrade whenever your team needs to scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl bg-white border shadow-warm-md flex flex-col relative transition-all ${
                plan.popular
                  ? 'border-[#D97706] scale-105 md:scale-105 shadow-amber-glow'
                  : 'border-[#D97706]/10'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-[#D97706] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
              
              <h3 className="text-xl font-bold text-[#92400E]">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-4 mb-2">
                <span className="text-4xl font-extrabold text-[#92400E]">{plan.price}</span>
                {plan.period && <span className="text-sm text-[#A8A29E] font-semibold">{plan.period}</span>}
              </div>
              <p className="text-sm text-[#78716C] mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-sm text-[#78716C]">
                    <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/register"
                className={`w-full py-2.5 rounded-lg font-semibold text-sm text-center transition-all ${
                  plan.popular
                    ? 'bg-[#D97706] text-white hover:bg-[#B45309] shadow-warm-sm'
                    : 'bg-[#FFF3B0] text-[#92400E] hover:bg-[#FEF08A]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-[#D97706]/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#D97706] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-[#92400E]">Lumio Workspace</span>
          </div>
          <span className="text-xs text-[#A8A29E]">© 2026 Lumio Inc. All rights reserved. Made for clarity.</span>
        </div>
      </footer>
    </div>
  );
}

