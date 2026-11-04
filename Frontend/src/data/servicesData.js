export const servicesData = {
  'website-development': {
    id: 1,
    slug: 'website-development',
    category: 'Development & Digital Products',
    titleLine1: 'Website &',
    titleLine2: 'Development',
    subtitle: 'A perfect guide to your high-performance, conversion-optimized web presence and digital platforms.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Performance Score',
    badgeValue: '99/100 Core Vitals',
    badgeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    statCount: '250k',
    statLabel: 'Users have explored',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'UX Architecture' },
      { x: 260, y: 220, label: 'Full-Stack Code' },
      { x: 500, y: 110, label: 'Global CDN Launch' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Concept to',
      titleHighlight: 'Deployment',
      subtitle: 'A transparent, agile methodology designed to mitigate risk and deliver value at every stage.',
      steps: [
        {
          step: 1,
          title: 'Discovery',
          desc: 'We analyze requirements, user personas, and define technical KPIs.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'UI/UX Design',
          desc: 'Wireframing and prototyping for intuitive user journeys.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Development',
          desc: 'Agile sprints where scalable architecture meets clean code.',
          icon: 'code'
        },
        {
          step: 4,
          title: 'QA & Testing',
          desc: 'Rigorous unit testing, cross-browser audits, and performance stress-tests.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Deployment',
          desc: 'Live launch on secure global CDN servers with 24/7 monitoring.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'Website Development Pricing',
      subheadline: 'Select the package that fits your ambition — from high-converting landing sites to bespoke enterprise platforms.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$999',
          period: 'one-time',
          desc: 'Essential modern website to establish immediate credibility and capture qualified leads.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$2,499',
          period: 'one-time',
          desc: 'High-performance interactive website with custom micro-animations and CMS integration.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'Full-scale enterprise digital platform with custom database architectures and API integrations.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Scope & Deliverables',
          features: [
            { name: 'Pages / Views Included', basic: 'Up to 5 pages', advanced: 'Up to 15 pages', custom: 'Unlimited' },
            { name: 'Turnaround Timeline', basic: '1-2 weeks', advanced: '3-4 weeks', custom: 'Priority Agile' },
            { name: 'Design Revisions', basic: '2 rounds', advanced: 'Unlimited rounds', custom: 'Unlimited & Dedicated' }
          ]
        },
        {
          category: 'Engineering & UI Experience',
          features: [
            { name: 'Mobile-First Responsive Design', basic: true, advanced: true, custom: true },
            { name: 'Core Web Vitals (< 1s Load Speed)', basic: true, advanced: true, custom: true },
            { name: 'Custom Animations & Micro-Interactions', basic: false, advanced: true, custom: true },
            { name: 'Content Management System (CMS)', basic: true, advanced: true, custom: true },
            { name: 'E-Commerce / Payment Gateways (Stripe)', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'SEO & Integrations',
          features: [
            { name: 'On-Page SEO & Metadata Configuration', basic: true, advanced: true, custom: true },
            { name: 'Google Analytics & Tag Manager (GA4)', basic: true, advanced: true, custom: true },
            { name: 'CRM & Custom Webhook Pipelines', basic: false, advanced: false, custom: true },
            { name: 'Multi-Language / Localization', basic: false, advanced: false, custom: true }
          ]
        },
        {
          category: 'Warranty & Support',
          features: [
            { name: 'Post-Launch Bug Warranty', basic: '14 days', advanced: '60 days', custom: '180 days' },
            { name: 'Dedicated Project Manager', basic: false, advanced: true, custom: true },
            { name: '24/7 SLA Priority Response', basic: false, advanced: false, custom: true }
          ]
        }
      ]
    },
    features: [
      {
        icon: '⚡',
        title: 'Blazing Fast Speed',
        desc: 'Sub-second load times engineered with modern frameworks, optimized assets, and efficient edge-caching.'
      },
      {
        icon: '📱',
        title: 'Adaptive Mobile Design',
        desc: 'Responsive across smartphones, tablets, and desktops with seamless navigation and thumb-friendly controls.'
      },
      {
        icon: '🔒',
        title: 'Enterprise Security',
        desc: 'Built with SSL, automated backups, sanitization headers, and defense-in-depth against vulnerabilities.'
      },
      {
        icon: '🎯',
        title: 'Conversion-Focused UX',
        desc: 'Strategic CTA placements, psychological color harmony, and frictionless funnels designed to turn clicks into revenue.'
      }
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    faqs: [
      {
        q: 'How long does a website development project take?',
        a: 'Standard custom websites typically take 2-4 weeks, while complex web applications with bespoke integrations take 4-8 weeks.'
      },
      {
        q: 'Will my website be mobile-friendly and SEO-optimized?',
        a: 'Yes, 100%. Every website we engineer is built mobile-first and pre-optimized for Google search indexing and Core Web Vitals.'
      },
      {
        q: 'Do you provide maintenance and updates after launch?',
        a: 'Absolutely. We offer ongoing maintenance, security patches, performance monitoring, and content updates.'
      }
    ]
  },

  'application-development': {
    id: 2,
    slug: 'application-development',
    category: 'Development & Digital Products',
    titleLine1: 'Mobile & App',
    titleLine2: 'Development',
    subtitle: 'A perfect guide to scalable mobile apps and enterprise software engineered for millions of users.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Active Users',
    badgeValue: '500k+ MAU',
    badgeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    statCount: '100k',
    statLabel: 'People have explored',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Wireframing' },
      { x: 260, y: 220, label: 'Cloud Backend' },
      { x: 500, y: 110, label: 'App Store Deploy' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Architecture to',
      titleHighlight: 'Production',
      subtitle: 'End-to-end engineering lifecycle built for high concurrency, rock-solid security, and scale.',
      steps: [
        {
          step: 1,
          title: 'System Scoping',
          desc: 'Scoping system blueprints, data models, and API interface contracts.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'Interactive UX',
          desc: 'Interactive state flows, wireframe models, and click-through prototypes.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Full-Stack Code',
          desc: 'Modular development using modern microservices and CI/CD pipelines.',
          icon: 'code'
        },
        {
          step: 4,
          title: 'Automated Testing',
          desc: 'Comprehensive unit testing, load testing, and penetration security audits.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Production Rollout',
          desc: 'Zero-downtime deployment, auto-scaling clusters, and live telemetry.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'Application Development Pricing',
      subheadline: 'Engineered for scalability — from standalone MVP releases to multi-platform enterprise ecosystems.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$2,499',
          period: 'one-time',
          desc: 'Lightweight MVP prototype for validation with core features, authentication, and database.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$5,999',
          period: 'one-time',
          desc: 'Full-stack cross-platform app (iOS & Android) with real-time notifications and payment processing.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'Enterprise distributed cloud system with custom microservices, AI integrations, and offline sync.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Platform & Scope',
          features: [
            { name: 'Target Platforms', basic: 'Single (Web or Mobile)', advanced: 'Dual (iOS + Android)', custom: 'Omnichannel (iOS/Android/Web)' },
            { name: 'Core Feature Modules', basic: 'Up to 5 modules', advanced: 'Up to 15 modules', custom: 'Unlimited Complex Modules' },
            { name: 'Deployment Timeline', basic: '3-4 weeks', advanced: '6-8 weeks', custom: 'Agile Sprints' }
          ]
        },
        {
          category: 'Architecture & Features',
          features: [
            { name: 'User Authentication & Role Control', basic: true, advanced: true, custom: true },
            { name: 'Cloud Database & Storage (AWS/Firebase)', basic: true, advanced: true, custom: true },
            { name: 'Push Notifications & Webhooks', basic: false, advanced: true, custom: true },
            { name: 'In-App Purchases & Stripe Subscriptions', basic: false, advanced: true, custom: true },
            { name: 'Real-Time WebSockets Sync & Chat', basic: false, advanced: false, custom: true }
          ]
        },
        {
          category: 'Store Publishing & Devops',
          features: [
            { name: 'Apple App Store & Google Play Submission', basic: false, advanced: true, custom: true },
            { name: 'Automated CI/CD Pipeline', basic: false, advanced: true, custom: true },
            { name: 'Security Audit & OWASP Compliance', basic: false, advanced: false, custom: true }
          ]
        },
        {
          category: 'Maintenance & Guarantee',
          features: [
            { name: 'Free Maintenance & Bug Fixes', basic: '30 days', advanced: '90 days', custom: '365 days' },
            { name: 'Dedicated Lead Engineer', basic: false, advanced: true, custom: true },
            { name: 'Source Code & IP Full Ownership', basic: true, advanced: true, custom: true }
          ]
        }
      ]
    },
    features: [
      {
        icon: '📱',
        title: 'Cross-Platform Mastery',
        desc: 'Single codebase solutions for iOS and Android that deliver true 60fps native performance.'
      },
      {
        icon: '☁️',
        title: 'Serverless Cloud APIs',
        desc: 'Resilient backend microservices with automatic horizontal scaling and 99.99% uptime guarantees.'
      },
      {
        icon: '🔄',
        title: 'Real-Time Data Sync',
        desc: 'Sub-millisecond socket communication for chat, feeds, live notifications, and collaborative workflows.'
      },
      {
        icon: '🧪',
        title: 'Automated CI/CD Testing',
        desc: 'Zero-regression releases backed by unit tests, integration suites, and over-the-air hotfixes.'
      }
    ],
    techStack: ['React Native', 'Flutter', 'Node.js', 'Python', 'Redis', 'Docker'],
    faqs: [
      {
        q: 'Do you build for both iOS and Android?',
        a: 'Yes, we specialize in cross-platform development with React Native and Flutter, ensuring simultaneous releases on Apple App Store and Google Play.'
      },
      {
        q: 'Can you integrate third-party APIs and payment gateways?',
        a: 'Yes, we integrate Stripe, PayPal, Razorpay, Apple Pay, Google Pay, mapping APIs, push notifications, and custom ERPs.'
      },
      {
        q: 'Who owns the intellectual property and code?',
        a: 'You own 100% of the source code, design files, and IP rights upon project completion.'
      }
    ]
  },

  'google-ads-meta-ads': {
    id: 3,
    slug: 'google-ads-meta-ads',
    category: 'Marketing & Growth',
    titleLine1: 'Google &',
    titleLine2: 'Meta Ads',
    subtitle: 'A perfect guide to hyper-targeted advertising that maximizes ROI and scales customer acquisition.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Average ROI',
    badgeValue: '4.8x Return',
    badgeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    statCount: '$15M',
    statLabel: 'Ad spend scaled',
    avatars: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Audience Audit' },
      { x: 260, y: 220, label: 'Creative Testing' },
      { x: 500, y: 110, label: 'Revenue 5x Scale' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Audience Audit to',
      titleHighlight: 'Peak ROAS',
      subtitle: 'A data-driven methodology designed to eliminate ad waste and maximize qualified conversions.',
      steps: [
        {
          step: 1,
          title: 'Audience & Funnel Audit',
          desc: 'Deep analysis of historical ad spend, high-intent keywords, and competitor tactics.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'Creative Strategy',
          desc: 'Developing scroll-stopping ad angles, high-converting visual assets, and persuasive copy.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Campaign Setup',
          desc: 'Deploying structured ad sets, CAPI tracking, and algorithmic smart bidding.',
          icon: 'code'
        },
        {
          step: 4,
          title: 'Multivariate Testing',
          desc: 'Continuous A/B testing of creatives, landing pages, and audience cohorts.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Scale & Attribution',
          desc: 'Budget scaling on proven winning ad sets with real-time ROAS dashboards.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'Paid Ads Management Pricing',
      subheadline: 'Transparent management fees paired with precision media buying to generate maximum ROAS.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$599',
          period: '/month',
          desc: 'Ideal for local businesses or initial campaign validation on a single network.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$1,499',
          period: '/month',
          desc: 'Omnichannel scaling across Google & Meta with conversion API and weekly creative refreshes.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'High-growth enterprise ad spend ($50k+/mo) with dedicated media buyers and custom video production.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Channels & Ad Spend',
          features: [
            { name: 'Ad Platforms Managed', basic: '1 (Google OR Meta)', advanced: '2 (Google + Meta)', custom: 'Omnichannel (Google/Meta/TikTok/YT)' },
            { name: 'Ad Spend Capacity Covered', basic: 'Up to $3,000/mo', advanced: 'Up to $20,000/mo', custom: '$50,000+/mo Unlimited' },
            { name: 'Campaign Setups & Restructuring', basic: 'Up to 2 funnels', advanced: 'Up to 6 funnels', custom: 'Unlimited Full Funnels' }
          ]
        },
        {
          category: 'Creative Production & Copy',
          features: [
            { name: 'High-Converting Copywriting', basic: true, advanced: true, custom: true },
            { name: 'Ad Static Creatives / Carousel Sets', basic: '4 sets/month', advanced: '12 sets/month', custom: '30+ sets/month' },
            { name: 'Short-Form Motion / UGC Ad Assets', basic: false, advanced: true, custom: true },
            { name: 'A/B Creative Hook Testing', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'Tracking & Tracking Hygiene',
          features: [
            { name: 'Conversion API (CAPI) & Server-Side Tracking', basic: false, advanced: true, custom: true },
            { name: 'Google Tag Manager & Enhanced Conversions', basic: true, advanced: true, custom: true },
            { name: 'Live 24/7 Looker Studio Reporting Board', basic: true, advanced: true, custom: true }
          ]
        },
        {
          category: 'Reporting & Strategy',
          features: [
            { name: 'Strategic Review Calls', basic: 'Monthly', advanced: 'Bi-Weekly', custom: 'Weekly / Dedicated Slack' },
            { name: 'Dedicated Senior Media Buyer', basic: false, advanced: true, custom: true },
            { name: 'No Long-Term Lock-in (Cancel Anytime)', basic: true, advanced: true, custom: true }
          ]
        }
      ]
    },
    features: [
      {
        icon: '🎯',
        title: 'High-Intent Targeting',
        desc: 'Reach customers actively searching for your solutions with keyword clusters and behavioral signals.'
      },
      {
        icon: '🎨',
        title: 'Creative Ad Design',
        desc: 'Scroll-stopping video and graphic assets tailored for Instagram, TikTok, Facebook, and YouTube.'
      },
      {
        icon: '📊',
        title: 'Granular Attribution',
        desc: 'Custom server-side tracking (CAPI) and Google Tag Manager setups to prevent data loss from ad blockers.'
      },
      {
        icon: '💰',
        title: 'Continuous Bid Optimization',
        desc: 'Algorithmic ROAS bidding to lower cost-per-acquisition (CPA) and boost profit margins.'
      }
    ],
    techStack: ['Google Ads', 'Meta Ads Manager', 'GA4', 'Looker Studio', 'AppsFlyer', 'Stripe'],
    faqs: [
      {
        q: 'What budget do I need to start advertising?',
        a: 'We work with budgets starting from $1,000/month up to enterprise budgets of $100k+/month.'
      },
      {
        q: 'How fast do we see results with paid ads?',
        a: 'Paid ads generate immediate traffic. Once initial testing concludes (typically 7-14 days), we optimize campaigns for sustainable profitability.'
      },
      {
        q: 'Do you create the ad copy and visuals?',
        a: 'Yes, our creative team handles copywriting, graphic design, and video editing from start to finish.'
      }
    ]
  },

  'ui-ux-design': {
    id: 4,
    slug: 'ui-ux-design',
    category: 'Design & Creative',
    titleLine1: 'UI & UX',
    titleLine2: 'Design',
    subtitle: 'A perfect guide to intuitive, human-centered interfaces that captivate users and elevate brand perception.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'User Retention',
    badgeValue: '+92% Boost',
    badgeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    statCount: '350+',
    statLabel: 'Interfaces crafted',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Empathy Research' },
      { x: 260, y: 220, label: 'Figma Prototype' },
      { x: 500, y: 110, label: 'Design System' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From User Insights to',
      titleHighlight: 'Pixel Perfection',
      subtitle: 'Human-centered design process transforming complex ideas into intuitive digital products.',
      steps: [
        {
          step: 1,
          title: 'Discovery & Research',
          desc: 'Stakeholder interviews, empathy mapping, and user persona research.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'Wireframing & Flow',
          desc: 'User journey mapping, wireframing, and low-fidelity navigation flows.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Design System',
          desc: 'Building cohesive component libraries, design tokens, and typography.',
          icon: 'layers'
        },
        {
          step: 4,
          title: 'Usability Testing',
          desc: 'High-fidelity interactive prototypes tested with real users for feedback.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Developer Handoff',
          desc: 'Pixel-perfect Figma documentation, asset specs, and design QA.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'UI/UX Design Pricing',
      subheadline: 'Craft exceptional digital interfaces that engage users and convert visitors into lifelong advocates.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$799',
          period: 'one-time',
          desc: 'Design overhaul for a high-converting landing page or key application flow.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$1,999',
          period: 'one-time',
          desc: 'Comprehensive end-to-end product design with clickable prototypes and design token systems.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'Full enterprise design transformation with user research sessions and multi-platform component libraries.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Design Scope',
          features: [
            { name: 'Screens / Views Designed', basic: 'Up to 5 screens', advanced: 'Up to 20 screens', custom: 'Unlimited Screens' },
            { name: 'Wireframing & User Journey Maps', basic: true, advanced: true, custom: true },
            { name: 'Interactive Figma Prototypes', basic: 'Basic Clickable', advanced: 'High-Fidelity Dynamic', custom: 'Full Micro-Interactions' }
          ]
        },
        {
          category: 'Design System & Assets',
          features: [
            { name: 'Responsive Mobile & Tablet Layouts', basic: true, advanced: true, custom: true },
            { name: 'Design Tokens (Colors, Typography, Spacing)', basic: true, advanced: true, custom: true },
            { name: 'Reusable Component Library & Variants', basic: false, advanced: true, custom: true },
            { name: 'Custom Iconography & 3D Visual Assets', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'Research & Developer Handoff',
          features: [
            { name: 'Competitive & Persona UX Research', basic: false, advanced: true, custom: true },
            { name: 'Usability Testing & Feedback Synthesis', basic: false, advanced: false, custom: true },
            { name: 'Developer Handoff Specs & CSS Guides', basic: true, advanced: true, custom: true }
          ]
        },
        {
          category: 'Revisions & Ownership',
          features: [
            { name: 'Design Revision Rounds', basic: '2 rounds', advanced: 'Unlimited rounds', custom: 'Continuous Partnership' },
            { name: '100% Figma Source File Ownership', basic: true, advanced: true, custom: true },
            { name: 'Front-End Team Implementation Support', basic: '7 days', advanced: '30 days', custom: 'Full Sprint Alignment' }
          ]
        }
      ]
    },
    features: [
      {
        icon: '🔍',
        title: 'Deep User Research',
        desc: 'Uncovering friction points and psychological motivations through usability tests and user interviews.'
      },
      {
        icon: '📐',
        title: 'Pixel-Perfect Wireframes',
        desc: 'Low-to-high fidelity interactive prototypes in Figma for rapid feedback and frictionless developer handoff.'
      },
      {
        icon: '🎨',
        title: 'Scalable Design Systems',
        desc: 'Comprehensive UI kits with typography, tokens, components, and auto-layout guidelines.'
      },
      {
        icon: '✨',
        title: 'Micro-Interactions',
        desc: 'Delightful fluid animations and tactile feedback that turn mundane actions into memorable experiences.'
      }
    ],
    techStack: ['Figma', 'FigJam', 'Principle', 'Spline 3D', 'Adobe Creative Cloud', 'Lottie'],
    faqs: [
      {
        q: 'What deliverables do you provide?',
        a: 'You receive complete Figma files with organized components, style guides, interactive prototypes, and developer specs.'
      },
      {
        q: 'Can you redesign our existing app or website?',
        a: 'Yes, we conduct UX audits of existing products, identify drop-off bottlenecks, and modernize the visual aesthetic.'
      },
      {
        q: 'How do you collaborate with our engineering team?',
        a: 'We use tokenized variables, responsive auto-layouts, and detailed documentation to make developer implementation effortless.'
      }
    ]
  },

  'local-seo': {
    id: 5,
    slug: 'local-seo',
    category: 'Marketing & Growth',
    titleLine1: 'Local SEO &',
    titleLine2: 'Optimization',
    subtitle: 'A perfect guide to dominating local search rankings, Google Maps, and driving high-intent local foot traffic.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Map Rankings',
    badgeValue: 'Top 3 Google Pack',
    badgeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    statCount: '10k+',
    statLabel: 'Local leads created',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'GMB Audit' },
      { x: 260, y: 220, label: 'NAP Citations' },
      { x: 500, y: 110, label: 'Rank #1 Pack' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Local Audit to',
      titleHighlight: 'Top 3 Map Pack',
      subtitle: 'Systematic local search optimization to dominate your immediate service radius and drive calls.',
      steps: [
        {
          step: 1,
          title: 'Local Footprint Audit',
          desc: 'Geo-grid ranking scans, GBP health check, and citation gap analysis.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'Profile Optimization',
          desc: 'Calibrating categories, geo-tagged photography, services, and local keywords.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Citation & NAP Sync',
          desc: 'Synchronizing Name, Address, and Phone across 50+ tier-1 directories.',
          icon: 'code'
        },
        {
          step: 4,
          title: 'Review Engine',
          desc: 'Deploying automated review collection workflows to accelerate 5-star ratings.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Geo-Grid Dominance',
          desc: 'Local link building, weekly GBP posts, and multi-mile radius expansion.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'Local SEO & Maps Pricing',
      subheadline: 'Capture high-intent nearby customers searching on Google Maps and organic local queries.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$399',
          period: '/month',
          desc: 'Single-location optimization to claim, audit, and rank your primary Google profile.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$899',
          period: '/month',
          desc: 'Aggressive ranking engine with continuous citation building, review funnel, and geo-grid tracking.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'Multi-location franchise dominance covering regional markets and automated reputation management.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Location Scope & Setup',
          features: [
            { name: 'Locations Managed', basic: '1 Location', advanced: 'Up to 3 Locations', custom: 'Unlimited Multi-Location' },
            { name: 'Google Business Profile 100% Audit', basic: true, advanced: true, custom: true },
            { name: 'Local Keyword Geo-Research', basic: '15 Keywords', advanced: '50 Keywords', custom: '150+ Keywords' }
          ]
        },
        {
          category: 'Citation & Reputation Engine',
          features: [
            { name: 'Monthly Directory Citations (Yelp, Apple, etc.)', basic: '15 citations', advanced: '40 citations', custom: '100+ Premium Citations' },
            { name: 'NAP Consistency Cleanup & Fixing', basic: true, advanced: true, custom: true },
            { name: 'Automated 5-Star Review Generation Funnel', basic: false, advanced: true, custom: true },
            { name: 'Spam Competitor Removal & Fighting', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'Content & Geo-Targeting',
          features: [
            { name: 'Local SEO Landing Page Optimization', basic: '1 Page', advanced: '3 Pages', custom: '10+ Service Pages' },
            { name: 'Google Post Updates & Image Geo-Tagging', basic: '2 Posts/mo', advanced: '6 Posts/mo', custom: 'Weekly Dynamic Posts' },
            { name: 'Local Schema Markup Structured Data', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'Tracking & Reporting',
          features: [
            { name: 'Geo-Grid Visibility Heatmap Reports', basic: 'Monthly', advanced: 'Bi-Weekly', custom: 'Real-Time Dashboard' },
            { name: 'Call & Direction Request Tracking', basic: true, advanced: true, custom: true },
            { name: 'Dedicated Local SEO Specialist', basic: false, advanced: true, custom: true }
          ]
        }
      ]
    },
    features: [
      {
        icon: '📍',
        title: 'Google Profile Optimization',
        desc: 'Complete optimization of your Google Business Profile with secondary categories, geotags, and attributes.'
      },
      {
        icon: '🌐',
        title: 'Consistent Citations',
        desc: 'Synchronized Name, Address, and Phone (NAP) citations across Yelp, Apple Maps, Bing, and industry directories.'
      },
      {
        icon: '⭐',
        title: 'Review Acceleration',
        desc: 'Automated SMS and email workflows to collect authentic 5-star reviews and boost local trust rank.'
      },
      {
        icon: '🗺️',
        title: 'Geo-Grid Tracking',
        desc: 'Pinpoint visibility heatmaps tracking exactly where your business ranks across your entire service territory.'
      }
    ],
    techStack: ['Google Business Profile', 'BrightLocal', 'Semrush', 'Whitespark', 'Ahrefs', 'Google Search Console'],
    faqs: [
      {
        q: 'Why is Local SEO important for my business?',
        a: 'Over 80% of local searches lead to direct calls or visits within 24 hours. Ranking in the Google 3-Pack captures ready-to-buy customers.'
      },
      {
        q: 'How long does it take to rank in Google Maps?',
        a: 'Noticeable rank improvements generally appear within 30 to 60 days as citation networks index and reviews grow.'
      },
      {
        q: 'Do you help remove spammy competitor listings?',
        a: 'Yes, we perform Google Maps spam fighting to remove fake competitors and reclaim your rightful top position.'
      }
    ]
  },

  'digital-marketing': {
    id: 6,
    slug: 'digital-marketing',
    category: 'Marketing & Growth',
    titleLine1: 'Digital &',
    titleLine2: 'Marketing',
    subtitle: 'A perfect guide to full-funnel digital marketing strategies that compound authority, traffic, and revenue.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Organic Growth',
    badgeValue: '3.5x Traffic Surge',
    badgeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    statCount: '1M+',
    statLabel: 'People have explored',
    avatars: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Market Strategy' },
      { x: 260, y: 220, label: 'Content Engine' },
      { x: 500, y: 110, label: 'Omnichannel Scale' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Full-Funnel Strategy to',
      titleHighlight: 'Revenue Scale',
      subtitle: 'Integrated omnichannel campaigns driving sustainable brand authority, traffic, and retention.',
      steps: [
        {
          step: 1,
          title: 'Market Discovery',
          desc: 'Evaluating customer acquisition costs, conversion drop-offs, and channel economics.',
          icon: 'search'
        },
        {
          step: 2,
          title: 'Omnichannel Strategy',
          desc: 'Designing unified messaging across search, social, content, and email touchpoints.',
          icon: 'design'
        },
        {
          step: 3,
          title: 'Funnel Engineering',
          desc: 'Crafting high-converting landing pages, lead magnets, and automated nurture sequences.',
          icon: 'code'
        },
        {
          step: 4,
          title: 'Performance Testing',
          desc: 'Continuous conversion rate optimization (CRO) and attribution modeling.',
          icon: 'testing'
        },
        {
          step: 5,
          title: 'Revenue Scaling',
          desc: 'Aggressively scaling top-performing channels with executive revenue reporting.',
          icon: 'rocket'
        }
      ]
    },
    pricing: {
      headline: 'Digital Marketing Growth Pricing',
      subheadline: 'Multi-channel marketing campaigns engineered to compound brand reach, pipeline, and sales.',
      packages: [
        {
          id: 'basic',
          name: 'Basic Package',
          badge: null,
          price: '$699',
          period: '/month',
          desc: 'Essential content engine and SEO foundations to start gaining organic market momentum.',
          btnText: 'Start Basic',
          btnStyle: 'outline'
        },
        {
          id: 'advanced',
          name: 'Advanced Package',
          badge: 'Most Popular',
          price: '$1,799',
          period: '/month',
          desc: 'Full omnichannel execution across content, search engine optimization, and email funnels.',
          btnText: 'Choose Advanced',
          btnStyle: 'gradient'
        },
        {
          id: 'custom',
          name: 'Custom Package',
          badge: null,
          price: 'Custom',
          period: 'tailored scope',
          desc: 'Dedicated outsourced marketing department with executive CMO guidance and PR campaigns.',
          btnText: 'Go Custom',
          btnStyle: 'solid'
        }
      ],
      featureCategories: [
        {
          category: 'Strategy & Channels',
          features: [
            { name: 'Core Marketing Channels', basic: '2 Channels', advanced: '4 Channels', custom: 'All Omnichannel' },
            { name: 'Custom Quarterly Growth Roadmap', basic: true, advanced: true, custom: true },
            { name: 'Audience Persona & Competitor Research', basic: true, advanced: true, custom: true }
          ]
        },
        {
          category: 'Content & Inbound Engine',
          features: [
            { name: 'SEO Long-Form Articles / Guides', basic: '2 Articles/mo', advanced: '6 Articles/mo', custom: '16+ Articles/mo' },
            { name: 'Social Media Posts & Graphics', basic: '8 Posts/mo', advanced: '20 Posts/mo', custom: 'Daily Multi-Platform' },
            { name: 'Lead Magnets / Whitepapers / Case Studies', basic: false, advanced: true, custom: true },
            { name: 'Email Newsletter & Automation Sequences', basic: false, advanced: true, custom: true }
          ]
        },
        {
          category: 'Organic SEO & Authority',
          features: [
            { name: 'Technical SEO Audits & Fixes', basic: true, advanced: true, custom: true },
            { name: 'High-Authority Backlink Acquisition', basic: '2 Links/mo', advanced: '6 Links/mo', custom: '15+ Tier-1 Links/mo' },
            { name: 'Digital PR & Journalist Pitching', basic: false, advanced: false, custom: true }
          ]
        },
        {
          category: 'Strategy & Reviews',
          features: [
            { name: 'KPI Performance Review Calls', basic: 'Monthly', advanced: 'Bi-Weekly', custom: 'Weekly Executive Call' },
            { name: 'Dedicated Growth Strategist', basic: false, advanced: true, custom: true },
            { name: '24/7 Real-Time Analytics Portal', basic: true, advanced: true, custom: true }
          ]
        }
      ]
    },
    features: [
      {
        icon: '📢',
        title: 'Omnichannel Growth',
        desc: 'Coordinated marketing across organic search, social channels, email newsletters, and content distribution.'
      },
      {
        icon: '✍️',
        title: 'Authority Content Strategy',
        desc: 'Thought leadership articles, whitepapers, and guides that establish your brand as the definitive industry authority.'
      },
      {
        icon: '📧',
        title: 'Lifecycle Email Funnels',
        desc: 'Automated nurture sequences that re-engage leads, upsell clients, and minimize customer churn.'
      },
      {
        icon: '📈',
        title: 'Growth Analytics & KPI Audits',
        desc: 'Clear visual reports connecting marketing metrics directly to sales pipeline and customer lifetime value (LTV).'
      }
    ],
    techStack: ['HubSpot', 'Mailchimp', 'Semrush', 'Hootsuite', 'Google Analytics 4', 'Klaviyo'],
    faqs: [
      {
        q: 'What channels does your digital marketing cover?',
        a: 'We manage Content Marketing, Search Engine Optimization (SEO), Email Automation, Social Media Growth, and Conversion Rate Optimization.'
      },
      {
        q: 'Do you create custom marketing strategies or use templates?',
        a: 'Every strategy is 100% custom-tailored to your industry, target audience demographics, competitive landscape, and revenue goals.'
      },
      {
        q: 'How frequently will I receive performance reports?',
        a: 'You receive weekly KPI snapshot updates, monthly deep-dive review calls, and 24/7 access to live reporting dashboards.'
      }
    ]
  },

  'branding-identity': {
    id: 7,
    slug: 'branding-identity',
    category: 'Design & Creative',
    titleLine1: 'Branding &',
    titleLine2: 'Visual Identity',
    subtitle: 'A strategic, memorable brand identity system engineered to command market authority.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Brand Authority',
    badgeValue: 'Top 5% Visuals',
    badgeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    statCount: '180+',
    statLabel: 'Brands built',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Visual Positioning' },
      { x: 260, y: 220, label: 'Identity Matrix' },
      { x: 500, y: 110, label: 'Brand Guidelines' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Core Values to',
      titleHighlight: 'Visual Iconography',
      subtitle: 'A structured brand strategy transforming market insights into iconic visual identities.',
      steps: [
        { step: 1, title: 'Brand Discovery', desc: 'Market positioning, competitor mapping, and brand archetypes.', icon: 'search' },
        { step: 2, title: 'Concept Directions', desc: 'Exploring 3 distinct moodboards, typography, and logo directions.', icon: 'design' },
        { step: 3, title: 'Identity Refinement', desc: 'Vector logo craft, color harmony, and accessibility testing.', icon: 'layers' },
        { step: 4, title: 'Brand Book', desc: 'Complete brand guidelines, usage rules, and typography hierarchy.', icon: 'testing' },
        { step: 5, title: 'Asset Package', desc: 'Vector exports, social media templates, and marketing collateral.', icon: 'rocket' },
      ],
    },
    pricing: {
      headline: 'Branding & Identity Pricing',
      subheadline: 'Transparent investment tiers to build an unmistakable market presence from seed to enterprise.',
      packages: [
        { id: 'basic', name: 'Starter Identity', badge: null, price: '$799', period: 'one-time', desc: 'Primary logo, color palette, and essential typography rules.', btnText: 'Choose Starter', btnStyle: 'outline' },
        { id: 'advanced', name: 'Complete Brand System', badge: 'Most Popular', price: '$1,899', period: 'one-time', desc: 'Full logo suite, comprehensive 40-page brand guide, and social design kit.', btnText: 'Choose Complete', btnStyle: 'gradient' },
        { id: 'custom', name: 'Enterprise Rebrand', badge: null, price: 'Custom', period: 'tailored', desc: 'End-to-end organizational rebranding with patent-ready vector identity systems.', btnText: 'Go Custom', btnStyle: 'solid' },
      ],
      featureCategories: [
        {
          category: 'Brand Deliverables',
          features: [
            { name: 'Logo Variations (Primary, Secondary, Monogram)', basic: true, advanced: true, custom: true },
            { name: 'Color Palette & Typography Specs', basic: true, advanced: true, custom: true },
            { name: 'Comprehensive Brand Style Guide', basic: false, advanced: true, custom: true },
            { name: 'Social Media Kit & Stationery Assets', basic: false, advanced: true, custom: true },
          ],
        },
      ],
    },
    features: [
      { icon: '🎯', title: 'Distinct Market Positioning', desc: 'Visual identity rooted in deep competitor analysis so your business stands out effortlessly.' },
      { icon: '📐', title: 'Mathematical Precision', desc: 'Logos engineered on geometric grids with vector precision across all print and screen sizes.' },
      { icon: '🎨', title: 'Holistic Design System', desc: 'Accessible color palettes, scalable typography scales, and cohesive iconography rules.' },
      { icon: '📦', title: 'Production-Ready Handoff', desc: 'Fully organized vector exports (SVG, EPS, AI, PNG) ready for billboards, merch, and screens.' },
    ],
    techStack: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Brandpad', 'FontBase'],
    faqs: [
      { q: 'Who owns the final brand copyrights?', a: 'You own 100% full intellectual property and commercial copyright to all deliverables.' },
      { q: 'How many logo concepts do you present?', a: 'We develop and present 3 distinctly curated creative directions with real-world mockups.' },
      { q: 'What is the turnaround time for a complete rebrand?', a: 'Starter packages take 1-2 weeks; full brand systems take 2-4 weeks.' },
    ],
  },

  'creative-design': {
    id: 8,
    slug: 'creative-design',
    category: 'Design & Creative',
    titleLine1: 'Creative Design &',
    titleLine2: 'Media Assets',
    subtitle: 'High-impact 3D visual assets, marketing graphics, animations and creative collateral.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'Visual Impact',
    badgeValue: '4x Click-Through',
    badgeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    statCount: '1,200+',
    statLabel: 'Assets produced',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: '3D Modeling' },
      { x: 260, y: 220, label: 'Motion Graphics' },
      { x: 500, y: 110, label: 'Marketing Collateral' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Raw Ideas to',
      titleHighlight: 'Captivating Media',
      subtitle: 'Creative production workflow delivering world-class visual assets at sprint velocity.',
      steps: [
        { step: 1, title: 'Creative Brief', desc: 'Asset requirements, visual aesthetic targets, and distribution channels.', icon: 'search' },
        { step: 2, title: 'Concept Sketches', desc: 'Storyboards, 3D clay renders, and composition drafts.', icon: 'design' },
        { step: 3, title: 'Production Sprint', desc: 'High-resolution rendering, texturing, lighting, and vector illustration.', icon: 'layers' },
        { step: 4, title: 'Cross-Device Polish', desc: 'Compression audits, color grading, and responsive formats.', icon: 'testing' },
        { step: 5, title: 'Final Delivery', desc: 'Packaged 4K renders, WebP/SVG web assets, and source files.', icon: 'rocket' },
      ],
    },
    pricing: {
      headline: 'Creative Design & Media Pricing',
      subheadline: 'Select the creative package suited to your campaign milestones and monthly collateral needs.',
      packages: [
        { id: 'basic', name: 'Campaign Starter', badge: null, price: '$599', period: 'one-time', desc: 'Up to 5 custom campaign creatives, ad banners, and social posts.', btnText: 'Choose Starter', btnStyle: 'outline' },
        { id: 'advanced', name: 'Creative Powerhouse', badge: 'Most Popular', price: '$1,499', period: 'one-time', desc: 'Full campaign suite: 15 creatives, 3D asset renders, and motion graphics.', btnText: 'Choose Powerhouse', btnStyle: 'gradient' },
        { id: 'custom', name: 'Dedicated Studio', badge: null, price: 'Custom', period: 'retainer', desc: 'Full-time senior art director and dedicated creative team on monthly retainer.', btnText: 'Hire Studio', btnStyle: 'solid' },
      ],
      featureCategories: [
        {
          category: 'Creative Production',
          features: [
            { name: 'Social Media & Ad Creative Suites', basic: '5 Assets', advanced: '15 Assets', custom: 'Unlimited' },
            { name: '3D Product Modeling & Lighting', basic: false, advanced: true, custom: true },
            { name: 'Lottie Micro-Animations & Motion Renders', basic: false, advanced: true, custom: true },
            { name: 'Print Collateral & Pitch Deck Design', basic: false, advanced: true, custom: true },
          ],
        },
      ],
    },
    features: [
      { icon: '✨', title: 'Scroll-Stopping Visuals', desc: 'Custom 3D renders and bespoke illustrations crafted to maximize dwell time.' },
      { icon: '🎬', title: 'Motion & Micro-Interactions', desc: 'Lightweight Lottie and MP4 motion graphics that breathe life into interfaces.' },
      { icon: '⚡', title: 'Rapid Creative Delivery', desc: 'Structured feedback loops and sprint-based deliveries to meet marketing deadlines.' },
      { icon: '📐', title: 'Multi-Format Adaptability', desc: 'Assets generated for 16:9, 1:1, 9:16 and 4:5 ratios across all social and ad networks.' },
    ],
    techStack: ['Blender', 'Cinema 4D', 'After Effects', 'Figma', 'Photoshop'],
    faqs: [
      { q: 'Can you match our existing brand visual style?', a: 'Yes! We rigorously audit your brand book and deliver assets matching your exact aesthetic.' },
      { q: 'What file formats are provided?', a: 'We export high-res PNG, WebP, vector SVG, Lottie JSON, and complete native source files.' },
      { q: 'Do you offer monthly creative retainers?', a: 'Yes, our Creative Studio retainer provides continuous on-demand design support.' },
    ],
  },

  'custom-software': {
    id: 9,
    slug: 'custom-software',
    category: 'Development & Digital Products',
    titleLine1: 'Custom Software &',
    titleLine2: 'Cloud Architecture',
    subtitle: 'Bespoke enterprise software, scalable APIs, microservices and automated digital infrastructure.',
    ctaText: 'BOOK NOW',
    badgeTitle: 'System Uptime',
    badgeValue: '99.99% SLA',
    badgeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    statCount: '12M+',
    statLabel: 'API requests/day',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
    ],
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop',
    pins: [
      { x: 30, y: 350, label: 'Cloud Architecture' },
      { x: 260, y: 220, label: 'API Microservices' },
      { x: 500, y: 110, label: 'Database Sharding' },
    ],
    workflow: {
      tag: 'WORKFLOW',
      titlePrefix: 'From Technical Blueprint to',
      titleHighlight: 'Fault-Tolerant Engine',
      subtitle: 'Rigorous engineering lifecycle ensuring bank-grade security, scalability, and clean modular code.',
      steps: [
        { step: 1, title: 'Architecture Scoping', desc: 'System requirements, data modeling, throughput targets, and security protocols.', icon: 'search' },
        { step: 2, title: 'Schema & API Specs', desc: 'OpenAPI documentation, database normalization, and auth token architecture.', icon: 'design' },
        { step: 3, title: 'Core Development', desc: 'Scalable backend microservices, async queue workers, and third-party integrations.', icon: 'code' },
        { step: 4, title: 'Security & Penetration', desc: 'Load testing to 50k req/sec, vulnerability scans, and automated unit test suites.', icon: 'testing' },
        { step: 5, title: 'CI/CD Cloud Deploy', desc: 'Automated Kubernetes / Docker deployment on AWS/GCP with auto-scaling & 24/7 alerts.', icon: 'rocket' },
      ],
    },
    pricing: {
      headline: 'Custom Software Pricing',
      subheadline: 'Predictable milestones and sprint-based pricing for mission-critical enterprise systems.',
      packages: [
        { id: 'basic', name: 'API Microservice', badge: null, price: '$1,999', period: 'one-time', desc: 'Custom REST API service with database integration, auth, and documentation.', btnText: 'Start Microservice', btnStyle: 'outline' },
        { id: 'advanced', name: 'Full-Stack Software MVP', badge: 'Most Popular', price: '$4,999', period: 'one-time', desc: 'Complete web software system with admin portal, payment billing, and automated worker queues.', btnText: 'Build Software', btnStyle: 'gradient' },
        { id: 'custom', name: 'Enterprise Cloud System', badge: null, price: 'Custom', period: 'dedicated team', desc: 'High-concurrency distributed software platform with custom microservices and 99.99% uptime.', btnText: 'Architect Enterprise', btnStyle: 'solid' },
      ],
      featureCategories: [
        {
          category: 'Architecture & Scalability',
          features: [
            { name: 'REST & GraphQL API Endpoints', basic: 'Up to 10', advanced: 'Up to 35', custom: 'Unlimited' },
            { name: 'Database Architecture (PostgreSQL/MongoDB)', basic: true, advanced: true, custom: true },
            { name: 'Role-Based Access Control (RBAC) & OAuth2', basic: true, advanced: true, custom: true },
            { name: 'Background Workers & Redis Queues', basic: false, advanced: true, custom: true },
            { name: 'Automated CI/CD Pipeline & Dockerization', basic: false, advanced: true, custom: true },
          ],
        },
      ],
    },
    features: [
      { icon: '⚡', title: 'Sub-50ms API Latency', desc: 'Optimized database queries, Redis caching, and connection pooling for blazing performance.' },
      { icon: '🔒', title: 'Zero-Trust Security', desc: 'JWT/OAuth2 auth, bcrypt hashing, rate limiting, and automated OWASP top-10 defenses.' },
      { icon: '☁️', title: 'Auto-Scaling Infrastructure', desc: 'Containerized Docker/Kubernetes architecture ready to handle 10x traffic surges.' },
      { icon: '📊', title: 'Real-Time Observability', desc: 'Integrated logging, distributed tracing, and automated health alert webhooks.' },
    ],
    techStack: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    faqs: [
      { q: 'How do you handle data migration from legacy software?', a: 'We build automated migration scripts with checksum validation to ensure zero data loss.' },
      { q: 'Do you provide API documentation for third-party developers?', a: 'Yes, every project includes interactive Swagger / OpenAPI interactive documentation.' },
      { q: 'Who owns the infrastructure and code repositories?', a: 'You maintain 100% full ownership of all source code, git repositories, and cloud accounts.' },
    ],
  }
};
