import { Link } from 'react-router'
import { ArrowRight, BarChart, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { FeatureCard } from './feature-card'
import { TestimonialCard } from './testimonial-card'
import { useToken } from '@/store/use-token'

export default function HomePage() {
  const { data: user } = useUser()
  useToken()

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Connect, Collaborate, Create with{' '}
                <span className="text-primary">SkillSync</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The platform where talented freelancers and ambitious clients
                come together to bring ideas to life.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {user ? (
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/register">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <FeatureCard
              title="For Clients"
              description="Post projects, find talented freelancers, and get your work done efficiently."
              icon={<Users className="h-10 w-10 text-primary" />}
              features={[
                'Post detailed project requirements',
                'Review and select qualified freelancers',
                'Track project progress with milestones',
                'Secure payment system'
              ]}
            />
            <FeatureCard
              title="For Freelancers"
              description="Find projects that match your skills, submit proposals, and grow your portfolio."
              icon={<BarChart className="h-10 w-10 text-primary" />}
              features={[
                'Browse projects in your expertise',
                'Submit competitive proposals',
                'Showcase your skills and experience',
                'Get paid securely and on time'
              ]}
            />
            <FeatureCard
              title="Platform Benefits"
              description="Our secure platform ensures smooth collaboration and successful project completion."
              icon={<Shield className="h-10 w-10 text-primary" />}
              features={[
                'Real-time messaging system',
                'Milestone and payment tracking',
                'File sharing and collaboration',
                'Dispute resolution support'
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simple Process, Exceptional Results
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our streamlined process makes it easy to connect, collaborate
                and complete projects.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up as a client or freelancer and complete your profile.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">
                {user?.role === 'client' ? 'Post Project' : 'Browse Projects'}
              </h3>
              <p className="text-muted-foreground">
                {user?.role === 'client'
                  ? 'Create detailed project listings with clear requirements.'
                  : 'Find projects matching your skills and submit proposals.'}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Collaborate & Complete</h3>
              <p className="text-muted-foreground">
                Work together through our platform and achieve great results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Success Stories
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                See what our users are saying about their experience with
                SkillSync.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <TestimonialCard
              quote="SkillSync made it easy to find talented developers for my startup. The quality of work was exceptional!"
              author="Sophia Chen"
              role="CEO, TechStart"
            />
            <TestimonialCard
              quote="As a freelancer, I've doubled my client base thanks to SkillSync's streamlined proposal system."
              author="Miguel Rodriguez"
              role="Full Stack Developer"
            />
            <TestimonialCard
              quote="The milestone tracking feature has revolutionized how we manage complex projects with remote teams."
              author="Alex Johnson"
              role="Project Manager"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] md:text-xl">
                Join thousands of freelancers and clients already using
                SkillSync to achieve their goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {user ? (
                <Button asChild size="lg" variant="secondary">
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/register">
                      Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12">
        <div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
