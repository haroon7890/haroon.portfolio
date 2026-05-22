export const SITE_CONFIG = {
	name: "Haroon Imran",
	title: "Full-Stack Engineer & AI Integrator",
	email: "haroon86865@gmail.com",
	calendlyUrl: "https://calendly.com/haroon-imran/discovery",
	github: "https://github.com/haroon7890",
	linkedin: "https://linkedin.com/in/haroon-imran",
	upwork: "https://www.upwork.com/freelancers/~0165cde5f92d04caec",
	fiverr: "",
	location: "Lahore, Pakistan",
	timezone: "PKT (UTC+5)",
	available: true,
	responseTime: "2-4 hours",
	
	// Core competencies with years & proficiency
	skills: [
		{ name: "Full-Stack Development", level: "Expert", yearsExp: 4, projects: ["Ride Sharing System", "Supply Chain Management"] },
		{ name: "Next.js & React", level: "Expert", yearsExp: 3, projects: ["Portfolio Site", "Dispatch System Frontend"] },
		{ name: "Node.js & Express", level: "Expert", yearsExp: 3, projects: ["Ride Sharing Backend", "RESTful APIs"] },
		{ name: "C++ & OOP", level: "Advanced", yearsExp: 2, projects: ["Ride Sharing Engine", "Supply Chain Core"] },
		{ name: "TypeScript", level: "Advanced", yearsExp: 2, projects: ["Portfolio", "Type-safe APIs"] },
		{ name: "Database Design (SQL/NoSQL)", level: "Advanced", yearsExp: 3, projects: ["PostgreSQL schemas", "MongoDB patterns"] },
		{ name: "WebSocket & Real-Time", level: "Intermediate", yearsExp: 1, projects: ["Ride Sharing Dispatch"] },
		{ name: "System Design & Architecture", level: "Advanced", yearsExp: 2, projects: ["Scalable dispatch system", "Multi-tenant backends"] },
	],

	certifications: [
		{ 
			name: "Full-Stack Web Development", 
			issuer: "Self-Taught", 
			year: 2024,
			verifiable: true,
			link: "https://github.com/haroon7890/haroon.portfolio",
			badge: "🔗"
		},
		{ 
			name: "Node.js & Express Mastery", 
			issuer: "Udemy", 
			year: 2023,
			verifiable: true,
			credentialId: "node-express-2023",
			badge: "📜"
		},
		{ 
			name: "React Advanced Patterns", 
			issuer: "Frontend Masters", 
			year: 2023,
			verifiable: true,
			link: "https://frontendmasters.com",
			badge: "⭐"
		},
	],

	resources: [
		{ 
			title: "Building Scalable MERN Apps", 
			url: "/blog/scalable-mern-architecture", 
			category: "Tutorial",
			description: "Production patterns for MERN stack",
			externalLink: false
		},
		{ 
			title: "System Design for Dispatch Engines", 
			url: "/blog/system-design-dispatch-engines", 
			category: "Case Study",
			description: "Real-world ride-sharing architecture",
			externalLink: false
		},
		{ 
			title: "Type Safety in TypeScript", 
			url: "/blog/typescript-type-safety", 
			category: "Guide",
			description: "End-to-end type checking best practices",
			externalLink: false
		},
	],

	companies: [
		{ 
			name: "E-commerce Platform", 
			description: "Multi-vendor marketplace (2023-2024)",
			yearsWorked: "1 year",
			impact: "Reduced inventory sync errors by 99.5%"
		},
		{ 
			name: "Logistics Startup", 
			description: "Real-time dispatch system (2022-2024)",
			yearsWorked: "2 years",
			impact: "Optimized routing improved delivery by 35%"
		},
		{ 
			name: "Local Tech Ventures", 
			description: "Web app consulting (2021-present)",
			yearsWorked: "3 years",
			impact: "Mentored 5+ developers on best practices"
		},
	],
} as const;
