import { Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#060b12] border-t
      border-white/[0.05] py-8 px-6">
      <div className="max-w-6xl mx-auto flex
        flex-col md:flex-row items-center
        justify-between gap-6">

        <div className="flex flex-col items-center
          md:items-start gap-1">
          <span className="font-mono font-semibold
            text-teal-400 text-sm">
            // haroon.dev
          </span>
          <span className="text-xs text-gray-500">
            Full-Stack Engineer & AI Integrator
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a href="https://github.com/haroon7890"
            target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-teal-400
            transition-colors duration-200">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.54 1.08 1.54 1.08.9 1.58 2.36 1.12 2.93.85.09-.67.35-1.12.64-1.37-2.22-.26-4.56-1.15-4.56-5.11 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.06A9.35 9.35 0 0 1 12 7.4c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.06 2.74-1.06.56 1.43.21 2.49.11 2.75.64.72 1.03 1.64 1.03 2.77 0 3.97-2.34 4.85-4.57 5.11.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.5A10.22 10.22 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/haroon-imran"
            target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-teal-400
            transition-colors duration-200">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5a2 2 0 0 0-2 2v14c0 1.11.89 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.66V9.4h2.68V18ZM7 8.2a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.18c0-.99-.02-2.27-1.39-2.27-1.39 0-1.6 1.09-1.6 2.2V18H9.99V9.4h2.56v1.17h.04c.36-.68 1.23-1.39 2.53-1.39 2.71 0 3.22 1.79 3.22 4.11V18Z" />
            </svg>
          </a>
          <a href="mailto:haroon@example.com"
            className="text-gray-500 hover:text-teal-400
            transition-colors duration-200">
            <Mail size={18}/>
          </a>
        </div>

        <div className="flex flex-col items-center
          md:items-end gap-1">
          <span className="text-xs text-gray-500">
            Built with Next.js & Tailwind CSS
          </span>
          <span className="text-xs text-gray-600">
            © 2025 Haroon Imran
          </span>
        </div>

      </div>
    </footer>
  )
}
