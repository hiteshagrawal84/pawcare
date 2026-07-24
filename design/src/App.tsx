import { useState, useEffect, useRef } from "react"

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const PawIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 15.5c-2 0-5.5-2.5-5.5-5 0-1.7 1.4-3 3-3 .8 0 1.6.3 2.2.8.2.2.5.3.8.3s.6-.1.8-.3c.6-.5 1.4-.8 2.2-.8 1.6 0 3 1.3 3 3 0 2.5-3.5 5-5.5 5zM4.5 8C3.1 8 2 6.9 2 5.5S3.1 3 4.5 3 7 4.1 7 5.5 5.9 8 4.5 8zm3-4C6.1 4 5 2.9 5 1.5S6.1-1 7.5-1 10 0.1 10 1.5 8.9 4 7.5 4zm9 0C15.1 4 14 2.9 14 1.5S15.1-1 16.5-1 19 0.1 19 1.5 17.9 4 16.5 4zm3 4C18.1 8 17 6.9 17 5.5S18.1 3 19.5 3 22 4.1 22 5.5 20.9 8 19.5 8z"/>
  </svg>
)

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9F43">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5CB85C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const services = [
  { icon: "🏥", title: "Veterinary Care", desc: "Comprehensive health checkups, diagnostics, and expert treatments for all pets.", color: "#e8f5e9" },
  { icon: "✂️", title: "Pet Grooming", desc: "Full-service grooming including baths, haircuts, nail trimming, and styling.", color: "#fff3e0" },
  { icon: "🎓", title: "Pet Training", desc: "Positive reinforcement training for obedience, behavior, and advanced skills.", color: "#e3f2fd" },
  { icon: "🏠", title: "Pet Boarding", desc: "Safe, comfortable boarding with 24/7 supervision and loving care.", color: "#fce4ec" },
  { icon: "🥗", title: "Pet Nutrition", desc: "Personalized dietary plans and premium nutrition advice from specialists.", color: "#f3e5f5" },
  { icon: "🚑", title: "Emergency Care", desc: "Round-the-clock emergency veterinary services with rapid response teams.", color: "#e8f5e9" },
]

const features = [
  "Certified & licensed veterinarians with 10+ years experience",
  "State-of-the-art medical equipment and diagnostics",
  "Personalized treatment plans for every pet",
  "Transparent, affordable pricing with no hidden fees",
  "24/7 emergency support and helpline",
]

const vets = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Veterinary Surgeon",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
    exp: "12 yrs exp.",
  },
  {
    name: "Dr. James Thornton",
    role: "Pet Nutrition Expert",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format",
    exp: "9 yrs exp.",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Animal Care Specialist",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format",
    exp: "15 yrs exp.",
  },
  {
    name: "Dr. Michael Lee",
    role: "Exotic Animal Vet",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format",
    exp: "11 yrs exp.",
  },
]

const testimonials = [
  {
    name: "Emma Rodriguez",
    pet: "Golden Retriever owner",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    text: "My dog Max received absolutely exceptional care here. The doctors truly understand animals — Max was relaxed the entire visit. PawCare is the only place we trust.",
    rating: 5,
  },
  {
    name: "David Chen",
    pet: "Persian Cat owner",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    text: "Brought my cat Luna in for emergency care at 2am. The team was incredible — calm, professional, and incredibly compassionate. She's back to her playful self!",
    rating: 5,
  },
  {
    name: "Sophie Williams",
    pet: "Labrador owner",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
    text: "The grooming service is outstanding! Bella always comes home looking like she just walked off a photo shoot. The staff genuinely loves animals — it shows.",
    rating: 5,
  },
]

const blogs = [
  {
    tag: "Pet Health",
    title: "10 Signs Your Dog Needs a Vet Visit Right Away",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop&auto=format",
    date: "Jul 15, 2025",
  },
  {
    tag: "Training Guide",
    title: "Positive Reinforcement: The Science Behind Happier Dogs",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&auto=format",
    date: "Jul 8, 2025",
  },
  {
    tag: "Cat Nutrition",
    title: "What Your Cat Is Actually Telling You About Their Diet",
    img: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&h=400&fit=crop&auto=format",
    date: "Jun 29, 2025",
  },
]

const products = [
  { name: "Premium Dog Food", price: "$34.99", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop&auto=format", tag: "Best Seller" },
  { name: "Cat Wellness Blend", price: "$28.99", img: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=300&h=300&fit=crop&auto=format", tag: "New" },
  { name: "Interactive Pet Toys", price: "$19.99", img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop&auto=format", tag: null },
  { name: "Pro Grooming Kit", price: "$44.99", img: "https://images.unsplash.com/photo-1581888227599-779811939961?w=300&h=300&fit=crop&auto=format", tag: "Sale" },
]

const adoptions = [
  { name: "Buddy", type: "Golden Retriever", age: "2 years", img: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=400&fit=crop&auto=format" },
  { name: "Mochi", type: "Tabby Cat", age: "1 year", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&auto=format" },
  { name: "Snowball", type: "White Rabbit", age: "6 months", img: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop&auto=format" },
]

// ─── Counter Hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ─── Stats Component ──────────────────────────────────────────────────────────
function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const count = useCountUp(target, 2000, started)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="stat-card rounded-2xl p-6 text-center">
      <div className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-jakarta)", color: "#5CB85C" }}>
        {count}{suffix}
      </div>
      <div className="text-sm font-medium" style={{ color: "#636e72" }}>{label}</div>
    </div>
  )
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div className="text-white text-sm py-2 px-4" style={{ background: "linear-gradient(90deg, #5CB85C, #4a9e4a)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>🐾</span>
          <span className="font-medium">Professional Pet Care Services | Book Your Appointment Today</span>
        </div>
        <div className="flex items-center gap-4 text-white/90">
          <a href="tel:+18005729273" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneIcon /><span>+1 800 572 9273</span>
          </a>
          <a href="mailto:hello@pawcare.vet" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MailIcon /><span>hello@pawcare.vet</span>
          </a>
          <div className="flex items-center gap-2">
            {["f", "ig", "tw"].map((s) => (
              <a key={s} href="#" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30 transition-colors font-bold">{s[0].toUpperCase()}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = ["Home", "About Us", "Services", "Doctors", "Shop", "Adoption", "Blog", "Contact"]

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "white",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.08)" : "0 1px 0 #f0f0f0",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
            🐾
          </div>
          <span className="text-xl font-extrabold" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Paw<span style={{ color: "#5CB85C" }}>Care</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a key={l} href="#" className="text-sm font-medium transition-colors hover:text-[#5CB85C]" style={{ color: "#2D3436" }}>
              {l}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#636e72" }}>
            <UserIcon />
          </button>
          <button className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors relative" style={{ color: "#636e72" }}>
            <CartIcon />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: "#FF9F43" }}>3</span>
          </button>
          <a href="#book" className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
            Book Appointment
          </a>
          <button className="lg:hidden" onClick={() => setOpen(!open)} style={{ color: "#2D3436" }}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l} href="#" className="text-sm font-medium py-2 border-b border-gray-50" style={{ color: "#2D3436" }} onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <a href="#book" className="mt-2 text-center py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
            Book Appointment
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #f0fdf0 100%)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #5CB85C, transparent)" }} />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #FF9F43, transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            <span>🐾</span> Trusted by 5,000+ Pet Families
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Healthy Pets,<br />
            <span className="gradient-text">Happy Families</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#636e72", maxWidth: "480px" }}>
            Complete veterinary care, grooming, training and wellness services for your beloved pets — delivered with genuine love and expertise.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="#book" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
              Book Appointment <ArrowRightIcon />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 hover:-translate-y-0.5 transition-all" style={{ color: "#5CB85C", borderColor: "#5CB85C", background: "white" }}>
              Explore Services
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-4">
            {[
              { n: "10+", l: "Years Experience" },
              { n: "5K+", l: "Happy Pets" },
              { n: "24/7", l: "Support" },
            ].map((b) => (
              <div key={b.l} className="flex items-center gap-2">
                <span className="text-2xl font-extrabold" style={{ color: "#5CB85C", fontFamily: "var(--font-jakarta)" }}>{b.n}</span>
                <span className="text-xs leading-tight" style={{ color: "#636e72" }}>{b.l.split(" ").join("\n")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image composition */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/5", background: "#e8f5e9" }}>
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=750&fit=crop&auto=format"
                alt="Happy golden retriever at PawCare clinic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(45,52,54,0.2))" }} />
            </div>

            {/* Secondary image */}
            <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white" style={{ background: "#fff3e0" }}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&auto=format"
                alt="Veterinarian with pet"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badges */}
            <div className="float-badge absolute -top-4 -left-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="text-sm font-bold" style={{ color: "#2D3436" }}>4.9/5 Rating</div>
                <div className="text-xs" style={{ color: "#636e72" }}>1,200+ reviews</div>
              </div>
            </div>

            <div className="float-badge-2 absolute top-1/3 -right-8 bg-white rounded-2xl shadow-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#5CB85C20" }}>🏥</div>
                <div>
                  <div className="text-xs font-bold" style={{ color: "#2D3436" }}>Next Available</div>
                  <div className="text-xs" style={{ color: "#5CB85C", fontWeight: 600 }}>Today 2:00 PM</div>
                </div>
              </div>
            </div>

            <div className="float-badge-3 absolute bottom-16 -right-6 bg-white rounded-2xl shadow-lg px-3 py-2">
              <div className="flex -space-x-2 mb-1">
                {["photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d", "photo-1438761681033-6461ffad8d80"].map((id) => (
                  <img key={id} src={`https://images.unsplash.com/${id}?w=50&h=50&fit=crop&auto=format`} className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="Pet owner" />
                ))}
              </div>
              <div className="text-xs font-semibold" style={{ color: "#2D3436" }}>+5K Happy Owners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" className="py-20" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            What We Offer
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Our Pet Care Services
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#636e72" }}>
            Everything your pet needs, under one roof — from routine checkups to emergency care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="service-card card-hover rounded-2xl p-7 cursor-pointer border border-transparent hover:border-[#5CB85C30] transition-all" style={{ background: s.color }}>
              <div className="service-icon text-4xl mb-5 inline-block">{s.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#636e72" }}>{s.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#5CB85C" }}>
                Learn More <ArrowRightIcon />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  return (
    <section className="py-20" style={{ background: "#FFF7ED" }}>
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "#e8f5e9", aspectRatio: "4/5" }}>
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=700&h=875&fit=crop&auto=format"
              alt="Veterinarian examining a dog with care"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "#5CB85C20" }}>🏆</div>
            <div>
              <div className="font-bold text-lg" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>Award Winning</div>
              <div className="text-sm" style={{ color: "#636e72" }}>Best Pet Clinic 2024</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#FF9F4320", color: "#FF9F43" }}>
            Why PawCare
          </div>
          <h2 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Trusted Care For Your<br /><span className="gradient-text">Furry Friends</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#636e72" }}>
            We believe every pet deserves exceptional healthcare. Our team of certified specialists combines medical excellence with genuine compassion.
          </p>
          <div className="space-y-4">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm">
                <div className="mt-0.5 flex-shrink-0">
                  <CheckIcon />
                </div>
                <span className="text-sm font-medium" style={{ color: "#2D3436" }}>{f}</span>
              </div>
            ))}
          </div>
          <a href="#book" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ background: "linear-gradient(135deg, #FF9F43, #e8892e)" }}>
            Get Started Today <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── About / Stats ────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="py-20" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
              About PawCare
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
              More than healthcare,<br />
              <span className="gradient-text">we create lifelong bonds.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "#636e72" }}>
              Founded in 2014, PawCare has grown from a single-room clinic to a full-service pet wellness center trusted by thousands of families across the city. Our philosophy is simple: treat every animal as if they were our own.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#636e72" }}>
              From preventive wellness visits to complex surgical procedures, our team brings warmth, skill, and unwavering dedication to every single appointment.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ background: "#f0fdf0", aspectRatio: "3/2" }}>
            <img
              src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&h=466&fit=crop&auto=format"
              alt="PawCare clinic team with pets"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCounter target={10} suffix="+" label="Years of Excellence" />
          <StatCounter target={32} suffix="+" label="Expert Veterinarians" />
          <StatCounter target={5000} suffix="+" label="Happy Pet Families" />
          <StatCounter target={12000} suffix="+" label="Pets Treated" />
        </div>
      </div>
    </section>
  )
}

// ─── Vets ─────────────────────────────────────────────────────────────────────
function Vets() {
  return (
    <section className="py-20" style={{ background: "#FFF7ED" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            Our Team
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Meet Our Veterinarians
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#636e72" }}>
            Board-certified specialists who bring skill, science, and genuine care to every visit.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vets.map((v) => (
            <div key={v.name} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#e8f5e9" }}>
                <img
                  src={v.img}
                  alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end" style={{ background: "linear-gradient(0deg, rgba(92,184,92,0.8), transparent)" }}>
                  <div className="p-4 flex gap-3">
                    {["f", "in", "tw"].map((s) => (
                      <a key={s} href="#" className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold hover:bg-white/50 transition-colors">{s[0].toUpperCase()}</a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full inline-block" style={{ background: "#5CB85C20", color: "#5CB85C" }}>{v.exp}</div>
                <h3 className="font-bold mt-2 mb-0.5" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>{v.name}</h3>
                <p className="text-sm mb-3" style={{ color: "#636e72" }}>{v.role}</p>
                <button className="w-full py-2 rounded-lg text-sm font-semibold border-2 hover:text-white hover:bg-[#5CB85C] hover:border-[#5CB85C] transition-all" style={{ color: "#5CB85C", borderColor: "#5CB85C" }}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Booking ──────────────────────────────────────────────────────────────────
function Booking() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", petType: "Dog", service: "", date: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="book" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400&h=700&fit=crop&auto=format"
          alt="Pets background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(45, 52, 54, 0.85)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
            🗓️ Easy Scheduling
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            Book Your Appointment
          </h2>
          <p className="text-white/70 text-lg">Schedule in under 2 minutes — we'll confirm within the hour.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>Appointment Requested!</h3>
              <p className="text-lg mb-2" style={{ color: "#636e72" }}>
                Thank you, <strong style={{ color: "#5CB85C" }}>{form.name || "friend"}</strong>! We'll confirm your appointment shortly.
              </p>
              <p className="text-sm mb-8" style={{ color: "#636e72" }}>Check your email at <strong>{form.email || "your inbox"}</strong> for confirmation details.</p>
              <button onClick={() => setSubmitted(false)} className="px-8 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
                Book Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              {[
                { name: "name", label: "Pet Owner Name", type: "text", placeholder: "Your full name", full: false },
                { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", full: false },
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000", full: false },
              ].map((f) => (
                <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#2D3436" }}>{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#5CB85C] focus:ring-2 focus:ring-[#5CB85C20]"
                    style={{ borderColor: "#e5e7eb", color: "#2D3436" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2D3436" }}>Pet Type</label>
                <select
                  name="petType"
                  value={form.petType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#5CB85C] focus:ring-2 focus:ring-[#5CB85C20]"
                  style={{ borderColor: "#e5e7eb", color: "#2D3436" }}
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2D3436" }}>Service Required</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#5CB85C] focus:ring-2 focus:ring-[#5CB85C20]"
                  style={{ borderColor: "#e5e7eb", color: "#2D3436" }}
                >
                  <option value="">Select a service</option>
                  <option>Veterinary Care</option>
                  <option>Grooming</option>
                  <option>Pet Training</option>
                  <option>Boarding</option>
                  <option>Nutrition Consultation</option>
                  <option>Emergency Care</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2D3436" }}>Preferred Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#5CB85C] focus:ring-2 focus:ring-[#5CB85C20]"
                  style={{ borderColor: "#e5e7eb", color: "#2D3436" }}
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
                  Schedule Appointment 🐾
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
function Shop() {
  const [cart, setCart] = useState<string[]>([])

  return (
    <section className="py-20" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#FF9F4320", color: "#FF9F43" }}>
            🛍️ Pet Shop
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Premium Pet Products
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#636e72" }}>
            Vet-recommended nutrition, toys, and grooming essentials for your beloved companions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#f9fafb" }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {p.tag && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background: p.tag === "Sale" ? "#FF9F43" : "#5CB85C" }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>{p.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  <span className="text-xs ml-1" style={{ color: "#636e72" }}>(24)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold" style={{ color: "#5CB85C", fontFamily: "var(--font-jakarta)" }}>{p.price}</span>
                  <button
                    onClick={() => setCart([...cart, p.name])}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ background: cart.includes(p.name) ? "#4a9e4a" : "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}
                  >
                    {cart.includes(p.name) ? "✓ Added" : "+ Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border-2 hover:-translate-y-0.5 transition-all" style={{ color: "#5CB85C", borderColor: "#5CB85C" }}>
            View All Products <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Adoption ─────────────────────────────────────────────────────────────────
function Adoption() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, #f0fdf0, #FFF7ED)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            ❤️ Pet Adoption
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Give a Loving Home<br />To a Pet
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#636e72" }}>
            Every pet deserves a forever family. Meet our adorable friends waiting for their perfect home.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {adoptions.map((pet) => (
            <div key={pet.name} className="card-hover bg-white rounded-3xl overflow-hidden shadow-md group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "#e8f5e9" }}>
                <img src={pet.img} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold" style={{ color: "#5CB85C" }}>
                  Available
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>{pet.name}</h3>
                <p className="text-sm mb-1" style={{ color: "#636e72" }}>{pet.type}</p>
                <p className="text-sm font-medium mb-4" style={{ color: "#FF9F43" }}>Age: {pet.age}</p>
                <button className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #FF9F43, #e8892e)" }}>
                  Adopt Now 🐾
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border-2 hover:-translate-y-0.5 transition-all" style={{ color: "#FF9F43", borderColor: "#FF9F43" }}>
            See All Adoptable Pets <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-20" style={{ background: "white" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            💬 Happy Owners
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            What Pet Families Say
          </h2>
        </div>

        <div className="relative">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="transition-all duration-500"
              style={{ display: i === active ? "block" : "none" }}
            >
              <div className="rounded-3xl p-8 lg:p-12 text-center shadow-lg" style={{ background: "linear-gradient(135deg, #FFF7ED, #f0fdf0)" }}>
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => <StarIcon key={j} />)}
                </div>
                <p className="text-xl lg:text-2xl leading-relaxed mb-8 italic" style={{ color: "#2D3436", fontFamily: "var(--font-jakarta)" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md" />
                  <div className="text-left">
                    <div className="font-bold" style={{ color: "#2D3436", fontFamily: "var(--font-jakarta)" }}>{t.name}</div>
                    <div className="text-sm" style={{ color: "#636e72" }}>{t.pet}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === active ? "28px" : "10px",
                  height: "10px",
                  background: i === active ? "#5CB85C" : "#d1fae5",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
function Blog() {
  return (
    <section className="py-20" style={{ background: "#FFF7ED" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
            📚 Pet Tips & Guides
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>
            Latest from Our Blog
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#636e72" }}>
            Expert advice, care guides, and heartwarming stories from our veterinary team.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-7">
          {blogs.map((b) => (
            <div key={b.title} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", background: "#f0fdf0" }}>
                <img src={b.img} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#5CB85C" }}>{b.tag}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs mb-2" style={{ color: "#636e72" }}>{b.date}</div>
                <h3 className="font-bold leading-snug mb-4" style={{ fontFamily: "var(--font-jakarta)", color: "#2D3436" }}>{b.title}</h3>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#5CB85C" }}>
                  Read More <ArrowRightIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  return (
    <section className="py-16" style={{ background: "linear-gradient(135deg, #5CB85C, #4a9e4a)" }}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
          Get Pet Care Tips Delivered
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Join 8,000+ pet parents receiving weekly vet-approved care tips, deals, and health reminders.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-3 bg-white/20 rounded-2xl px-6 py-4 text-white font-semibold text-lg">
            <span className="text-2xl">✅</span> You're subscribed! Welcome to the PawCare family.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true) }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none border-2 border-transparent focus:border-white/50"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
            />
            <button type="submit" className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-xl hover:-translate-y-0.5" style={{ background: "white", color: "#5CB85C" }}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#2D3436", color: "#b2bec3" }}>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: "#5CB85C" }}>🐾</div>
              <span className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-jakarta)" }}>Paw<span style={{ color: "#5CB85C" }}>Care</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Complete pet care for every stage of your companion's life — because they deserve nothing less than the best.
            </p>
            <div className="flex gap-3">
              {["F", "I", "T", "Y"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#5CB85C] transition-colors" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About Us", "Services", "Our Doctors", "Shop", "Pet Adoption", "Blog", "Contact"].map((l) => (
                <li key={l}><a href="#" className="text-sm hover:text-[#5CB85C] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Our Services</h4>
            <ul className="space-y-2.5">
              {["Veterinary Care", "Pet Grooming", "Pet Training", "Pet Boarding", "Pet Nutrition", "Emergency Care"].map((l) => (
                <li key={l}><a href="#" className="text-sm hover:text-[#5CB85C] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span>📍</span><span>123 Paw Lane, Petsville, CA 90210</span></li>
              <li className="flex items-center gap-2"><PhoneIcon /><span>+1 800 572 9273</span></li>
              <li className="flex items-center gap-2"><MailIcon /><span>hello@pawcare.vet</span></li>
              <li className="flex items-center gap-2"><span>⏰</span><span>Mon–Sat: 8am – 8pm</span></li>
            </ul>
            <div className="mt-5 p-3 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ background: "#5CB85C20", color: "#5CB85C" }}>
              <span className="w-2 h-2 rounded-full bg-[#5CB85C] animate-pulse inline-block" />
              24/7 Emergency: +1 800 911 PETS
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p>© 2025 PawCare. All rights reserved. Made with ❤️ for pet lovers.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#5CB85C] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#5CB85C] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#5CB85C] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <About />
        <Vets />
        <Booking />
        <Shop />
        <Adoption />
        <Testimonials />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
