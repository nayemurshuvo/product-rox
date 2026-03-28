/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        success: '#27ae60',
        warning: '#ffd666',
        error: '#ff4d4f',
      },
      spacing: {
        xs: '12px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
