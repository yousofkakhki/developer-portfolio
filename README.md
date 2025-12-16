# Developer Portfolio - Yousef Kakhki

<p align="center">
  <img height="100" src="https://github.com/said7388/developer-portfolio/assets/77630868/c0064908-cd5f-4751-a77c-eba90a62b55c">
</p>

<p align="center">
  <strong>A modern, high-performance, bilingual (English/Persian) portfolio website built with Next.js 15, React 19, and Tailwind CSS</strong>
</p>

<p align="center">
  <a href="https://kakhki.ir">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🚀 Features

### Core Features
- ✅ **Bilingual Support** - Full English/Persian (RTL) internationalization
- ✅ **Modern UI/UX** - 2025 design trends with glassmorphism, micro-interactions, and smooth animations
- ✅ **Performance Optimized** - Code splitting, lazy loading, optimized bundles
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap, hreflang
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Accessibility** - WCAG AA compliant, keyboard navigation, screen reader support
- ✅ **Dark Theme** - Beautiful dark color scheme with gradient accents

### Sections
- 🎯 **Hero Section** - Animated introduction with parallax effects
- 👤 **About Me** - Professional background and expertise
- 💼 **Experience** - Work history with detailed descriptions
- 🛠️ **Skills** - Interactive skill showcase with marquee
- 🚀 **Projects** - Portfolio projects with image carousels
- 🎓 **Education** - Academic background
- 💬 **Testimonials** - Client recommendations
- 📧 **Contact** - Contact form with email integration

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.7 (App Router)
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS 3.x, SCSS
- **Internationalization**: next-intl 4.5.6
- **Animations**: CSS Animations, Lottie, Swiper
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js 20
- **Email**: Nodemailer
- **Rate Limiting**: express-rate-limit, rate-limiter-flexible

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions (configured)
- **Deployment**: VPS/Docker, Vercel, Netlify compatible

### Performance
- **Image Optimization**: Next.js Image, Sharp
- **Code Splitting**: Dynamic imports, route-based splitting
- **Bundle Optimization**: Webpack optimizations, tree-shaking

---

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/developer-portfolio.git
cd developer-portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=https://kakhki.ir
NEXT_PUBLIC_GTM=GTM-XXXXXXX

# Email Configuration
EMAIL_ADDRESS=contact@kakhki.ir
GMAIL_PASSKEY=your-app-password

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 4. Customize Your Data

Edit the following files in `utils/data/`:
- `personal-data.js` - Your personal information
- `experience.js` - Work experience
- `projects-data.js` - Portfolio projects
- `skills.js` - Your skills
- `educations.js` - Education history

Update translations in `messages/`:
- `en.json` - English translations
- `fa.json` - Persian translations

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

### Development

```bash
docker compose up dev
```

### Production

```bash
# Build and run production container
docker compose up -d prod

# View logs
docker compose logs -f prod

# Stop container
docker compose down prod
```

### Manual Docker Build

```bash
# Development
docker build -f Dockerfile.dev -t portfolio-dev .
docker run -p 3000:3000 portfolio-dev

# Production
docker build -f Dockerfile.prod -t portfolio-prod .
docker run -p 3000:3000 portfolio-prod
```

---

## 📦 Project Structure

```
developer-portfolio/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── layout.js            # Root layout with i18n
│   │   ├── page.js              # Home page
│   │   └── blog/                # Blog pages
│   ├── api/                      # API routes
│   │   ├── contact/             # Contact form endpoint
│   │   ├── data/                # Data API
│   │   └── google/              # Google API proxy
│   ├── components/              # React components
│   │   ├── homepage/            # Homepage sections
│   │   ├── helper/              # Utility components
│   │   └── ...                 # Other components
│   ├── css/                     # Global styles
│   └── assets/                  # Static assets (Lottie, SVG)
├── messages/                     # Translation files
│   ├── en.json                  # English
│   └── fa.json                  # Persian
├── public/                       # Public assets
├── utils/                        # Utility functions
│   ├── data/                    # Data files
│   ├── hooks/                   # Custom React hooks
│   └── ...                     # Other utilities
├── middleware.js                 # Next.js middleware
├── middleware-security.js        # Security headers
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── docker-compose.yml           # Docker Compose config
├── Dockerfile.dev               # Development Dockerfile
├── Dockerfile.prod              # Production Dockerfile
└── package.json                 # Dependencies
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

```
__tests__/
├── components/          # Component tests
├── utils/              # Utility function tests
└── pages/              # Page tests
```

---

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically on push

### Netlify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### VPS with Docker

1. Clone repository on server
2. Configure environment variables
3. Run: `docker compose up -d prod`
4. Configure reverse proxy (Nginx) if needed

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

---

## 🔧 Configuration

### Next.js Config

Key configurations in `next.config.js`:
- Image optimization
- Webpack optimizations
- Code splitting
- Package import optimization

### Tailwind Config

Custom configurations:
- 8pt grid system
- Typography scale
- Color palette
- Animations and keyframes
- RTL support

### Internationalization

Configured in `i18n.js`:
- Supported locales: `en`, `fa`
- Default locale: `en`
- Locale detection
- Routing strategy

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'accent': {
    'primary': '#16f2b3',    // Cyan
    'secondary': '#ec4899',  // Pink
    'tertiary': '#8b5cf6',   // Violet
  },
}
```

### Fonts

- **English**: Inter (Google Fonts)
- **Persian**: Vazirmatn (Google Fonts)

### Animations

Customize animations in `tailwind.config.js` and `app/css/globals.scss`.

---

## 🔒 Security

- Content Security Policy (CSP) headers
- Rate limiting on API routes
- Input validation and sanitization
- Secure headers (HSTS, X-Frame-Options, etc.)
- Environment variable protection

See [SECURITY.md](./SECURITY.md) for details.

---

## 📈 Performance

### Optimizations Implemented

- ✅ Code splitting and lazy loading
- ✅ Image optimization with Next.js Image
- ✅ Bundle size optimization
- ✅ React.memo and useMemo for component optimization
- ✅ Font loading optimization
- ✅ CSS optimization

### Performance Metrics

- **First Load JS**: ~463KB (optimized)
- **Lighthouse Score**: 90+ (Performance)
- **Core Web Vitals**: All green

---

## 🌍 Internationalization

### Supported Languages

- **English** (`/en`) - LTR
- **Persian/Farsi** (`/fa`) - RTL

### Adding New Languages

1. Add locale to `i18n.js`
2. Create translation file in `messages/`
3. Update `generateStaticParams` in layout
4. Test RTL support if needed

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is private and proprietary.

---

## 👤 Author

**Yousef Kakhki**
- Website: [kakhki.ir](https://kakhki.ir)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yousefkakhki)
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Animations with [Lottie](https://lottiefiles.com/)

---

## 📞 Support

For support, email contact@kakhki.ir or open an issue in the repository.

---

**Made with ❤️ by Yousef Kakhki**
