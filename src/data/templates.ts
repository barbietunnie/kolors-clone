export interface TemplateColorSlot {
  id: string;
  name: string;
  defaultColor: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  colorSlots: TemplateColorSlot[];
  svgTemplate: string;
  width: number;
  height: number;
}

// Helper to create SVG with color placeholders
// Colors are referenced as {{color1}}, {{color2}}, etc.

export const templates: Template[] = [
  {
    id: 'website-landing',
    name: 'Website Landing',
    description: 'Modern landing page layout',
    category: 'Web',
    width: 400,
    height: 300,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#6366F1' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#8B5CF6' },
      { id: 'accent', name: 'Accent', defaultColor: '#EC4899' },
      { id: 'background', name: 'Background', defaultColor: '#F9FAFB' },
      { id: 'text', name: 'Text', defaultColor: '#1F2937' },
    ],
    svgTemplate: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="400" height="300" fill="{{background}}"/>

      <!-- Header -->
      <rect width="400" height="50" fill="{{primary}}"/>
      <circle cx="30" cy="25" r="12" fill="{{accent}}"/>
      <rect x="300" y="18" width="40" height="14" rx="4" fill="{{secondary}}"/>
      <rect x="350" y="18" width="40" height="14" rx="4" fill="{{accent}}"/>

      <!-- Hero Section -->
      <rect x="30" y="80" width="160" height="20" rx="4" fill="{{text}}"/>
      <rect x="30" y="110" width="120" height="12" rx="3" fill="{{text}}" opacity="0.5"/>
      <rect x="30" y="130" width="140" height="12" rx="3" fill="{{text}}" opacity="0.5"/>
      <rect x="30" y="160" width="80" height="30" rx="6" fill="{{primary}}"/>
      <rect x="120" y="160" width="80" height="30" rx="6" fill="{{secondary}}" opacity="0.3"/>

      <!-- Hero Image Placeholder -->
      <rect x="220" y="70" width="150" height="120" rx="8" fill="{{secondary}}" opacity="0.2"/>
      <circle cx="295" cy="130" r="30" fill="{{accent}}" opacity="0.4"/>

      <!-- Feature Cards -->
      <rect x="30" y="220" width="100" height="60" rx="8" fill="{{primary}}" opacity="0.1"/>
      <rect x="40" y="235" width="30" height="30" rx="6" fill="{{primary}}"/>

      <rect x="150" y="220" width="100" height="60" rx="8" fill="{{secondary}}" opacity="0.1"/>
      <rect x="160" y="235" width="30" height="30" rx="6" fill="{{secondary}}"/>

      <rect x="270" y="220" width="100" height="60" rx="8" fill="{{accent}}" opacity="0.1"/>
      <rect x="280" y="235" width="30" height="30" rx="6" fill="{{accent}}"/>
    </svg>`,
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'iOS-style app interface',
    category: 'Mobile',
    width: 200,
    height: 400,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#3B82F6' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#10B981' },
      { id: 'accent', name: 'Accent', defaultColor: '#F59E0B' },
      { id: 'background', name: 'Background', defaultColor: '#FFFFFF' },
      { id: 'text', name: 'Text', defaultColor: '#111827' },
    ],
    svgTemplate: `<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Phone Frame -->
      <rect width="200" height="400" rx="24" fill="{{text}}"/>
      <rect x="6" y="6" width="188" height="388" rx="20" fill="{{background}}"/>

      <!-- Status Bar -->
      <rect x="70" y="12" width="60" height="6" rx="3" fill="{{text}}" opacity="0.2"/>

      <!-- Header -->
      <rect x="20" y="40" width="80" height="14" rx="4" fill="{{text}}"/>
      <circle cx="170" cy="47" r="14" fill="{{primary}}" opacity="0.2"/>

      <!-- Cards -->
      <rect x="16" y="80" width="168" height="80" rx="12" fill="{{primary}}"/>
      <rect x="28" y="100" width="60" height="8" rx="2" fill="{{background}}" opacity="0.9"/>
      <rect x="28" y="116" width="100" height="20" rx="4" fill="{{background}}" opacity="0.9"/>
      <circle cx="150" cy="120" r="20" fill="{{background}}" opacity="0.3"/>

      <rect x="16" y="172" width="80" height="70" rx="10" fill="{{secondary}}" opacity="0.15"/>
      <rect x="26" y="190" width="40" height="6" rx="2" fill="{{secondary}}"/>
      <rect x="26" y="202" width="60" height="10" rx="2" fill="{{text}}" opacity="0.7"/>

      <rect x="104" y="172" width="80" height="70" rx="10" fill="{{accent}}" opacity="0.15"/>
      <rect x="114" y="190" width="40" height="6" rx="2" fill="{{accent}}"/>
      <rect x="114" y="202" width="60" height="10" rx="2" fill="{{text}}" opacity="0.7"/>

      <!-- List Items -->
      <rect x="16" y="260" width="168" height="40" rx="8" fill="{{text}}" opacity="0.05"/>
      <circle cx="36" cy="280" r="12" fill="{{primary}}" opacity="0.2"/>
      <rect x="56" y="272" width="80" height="6" rx="2" fill="{{text}}" opacity="0.7"/>
      <rect x="56" y="284" width="50" height="4" rx="1" fill="{{text}}" opacity="0.4"/>

      <rect x="16" y="308" width="168" height="40" rx="8" fill="{{text}}" opacity="0.05"/>
      <circle cx="36" cy="328" r="12" fill="{{secondary}}" opacity="0.2"/>
      <rect x="56" y="320" width="80" height="6" rx="2" fill="{{text}}" opacity="0.7"/>
      <rect x="56" y="332" width="50" height="4" rx="1" fill="{{text}}" opacity="0.4"/>

      <!-- Tab Bar -->
      <rect x="6" y="360" width="188" height="34" fill="{{background}}"/>
      <rect x="6" y="360" width="188" height="1" fill="{{text}}" opacity="0.1"/>
      <circle cx="45" cy="377" r="10" fill="{{primary}}"/>
      <circle cx="100" cy="377" r="10" fill="{{text}}" opacity="0.2"/>
      <circle cx="155" cy="377" r="10" fill="{{text}}" opacity="0.2"/>
    </svg>`,
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Professional business card',
    category: 'Print',
    width: 350,
    height: 200,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#1E40AF' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#3B82F6' },
      { id: 'accent', name: 'Accent', defaultColor: '#FBBF24' },
      { id: 'background', name: 'Background', defaultColor: '#FFFFFF' },
      { id: 'text', name: 'Text', defaultColor: '#1F2937' },
    ],
    svgTemplate: `<svg viewBox="0 0 350 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Card Background -->
      <rect width="350" height="200" rx="8" fill="{{background}}"/>

      <!-- Decorative Element -->
      <path d="M0 0 L120 0 L0 120 Z" fill="{{primary}}"/>
      <path d="M0 0 L80 0 L0 80 Z" fill="{{secondary}}"/>

      <!-- Logo Area -->
      <circle cx="45" cy="45" r="20" fill="{{accent}}"/>

      <!-- Name & Title -->
      <rect x="140" y="50" width="120" height="16" rx="3" fill="{{text}}"/>
      <rect x="140" y="74" width="80" height="10" rx="2" fill="{{secondary}}"/>

      <!-- Contact Info -->
      <g fill="{{text}}" opacity="0.6">
        <rect x="140" y="110" width="140" height="8" rx="2"/>
        <rect x="140" y="128" width="120" height="8" rx="2"/>
        <rect x="140" y="146" width="160" height="8" rx="2"/>
      </g>

      <!-- Social Icons -->
      <circle cx="290" cy="170" r="10" fill="{{primary}}" opacity="0.2"/>
      <circle cx="315" cy="170" r="10" fill="{{secondary}}" opacity="0.2"/>

      <!-- Bottom Accent Line -->
      <rect x="140" y="180" width="60" height="4" rx="2" fill="{{accent}}"/>
    </svg>`,
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics dashboard layout',
    category: 'Web',
    width: 500,
    height: 300,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#6366F1' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#22C55E' },
      { id: 'accent', name: 'Accent', defaultColor: '#F97316' },
      { id: 'background', name: 'Background', defaultColor: '#0F172A' },
      { id: 'text', name: 'Text', defaultColor: '#F8FAFC' },
    ],
    svgTemplate: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="500" height="300" fill="{{background}}"/>

      <!-- Sidebar -->
      <rect width="60" height="300" fill="{{text}}" opacity="0.05"/>
      <circle cx="30" cy="25" r="12" fill="{{primary}}"/>
      <rect x="18" y="60" width="24" height="24" rx="4" fill="{{text}}" opacity="0.3"/>
      <rect x="18" y="95" width="24" height="24" rx="4" fill="{{primary}}"/>
      <rect x="18" y="130" width="24" height="24" rx="4" fill="{{text}}" opacity="0.3"/>
      <rect x="18" y="165" width="24" height="24" rx="4" fill="{{text}}" opacity="0.3"/>

      <!-- Header -->
      <rect x="80" y="20" width="120" height="20" rx="4" fill="{{text}}"/>
      <rect x="380" y="16" width="100" height="28" rx="6" fill="{{primary}}"/>

      <!-- Stat Cards -->
      <rect x="80" y="60" width="130" height="70" rx="8" fill="{{text}}" opacity="0.05"/>
      <rect x="95" y="75" width="50" height="8" rx="2" fill="{{text}}" opacity="0.5"/>
      <rect x="95" y="95" width="70" height="16" rx="2" fill="{{text}}"/>
      <rect x="95" y="115" width="40" height="6" rx="2" fill="{{secondary}}"/>

      <rect x="225" y="60" width="130" height="70" rx="8" fill="{{text}}" opacity="0.05"/>
      <rect x="240" y="75" width="50" height="8" rx="2" fill="{{text}}" opacity="0.5"/>
      <rect x="240" y="95" width="70" height="16" rx="2" fill="{{text}}"/>
      <rect x="240" y="115" width="40" height="6" rx="2" fill="{{accent}}"/>

      <rect x="370" y="60" width="110" height="70" rx="8" fill="{{text}}" opacity="0.05"/>
      <rect x="385" y="75" width="50" height="8" rx="2" fill="{{text}}" opacity="0.5"/>
      <rect x="385" y="95" width="70" height="16" rx="2" fill="{{text}}"/>
      <rect x="385" y="115" width="40" height="6" rx="2" fill="{{primary}}"/>

      <!-- Chart Area -->
      <rect x="80" y="145" width="275" height="140" rx="8" fill="{{text}}" opacity="0.05"/>
      <rect x="95" y="160" width="80" height="10" rx="2" fill="{{text}}"/>

      <!-- Chart Bars -->
      <rect x="110" y="245" width="25" height="25" rx="2" fill="{{primary}}"/>
      <rect x="145" y="225" width="25" height="45" rx="2" fill="{{primary}}"/>
      <rect x="180" y="200" width="25" height="70" rx="2" fill="{{secondary}}"/>
      <rect x="215" y="215" width="25" height="55" rx="2" fill="{{primary}}"/>
      <rect x="250" y="195" width="25" height="75" rx="2" fill="{{accent}}"/>
      <rect x="285" y="210" width="25" height="60" rx="2" fill="{{primary}}"/>

      <!-- Side Panel -->
      <rect x="370" y="145" width="110" height="140" rx="8" fill="{{text}}" opacity="0.05"/>
      <rect x="385" y="160" width="60" height="10" rx="2" fill="{{text}}"/>

      <!-- Progress Items -->
      <rect x="385" y="185" width="80" height="6" rx="3" fill="{{text}}" opacity="0.2"/>
      <rect x="385" y="185" width="55" height="6" rx="3" fill="{{primary}}"/>

      <rect x="385" y="210" width="80" height="6" rx="3" fill="{{text}}" opacity="0.2"/>
      <rect x="385" y="210" width="70" height="6" rx="3" fill="{{secondary}}"/>

      <rect x="385" y="235" width="80" height="6" rx="3" fill="{{text}}" opacity="0.2"/>
      <rect x="385" y="235" width="35" height="6" rx="3" fill="{{accent}}"/>

      <rect x="385" y="260" width="80" height="6" rx="3" fill="{{text}}" opacity="0.2"/>
      <rect x="385" y="260" width="60" height="6" rx="3" fill="{{primary}}"/>
    </svg>`,
  },
  {
    id: 'social-media',
    name: 'Social Post',
    description: 'Instagram-style social post',
    category: 'Social',
    width: 300,
    height: 300,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#E11D48' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#F97316' },
      { id: 'accent', name: 'Accent', defaultColor: '#FBBF24' },
      { id: 'background', name: 'Background', defaultColor: '#18181B' },
      { id: 'text', name: 'Text', defaultColor: '#FAFAFA' },
    ],
    svgTemplate: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with Gradient -->
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:{{primary}};stop-opacity:1" />
          <stop offset="50%" style="stop-color:{{secondary}};stop-opacity:1" />
          <stop offset="100%" style="stop-color:{{accent}};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="{{background}}"/>

      <!-- Decorative Circles -->
      <circle cx="50" cy="50" r="100" fill="{{primary}}" opacity="0.1"/>
      <circle cx="250" cy="250" r="120" fill="{{secondary}}" opacity="0.1"/>

      <!-- Main Content Card -->
      <rect x="30" y="60" width="240" height="180" rx="16" fill="{{text}}" opacity="0.05"/>

      <!-- Icon/Logo -->
      <circle cx="150" cy="120" r="35" fill="url(#grad)"/>
      <rect x="135" y="105" width="30" height="30" rx="6" fill="{{text}}"/>

      <!-- Text Lines -->
      <rect x="80" y="175" width="140" height="14" rx="4" fill="{{text}}"/>
      <rect x="100" y="200" width="100" height="10" rx="3" fill="{{text}}" opacity="0.5"/>

      <!-- CTA Button -->
      <rect x="90" y="255" width="120" height="32" rx="16" fill="url(#grad)"/>
      <rect x="120" y="267" width="60" height="8" rx="2" fill="{{text}}"/>
    </svg>`,
  },
  {
    id: 'poster',
    name: 'Event Poster',
    description: 'Modern event poster design',
    category: 'Print',
    width: 280,
    height: 400,
    colorSlots: [
      { id: 'primary', name: 'Primary', defaultColor: '#7C3AED' },
      { id: 'secondary', name: 'Secondary', defaultColor: '#2DD4BF' },
      { id: 'accent', name: 'Accent', defaultColor: '#FB7185' },
      { id: 'background', name: 'Background', defaultColor: '#0C0A09' },
      { id: 'text', name: 'Text', defaultColor: '#FAFAF9' },
    ],
    svgTemplate: `<svg viewBox="0 0 280 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="280" height="400" fill="{{background}}"/>

      <!-- Geometric Shapes -->
      <circle cx="140" cy="100" r="80" fill="{{primary}}" opacity="0.3"/>
      <circle cx="60" cy="180" r="60" fill="{{secondary}}" opacity="0.2"/>
      <circle cx="220" cy="160" r="50" fill="{{accent}}" opacity="0.2"/>

      <!-- Main Shape -->
      <polygon points="140,50 220,130 200,220 80,220 60,130" fill="none" stroke="{{primary}}" stroke-width="2"/>

      <!-- Center Circle -->
      <circle cx="140" cy="140" r="40" fill="{{primary}}"/>
      <circle cx="140" cy="140" r="25" fill="{{background}}"/>
      <circle cx="140" cy="140" r="10" fill="{{accent}}"/>

      <!-- Event Title -->
      <rect x="40" y="250" width="200" height="24" rx="4" fill="{{text}}"/>
      <rect x="60" y="285" width="160" height="12" rx="3" fill="{{text}}" opacity="0.6"/>

      <!-- Date/Location -->
      <rect x="70" y="320" width="60" height="8" rx="2" fill="{{secondary}}"/>
      <rect x="150" y="320" width="60" height="8" rx="2" fill="{{accent}}"/>

      <rect x="40" y="345" width="200" height="30" rx="6" fill="{{primary}}"/>
      <rect x="100" y="356" width="80" height="8" rx="2" fill="{{text}}"/>

      <!-- Decorative Lines -->
      <line x1="40" y1="235" x2="240" y2="235" stroke="{{text}}" stroke-width="1" opacity="0.3"/>
      <line x1="40" y1="310" x2="240" y2="310" stroke="{{text}}" stroke-width="1" opacity="0.3"/>
    </svg>`,
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function applyColorsToTemplate(template: Template, colors: Record<string, string>): string {
  let svg = template.svgTemplate;

  for (const slot of template.colorSlots) {
    const color = colors[slot.id] || slot.defaultColor;
    svg = svg.replace(new RegExp(`\\{\\{${slot.id}\\}\\}`, 'g'), color);
  }

  return svg;
}
