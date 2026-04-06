import type { BlogPost } from "@/types";

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Building a Full-Stack Portfolio with Next.js 14 & Spring Boot",
    slug: "building-fullstack-portfolio-nextjs-springboot",
    excerpt:
      "A deep dive into architecting a modern portfolio application using Next.js 14 App Router on the frontend and Spring Boot 3 on the backend, connected via a PostgreSQL database on Neon.",
    content: `
<h2>Introduction</h2>
<p>Building a personal portfolio is a rite of passage for every developer. But instead of a static site, I wanted something dynamic — a full-stack application with a proper CMS where I can update my projects, skills, and blog posts from an admin dashboard.</p>

<h2>Tech Stack Overview</h2>
<p>After researching the modern ecosystem, I settled on:</p>
<ul>
  <li><strong>Frontend:</strong> Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Framer Motion</li>
  <li><strong>Backend:</strong> Java Spring Boot 3.4.5 + Spring Security + JWT</li>
  <li><strong>Database:</strong> PostgreSQL on Neon (serverless)</li>
  <li><strong>Deployment:</strong> Google Cloud Run (frontend + backend)</li>
</ul>

<h2>Why Next.js App Router?</h2>
<p>The App Router in Next.js 14 is a game-changer. Server Components allow us to fetch data on the server without shipping extra JavaScript to the client. This means blazing-fast page loads and excellent SEO — perfect for a portfolio site.</p>

<pre><code>// Server Component — zero client-side JS for data fetching
export default async function HomePage() {
  const posts = await fetchData('/api/blog-posts');
  return &lt;BlogSection posts={posts} /&gt;;
}</code></pre>

<h2>JWT Authentication with Spring Security</h2>
<p>For the admin panel, I implemented JWT-based authentication. The token is stored in an httpOnly cookie — never in localStorage — which prevents XSS attacks from stealing the token.</p>

<pre><code>@PostMapping("/auth/login")
public ResponseEntity&lt;AuthResponse&gt; login(@RequestBody LoginRequest request) {
    // authenticate user
    String token = jwtTokenProvider.generateToken(authentication);
    ResponseCookie cookie = ResponseCookie.from("jwt", token)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(Duration.ofDays(7))
        .build();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse("Login successful", "admin", "ADMIN"));
}</code></pre>

<h2>Eliminating CORS with API Proxy</h2>
<p>By configuring Next.js rewrites, all <code>/api/*</code> requests are proxied to the backend. This means the browser only ever talks to the frontend server — no CORS configuration needed!</p>

<h2>Conclusion</h2>
<p>The result is a fast, secure, and maintainable portfolio with a fully functional admin CMS. The separation of concerns between frontend and backend makes it easy to iterate on each independently.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    published: true,
    tags: ["Next.js", "Spring Boot", "PostgreSQL", "Full-Stack"],
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Docker & CI/CD: Automating Deployments with GitHub Actions",
    slug: "docker-cicd-github-actions",
    excerpt:
      "How I set up a complete CI/CD pipeline using GitHub Actions to automatically test, build, and deploy a Dockerized Java + Node.js application to production on every push to main.",
    content: `
<h2>Why Automate Deployments?</h2>
<p>Manual deployments are error-prone and time-consuming. A CI/CD pipeline gives you confidence that every change has passed tests before it reaches production. Here's how I set one up for a full-stack project.</p>

<h2>The Pipeline Structure</h2>
<p>My GitHub Actions workflow has three jobs that run in sequence:</p>
<ol>
  <li><strong>test-backend</strong> — Runs Gradle tests on Java 21</li>
  <li><strong>test-frontend</strong> — Runs pnpm build on Node 22</li>
  <li><strong>docker-build</strong> — Builds both Docker images (only if tests pass)</li>
</ol>

<pre><code>jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: cd backend && ./gradlew test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: cd frontend && npm i -g pnpm && pnpm install && pnpm build</code></pre>

<h2>Multi-Stage Docker Builds</h2>
<p>Multi-stage builds are essential for keeping image sizes small. For the Spring Boot backend, the final image is only ~200MB:</p>

<pre><code># Stage 1: Build
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

<h2>Deploying to Fly.io</h2>
<p>Fly.io is perfect for deploying Spring Boot applications. With a simple <code>fly.toml</code> configuration and <code>fly deploy</code>, your app is live in minutes with health checks, auto-scaling, and a Singapore region for low latency.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Always run tests before building Docker images</li>
  <li>Use multi-stage builds to minimize image size</li>
  <li>Store secrets in GitHub Actions secrets, never in code</li>
  <li>Use health checks in your deployment config</li>
</ul>
    `,
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80",
    published: true,
    tags: ["Docker", "GitHub Actions", "CI/CD", "DevOps"],
    createdAt: "2026-02-28T09:00:00Z",
    updatedAt: "2026-02-28T09:00:00Z",
  },
  {
    id: "3",
    title: "Mastering Spring Security: JWT + httpOnly Cookies",
    slug: "spring-security-jwt-httponly-cookies",
    excerpt:
      "A comprehensive guide to implementing JWT authentication in Spring Boot 3 using httpOnly cookies for maximum security, covering token generation, validation, and refresh strategies.",
    content: `
<h2>The Problem with localStorage</h2>
<p>Many tutorials store JWT tokens in <code>localStorage</code> or <code>sessionStorage</code>. This is a critical security mistake — any JavaScript on your page (including third-party scripts) can read these values, making you vulnerable to XSS attacks.</p>

<h2>The httpOnly Cookie Solution</h2>
<p>By storing the JWT in an httpOnly cookie, the browser automatically includes it in every request, but JavaScript can never read it. This is the gold standard for web authentication.</p>

<h2>Implementing the JWT Provider</h2>
<pre><code>@Component
public class JwtTokenProvider {
    
    @Value("\${jwt.secret}")
    private String jwtSecret;
    
    public String generateToken(Authentication authentication) {
        return Jwts.builder()
            .subject(authentication.getName())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L))
            .signWith(getSigningKey())
            .compact();
    }
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}</code></pre>

<h2>The Authentication Filter</h2>
<p>The filter extracts the JWT from the cookie and sets the security context:</p>

<pre><code>@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain) {
        
        String token = Arrays.stream(request.getCookies())
            .filter(c -> "jwt".equals(c.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);
            
        if (token != null && jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}</code></pre>

<h2>Conclusion</h2>
<p>Using httpOnly cookies with JWT is more secure than localStorage and doesn't sacrifice developer experience. Combined with proper CSRF protection and HTTPS in production, this pattern is battle-tested and production-ready.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    published: true,
    tags: ["Spring Boot", "Security", "JWT", "Java"],
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "4",
    title: "Tailwind CSS + shadcn/ui: Building a Design System in Minutes",
    slug: "tailwind-shadcn-design-system",
    excerpt:
      "How shadcn/ui's copy-paste philosophy combined with Tailwind CSS utilities lets you build a consistent, accessible, and fully customizable design system without fighting against a framework.",
    content: `
<h2>Why shadcn/ui?</h2>
<p>Unlike traditional component libraries (MUI, Chakra UI), shadcn/ui takes a unique approach: you own the code. Components are copied directly into your project, giving you full control to customize them without overriding library styles.</p>

<h2>Setting Up Dark Mode</h2>
<p>With <code>next-themes</code> and Tailwind's dark mode class strategy, implementing a theme toggle is straightforward:</p>

<pre><code>// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
}</code></pre>

<h2>CSS Variables for Theming</h2>
<p>The real power comes from CSS custom properties. Swap an entire theme by changing a few HSL values:</p>

<pre><code>:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}</code></pre>

<h2>Framer Motion Animations</h2>
<p>Adding entrance animations to any component is as simple as wrapping it with <code>motion.div</code>:</p>

<pre><code>import { motion } from "motion/react";

export function AnimatedCard({ children }) {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    &gt;
      {children}
    &lt;/motion.div&gt;
  );
}</code></pre>

<h2>The Result</h2>
<p>A pixel-perfect, accessible, responsive UI that you fully own and control — no fighting against library defaults, no massive bundle bloat. This stack is my go-to for any new React project.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    published: true,
    tags: ["Tailwind CSS", "shadcn/ui", "React", "UI Design"],
    createdAt: "2026-01-25T11:00:00Z",
    updatedAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "5",
    title: "PostgreSQL on Neon: Serverless Database for Modern Apps",
    slug: "postgresql-neon-serverless-database",
    excerpt:
      "Exploring Neon's serverless PostgreSQL offering — branching, scale-to-zero, and how to connect a Spring Boot application via JDBC with connection pooling using HikariCP.",
    content: `
<h2>What is Neon?</h2>
<p>Neon is a serverless PostgreSQL provider that separates storage from compute. This means your database can scale to zero when not in use, dramatically reducing costs for personal projects and startups.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Branching:</strong> Create database branches for dev/staging just like Git branches</li>
  <li><strong>Scale-to-zero:</strong> Compute pauses automatically when idle</li>
  <li><strong>Connection pooling:</strong> Built-in PgBouncer support</li>
  <li><strong>Point-in-time restore:</strong> 24-hour history on the free tier</li>
</ul>

<h2>Connecting Spring Boot to Neon</h2>
<p>The connection string uses the standard JDBC PostgreSQL format. Just set your environment variables and Spring Boot handles the rest:</p>

<pre><code># application.yml
spring:
  datasource:
    url: \${NEON_JDBC_URL:jdbc:postgresql://localhost:5432/portfolio}
    username: \${NEON_USERNAME:postgres}
    password: \${NEON_PASSWORD:postgres}
    hikari:
      maximum-pool-size: 5
      minimum-idle: 1
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000</code></pre>

<h2>Schema Management</h2>
<p>Instead of relying on Hibernate's DDL generation (which can be dangerous), I use a <code>schema.sql</code> file with <code>IF NOT EXISTS</code> guards for every table. This makes schema changes non-destructive:</p>

<pre><code>CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    content     TEXT,
    excerpt     TEXT,
    cover_image VARCHAR(500),
    published   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);</code></pre>

<h2>Performance Tips</h2>
<p>Since Neon can have cold-start latency, configure your Spring Boot app to keep connections warm with HikariCP's <code>keepaliveTime</code> setting. Also, enable connection pooling via Neon's pooler endpoint for high-concurrency scenarios.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80",
    published: true,
    tags: ["PostgreSQL", "Neon", "Database", "Spring Boot"],
    createdAt: "2026-01-10T07:00:00Z",
    updatedAt: "2026-01-10T07:00:00Z",
  },
  {
    id: "6",
    title: "Clean Architecture in Java: Organizing a Spring Boot Project",
    slug: "clean-architecture-java-spring-boot",
    excerpt:
      "How to structure a Spring Boot project following clean architecture principles — separating controllers, services, repositories, DTOs, and entities for maximum maintainability and testability.",
    content: `
<h2>The Problem with MVC Spaghetti</h2>
<p>When a Spring Boot project grows, it's tempting to put business logic in controllers or let entities bleed into API responses. This leads to tightly coupled, untestable code. Clean Architecture solves this.</p>

<h2>Layer Separation</h2>
<p>My project structure follows a strict layering rule:</p>

<pre><code>com.portfolio/
├── controller/   → HTTP layer (receives requests, returns responses)
├── service/      → Business logic (the core of your app)
├── repository/   → Data access (JPA repositories)
├── entity/       → JPA entities (maps to DB tables)
├── dto/
│   ├── request/  → What the API receives (validation here)
│   └── response/ → What the API returns (never expose entities)
└── exception/    → Global error handling</code></pre>

<h2>DTOs as API Contracts</h2>
<p>Never return JPA entities directly from your controllers. Use DTOs to control exactly what data is exposed:</p>

<pre><code>// Entity — internal, has JPA annotations
@Entity
public class BlogPost {
    @Id UUID id;
    String title;
    String content;
    Boolean published;
    // ... other fields
}

// Response DTO — external, clean
public record BlogPostResponse(
    UUID id,
    String title,
    String excerpt,
    String coverImage,
    List&lt;String&gt; tags,
    LocalDateTime createdAt
) {}</code></pre>

<h2>Global Exception Handling</h2>
<pre><code>@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity&lt;ApiResponse&lt;Void&gt;&gt; handleNotFound(
            ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;ApiResponse&lt;Map&lt;String, String&gt;&gt;&gt; handleValidation(
            MethodArgumentNotValidException ex) {
        Map&lt;String, String&gt; errors = new HashMap&lt;&gt;();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Validation failed", errors));
    }
}</code></pre>

<h2>Why This Matters</h2>
<p>With this structure, you can swap your database from PostgreSQL to MongoDB without touching a single controller. You can unit test service classes in isolation. And onboarding new developers becomes much easier — everyone knows where everything lives.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    published: true,
    tags: ["Java", "Spring Boot", "Architecture", "Best Practices"],
    createdAt: "2025-12-20T09:00:00Z",
    updatedAt: "2025-12-20T09:00:00Z",
  },
  {
    id: "7",
    title: "Framer Motion Tips: Scroll Animations That Delight Users",
    slug: "framer-motion-scroll-animations",
    excerpt:
      "Practical patterns for adding scroll-triggered entrance animations, stagger effects, and micro-interactions with Framer Motion in a Next.js app — without hurting performance.",
    content: `
<h2>Why Animations Matter</h2>
<p>Well-crafted animations don't just look nice — they guide attention, communicate state changes, and make an interface feel alive. The key is subtlety: animations should enhance, never distract.</p>

<h2>Viewport-Triggered Animations</h2>
<p>The <code>whileInView</code> prop is perfect for scroll-triggered entrance effects:</p>

<pre><code>function AnimatedSection({ children }) {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    &gt;
      {children}
    &lt;/motion.div&gt;
  );
}</code></pre>

<h2>Stagger Children</h2>
<p>For lists of items, stagger them so they animate in one-by-one:</p>

<pre><code>const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function SkillsList({ skills }) {
  return (
    &lt;motion.ul variants={container} initial="hidden" animate="show"&gt;
      {skills.map(skill => (
        &lt;motion.li key={skill.id} variants={item}&gt;
          {skill.name}
        &lt;/motion.li&gt;
      ))}
    &lt;/motion.ul&gt;
  );
}</code></pre>

<h2>Hover Micro-interactions</h2>
<pre><code>&lt;motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
&gt;
  &lt;Card&gt;...&lt;/Card&gt;
&lt;/motion.div&gt;</code></pre>

<h2>Performance Tips</h2>
<ul>
  <li>Use <code>will-change: transform</code> via Tailwind's <code>will-change-transform</code> for GPU-accelerated animations</li>
  <li>Prefer animating <code>transform</code> and <code>opacity</code> — they don't cause layout recalculation</li>
  <li>Use <code>viewport={{ once: true }}</code> so animations only run once</li>
  <li>Avoid animating too many elements simultaneously on mobile</li>
</ul>

<h2>Result</h2>
<p>These patterns are exactly what I use in this portfolio. The result is a smooth, performant experience that feels polished without being overdone.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    published: true,
    tags: ["Framer Motion", "React", "Animation", "UX"],
    createdAt: "2025-12-05T14:00:00Z",
    updatedAt: "2025-12-05T14:00:00Z",
  },
  {
    id: "8",
    title: "From Junior to Mid-Level: Lessons from My First 2 Years at FPT Software",
    slug: "junior-to-mid-level-fpt-software-lessons",
    excerpt:
      "The technical and soft skills that made the biggest difference in my growth as a software engineer — from writing better code to communicating effectively in a large enterprise team.",
    content: `
<h2>The Beginning</h2>
<p>Joining FPT Software as a fresh graduate was both exciting and overwhelming. The codebase was massive, the processes were formal, and imposter syndrome hit hard. Two years later, I look back at the lessons that mattered most.</p>

<h2>1. Read Code More Than You Write It</h2>
<p>The most valuable skill a junior developer can develop is reading code. When I joined, I spent my first weeks reading existing code — understanding patterns, naming conventions, and architectural decisions. This accelerated my onboarding more than any tutorial.</p>

<h2>2. Master Git Before Anything Else</h2>
<p>Knowing git beyond <code>add</code>, <code>commit</code>, <code>push</code> saved me countless times. Interactive rebase, cherry-pick, and bisect are tools every developer should know:</p>

<pre><code># Find the commit that introduced a bug
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# Squash last 3 commits for a clean PR
git rebase -i HEAD~3</code></pre>

<h2>3. Write Tests Early</h2>
<p>I initially saw tests as extra work. Then I had a bug in production that a unit test would have caught. Now I write tests for every critical path — not 100% coverage, but meaningful tests that give me confidence to refactor.</p>

<h2>4. Ask Better Questions</h2>
<p>Early on, I'd ask "this doesn't work, help?" Now I ask "I tried X and Y, I think the issue is Z because of this log output — does that align with your understanding?" This saves everyone's time and accelerates your own problem-solving.</p>

<h2>5. Communicate in Written Form</h2>
<p>In a large team, clear written communication (PRs, tickets, Slack messages) is as important as coding ability. A well-written PR description with context, screenshots, and test instructions is a gift to your reviewers.</p>

<h2>Looking Ahead</h2>
<p>The transition from junior to mid-level isn't about knowing more frameworks — it's about solving problems more independently, communicating better, and helping the people around you grow. That's what I'm focused on in year three.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    published: true,
    tags: ["Career", "Software Engineering", "Growth", "FPT"],
    createdAt: "2025-11-18T10:00:00Z",
    updatedAt: "2025-11-18T10:00:00Z",
  },
];

export const ALL_TAGS = Array.from(
  new Set(STATIC_BLOG_POSTS.flatMap((p) => p.tags))
).sort();

export function getPostBySlug(slug: string): BlogPost | undefined {
  return STATIC_BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return STATIC_BLOG_POSTS.filter(
    (p) =>
      p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag))
  ).slice(0, limit);
}

