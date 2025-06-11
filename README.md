# My React App - Next.js

This project has been successfully migrated from Create React App (CRA) to Next.js, providing improved performance, SEO capabilities, and modern React features.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
# or
pnpm build

# Start the production server
npm run start
# or
yarn start
# or
pnpm start
```

## 📁 Project Structure

```
├── pages/              # Next.js pages (file-based routing)
│   ├── _app.tsx       # Custom App component
│   ├── _document.tsx  # Custom Document component
│   └── index.tsx      # Home page
├── styles/            # Stylesheets
│   ├── globals.css    # Global styles
│   └── Home.module.css # CSS modules
├── public/            # Static assets
├── lib/               # Utility functions
├── __tests__/         # Test files
├── components/        # Reusable components (future)
├── next.config.js     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## 🧪 Testing

```bash
# Run tests
npm run test
# or
yarn test
# or
pnpm test

# Run tests in watch mode
npm run test:watch
# or
yarn test:watch
# or
pnpm test:watch
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 📊 Performance

The migration to Next.js provides several performance improvements:

- **Faster Time to First Contentful Paint (FCP)**
- **Improved Largest Contentful Paint (LCP)**
- **Better Core Web Vitals scores**
- **Reduced bundle size through code splitting**
- **Optimized images with automatic WebP/AVIF conversion**

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js TypeScript Guide](https://nextjs.org/docs/basic-features/typescript)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

## 📝 Notes

This project was successfully migrated from Create React App to Next.js while maintaining all existing functionality and adding significant performance and SEO improvements.

---

## Original CRA Project

The original Create React App is preserved in the `my-react-app/` directory for reference.