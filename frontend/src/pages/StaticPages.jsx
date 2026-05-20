import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Users, Award, Briefcase, MapPin, Clock, Newspaper, ArrowRight,
  BookOpen, HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Send, Info,
  ShieldCheck, FileText, Landmark, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── SHARED PAGE CONTAINER WITH GRADIENT BACKGROUND ──
function PageWrapper({ title, subtitle, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cinema-black text-cinema-off-white pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cinema-off-white via-cinema-red/80 to-cinema-red bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-cinema-muted text-lg max-w-xl mx-auto">{subtitle}</p>}
          <div className="w-24 h-1 bg-cinema-red mx-auto mt-6 rounded-full" />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ── 1. ABOUT US PAGE ──
export function About() {
  const stats = [
    { value: '50M+', label: 'Tickets Booked' },
    { value: '150+', label: 'Cities Covered' },
    { value: '1,200+', label: 'Screens Connected' },
    { value: '4.9★', label: 'Play Store Rating' },
  ];

  const milestones = [
    { year: '2022', title: 'CineFlow Founded', desc: 'Started with 5 theaters in Mumbai to make ticket booking seamless.' },
    { year: '2023', title: 'National Expansion', desc: 'Expanded services to Delhi NCR, Bangalore, and Hyderabad.' },
    { year: '2024', title: 'IMAX Partnership', desc: 'Partnered with major IMAX screens to offer premium seat selection.' },
    { year: '2025', title: 'CineFlow VIP launch', desc: 'Introduced premium recliners booking and in-seat dining ordering.' },
  ];

  return (
    <PageWrapper title="Redefining the Cinema Experience" subtitle="CineFlow is India's leading entertainment booking platform, bringing the magic of the silver screen straight to your fingertips.">
      <div className="space-y-12">
        {/* Intro */}
        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cinema-red" /> Our Vision
          </h2>
          <p className="text-cinema-muted leading-relaxed">
            At CineFlow, we believe that watching a movie isn't just about staring at a screen; it is an event, a memory, and an experience. Our mission is to make the journey to the theater as magical and effortless as the movie itself. We build premium, seamless, and state-of-the-art tools for moviegoers and theater owners alike.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-cinema-card border border-cinema-border/50 rounded-xl p-5 text-center">
              <p className="text-3xl font-black text-cinema-red font-display">{s.value}</p>
              <p className="text-cinema-muted text-xs font-semibold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl font-bold text-center mb-8">Our Journey</h3>
          <div className="relative border-l-2 border-cinema-border/80 ml-4 space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cinema-red border-4 border-cinema-black" />
                <span className="text-xs font-black text-cinema-red tracking-wider uppercase font-mono">{m.year}</span>
                <h4 className="font-bold text-cinema-off-white text-base mt-1">{m.title}</h4>
                <p className="text-cinema-muted text-sm mt-1 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── 2. CAREERS PAGE ──
export function Careers() {
  const jobs = [
    { title: 'Senior Frontend Engineer (React)', dept: 'Engineering', loc: 'Mumbai / Remote', type: 'Full-Time' },
    { title: 'Product UI/UX Designer', dept: 'Design', loc: 'Remote', type: 'Full-Time' },
    { title: 'DevOps Platform Engineer', dept: 'Engineering', loc: 'Bangalore', type: 'Full-Time' },
    { title: 'Operations Associate', dept: 'Operations', loc: 'Mumbai Office', type: 'Full-Time' },
  ];

  const handleApply = (title) => {
    toast.success(`Application portal opened for: ${title}! Please check your email.`);
  };

  return (
    <PageWrapper title="Build the Future of Entertainment" subtitle="Join our passionate team of developers, designers, and cinephiles building India's premium ticket booking platform.">
      <div className="space-y-8">
        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-lg font-bold text-cinema-off-white">Perks & Culture</h2>
          <p className="text-cinema-muted text-sm leading-relaxed">
            Flexible hours, unlimited movie vouchers, premium health insurance, remote working flexibility, and a highly collaborative, fast-paced environment.
          </p>
        </div>

        <h3 className="font-display text-xl font-bold text-center mt-12 mb-6">Current Openings</h3>
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ borderLeftColor: '#E50914' }}
              className="bg-cinema-card border border-cinema-border border-l-4 border-l-transparent rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div>
                <h4 className="font-bold text-cinema-off-white text-base">{job.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-cinema-muted mt-1.5 font-medium">
                  <span className="bg-cinema-dark px-2 py-0.5 rounded border border-cinema-border">{job.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.loc}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                </div>
              </div>
              <button 
                onClick={() => handleApply(job.title)}
                className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ── 3. PRESS PAGE ──
export function Press() {
  const articles = [
    { date: 'May 10, 2026', source: 'TechCrunch', title: 'CineFlow Secures $15M Series A Funding to Expand Screen Integration', desc: 'The movie ticket booking startup CineFlow announces its latest funding round led by top venture capital firms to speed up real-time screen synchronization.' },
    { date: 'April 02, 2026', source: 'Forbes India', title: 'CineFlow: Revolutionizing How India Books Cinema Tickets', desc: 'How CineFlow rose from a local ticketing tool to a nationwide platform connecting hundreds of screens across 150 cities.' },
    { date: 'Feb 15, 2026', source: 'The Hollywood Reporter', title: 'CineFlow Announces Premium Partnership with Major Multiplexes', desc: 'The new partnership enables real-time seat reservation holds and contactless ticket checkout for thousands of screens.' },
  ];

  return (
    <PageWrapper title="Press & Media" subtitle="Read the latest news, announcements, and media coverages about CineFlow.">
      <div className="space-y-6">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-cinema-card border border-cinema-border rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-cinema-red font-mono">
              <span>{art.source}</span>
              <span className="text-cinema-muted">{art.date}</span>
            </div>
            <h3 className="text-lg font-bold text-cinema-off-white font-display hover:text-cinema-red transition-colors cursor-pointer">{art.title}</h3>
            <p className="text-cinema-muted text-sm leading-relaxed">{art.desc}</p>
          </div>
        ))}

        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto mt-10">
          <h4 className="font-bold text-cinema-off-white">Media Inquiries</h4>
          <p className="text-cinema-muted text-xs">For interviews, high-res logos, or press kit downloads, contact our media relation officers.</p>
          <a href="mailto:press@cineflow.com" className="inline-flex items-center gap-1.5 text-cinema-red text-sm font-bold hover:underline">
            <Mail className="w-4 h-4" /> press@cineflow.com
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── 4. BLOG PAGE ──
export function Blog() {
  const posts = [
    { title: 'The Future of Real-Time Seating Hold', date: 'May 18, 2026', readTime: '5 min read', category: 'Tech', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400', desc: 'How we used Socket.io to prevent double-booking issues and enable 5-minute reservation timeouts for a smooth customer experience.' },
    { title: 'Why IMAX 3D is Seeing a massive Resurgence', date: 'May 05, 2026', readTime: '7 min read', category: 'Cinemagoing', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', desc: 'Understanding the psychological and technological appeal that draws viewers back to massive screen formats.' },
    { title: 'Building a High-Performance Ticket Backend', date: 'April 20, 2026', readTime: '9 min read', category: 'Backend', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', desc: 'An engineering deep dive into MongoDB connection configurations and database pooling patterns.' },
  ];

  return (
    <PageWrapper title="CineFlow Chronicles" subtitle="Behind the scenes, technical deep dives, and discussions about film culture and ticketing engineering.">
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-cinema-card border border-cinema-border rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-cinema-red/40 transition-all">
            <div className="h-40 overflow-hidden relative bg-cinema-dark">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 left-2 bg-cinema-red text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {post.category}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-cinema-muted text-[10px] font-mono font-semibold">{post.date} • {post.readTime}</p>
                <h3 className="font-bold text-cinema-off-white text-sm mt-1.5 leading-tight group-hover:text-cinema-red transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-cinema-muted text-xs mt-2 line-clamp-3 leading-relaxed">{post.desc}</p>
              </div>
              <span className="text-cinema-red text-xs font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── 5. HELP CENTER (FAQ) PAGE ──
export function Help() {
  const faqs = [
    { q: 'How do I cancel my booked tickets?', a: 'You can cancel your booking from the "My Bookings" page at least 2 hours before the show starts. Once canceled, the refund will be automatically processed to your original payment method.' },
    { q: 'How long does a refund take to reach my account?', a: 'Refunds are initiated immediately. For UPI and cards, it usually takes 3 to 5 business days to reflect in your bank account, depending on your bank.' },
    { q: 'What is the 5-minute seat reservation limit?', a: 'When you select seats, they are temporarily locked for 5 minutes via Socket.io so no one else can book them. You must complete the payment within this time, or they will be auto-released.' },
    { q: 'Can I change my seat layout after booking?', a: 'Unfortunately, seats cannot be modified once a booking is confirmed. You will need to cancel the booking (if within the cancellation window) and book again.' },
    { q: 'How do I access my booking QR code?', a: 'You will receive an email confirmation containing the QR code. You can also view it anytime by navigating to "My Bookings" in your profile drop-down menu.' },
  ];

  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <PageWrapper title="Help Center & FAQs" subtitle="Find answers to common questions about ticket bookings, refunds, and seating options.">
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="bg-cinema-card border border-cinema-border rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left font-bold text-cinema-off-white hover:bg-cinema-dark/50 flex justify-between items-center gap-4 text-sm"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-cinema-red" /> : <ChevronDown className="w-4 h-4 text-cinema-muted" />}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-cinema-muted text-sm leading-relaxed border-t border-cinema-border/30 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 text-center mt-12 space-y-3 max-w-sm mx-auto">
          <h4 className="font-bold text-cinema-off-white">Still need assistance?</h4>
          <p className="text-cinema-muted text-xs">Reach out to our customer experience support agents.</p>
          <a href="mailto:support@cineflow.com" className="inline-flex items-center gap-1.5 text-cinema-red text-sm font-bold hover:underline">
            <Mail className="w-4 h-4" /> support@cineflow.com
          </a>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── 6. CONTACT US PAGE ──
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been sent successfully! We will reply soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  return (
    <PageWrapper title="Contact Support" subtitle="Have questions, partnership inquiries, or general feedback? Send us a message and we will respond within 24 hours.">
      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-cinema-card border border-cinema-border rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-cinema-off-white text-base">Get in Touch</h3>
            <div className="space-y-3 text-sm text-cinema-muted">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cinema-red flex-shrink-0" />
                <span>support@cineflow.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cinema-red flex-shrink-0" />
                <span>+91 1800-CINEFLOW</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cinema-red flex-shrink-0" />
                <span>Andheri West, Mumbai, 400053</span>
              </div>
            </div>
          </div>
          <div className="bg-cinema-red/10 border border-cinema-red/30 rounded-xl p-4 text-xs text-cinema-muted leading-relaxed">
            <strong>Operating Hours:</strong> Our customer support desk operates 24/7 for booking-related urgencies and payment confirmations.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-cinema-dark border border-cinema-border rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Name *</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Tony Stark" 
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red transition-colors" 
              />
            </div>
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Email *</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="tony@stark.com" 
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red transition-colors" 
              />
            </div>
          </div>
          <div>
            <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Subject</label>
            <input 
              type="text" 
              value={form.subject} 
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Booking Issue" 
              className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red transition-colors" 
            />
          </div>
          <div>
            <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Message *</label>
            <textarea 
              rows={4} 
              required 
              value={form.message} 
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Your support request details here..." 
              className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red resize-none transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

// ── 7. REFUND POLICY PAGE ──
export function Refunds() {
  const policies = [
    { title: 'Full Refund Timeline', icon: Clock, desc: 'Cancellations made more than 4 hours before the showtime receive a 100% refund of the ticket price.' },
    { title: 'Partial Refund Timeline', icon: Info, desc: 'Cancellations made between 2 to 4 hours before the showtime receive a 50% refund. Cancellations under 2 hours are not eligible for refunds.' },
    { title: 'Internet Convenience Fee', icon: Landmark, desc: 'Please note that internet handling fees and taxes charged at the time of booking are non-refundable.' },
    { title: 'Refund Processing Time', icon: RefreshCw, desc: 'Refunds are automatically processed to the original payment method (Card, Net Banking, or UPI) and take 3-5 business days to clear.' },
  ];

  return (
    <PageWrapper title="Refund & Cancellation Policy" subtitle="Please review our timelines and policy guidelines regarding show cancellations and ticket booking refunds.">
      <div className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {policies.map((p, i) => (
            <div key={i} className="bg-cinema-card border border-cinema-border rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cinema-red/10 border border-cinema-red/30 flex items-center justify-center text-cinema-red">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-cinema-off-white text-sm">{p.title}</h3>
              <p className="text-cinema-muted text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 text-sm text-cinema-muted space-y-4">
          <h4 className="font-bold text-cinema-off-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cinema-red" /> Term Conditions
          </h4>
          <p className="leading-relaxed">
            In rare cases where a show is cancelled by the theater management due to technical difficulties, natural disasters, or other issues, a 100% refund (including internet convenience fees) will be processed automatically within 24 hours.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── 8. PRIVACY POLICY PAGE ──
export function Privacy() {
  const sections = [
    { title: '1. Information We Collect', desc: 'We collect information you provide directly to us, such as name, email address, phone number, and transaction details. We do not store sensitive payment card information (payments are processed securely via Stripe/Razorpay).' },
    { title: '2. How We Use Your Data', desc: 'We use your information to facilitate seat locks, deliver QR tickets, send transaction details, issue notifications about changes to showtimes, and process authorized refunds.' },
    { title: '3. Data Security', desc: 'We implement industrial-grade security measures to safeguard your personal data from unauthorized access, loss, or disclosure. Seating layouts and holds are protected via encrypted real-time socket connections.' },
    { title: '4. Third-Party Services', desc: 'We utilize third-party authentication services (Clerk.com) and payment processing gateways (Stripe/Razorpay) which govern your data under their own respective privacy policies.' },
  ];

  return (
    <PageWrapper title="Privacy Policy" subtitle="Last updated: May 20, 2026. This policy outlines how CineFlow collects, uses, and safeguards your data.">
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-cinema-card border border-cinema-border rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-cinema-off-white text-base">{sec.title}</h3>
            <p className="text-cinema-muted text-sm leading-relaxed">{sec.desc}</p>
          </div>
        ))}

        <div className="text-center py-6 text-xs text-cinema-muted flex items-center justify-center gap-1.5 border-t border-cinema-border/30 mt-8">
          <FileText className="w-4 h-4 text-cinema-red" />
          <span>If you have questions regarding our data practices, reach out to us at <a href="mailto:privacy@cineflow.com" className="text-cinema-red hover:underline font-semibold">privacy@cineflow.com</a>.</span>
        </div>
      </div>
    </PageWrapper>
  );
}
