/**
 * Design System Constants
 * Centralized styling tokens for consistent UI across the application
 */

// Brand Colors
export const COLORS = {
  // Primary Brand
  primary: '#2D6EF5',
  primaryHover: '#2557D6',
  primaryLight: '#DBEAFE',
  primaryDark: '#1E40AF',
  
  // Sidebar
  sidebar: '#2D4AA5',
  sidebarActive: '#3D5BBF',
  
  // Status Colors
  status: {
    readyForPlanning: {
      bg: '#FEF3C7',
      text: '#92400E',
    },
    inPlanning: {
      bg: '#DBEAFE',
      text: '#1E40AF',
    },
    tripAssigned: {
      bg: '#D1FAE5',
      text: '#065F46',
    },
    inTransit: {
      bg: '#E0E7FF',
      text: '#3730A3',
    },
    delivered: {
      bg: '#D1FAE5',
      text: '#065F46',
    },
    partialReturn: {
      bg: '#FEF3C7',
      text: '#92400E',
    },
    returned: {
      bg: '#FEE2E2',
      text: '#991B1B',
    },
    cancelled: {
      bg: '#F3F4F6',
      text: '#374151',
    },
    discarded: {
      bg: '#FEE2E2',
      text: '#991B1B',
    },
    planned: {
      bg: '#FEF3C7',
      text: '#92400E',
    },
    inProgress: {
      bg: '#E0E7FF',
      text: '#3730A3',
    },
    completed: {
      bg: '#D1FAE5',
      text: '#065F46',
    },
  },
  
  // Order Type Colors
  orderType: {
    sales: {
      bg: '#FEF3C7',
      text: '#92400E',
    },
    digital: {
      bg: '#DBEAFE',
      text: '#1E40AF',
    },
  },
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic Colors
  success: '#10B981',
  successHover: '#059669',
  error: '#EF4444',
  errorHover: '#DC2626',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

// Typography
export const TYPOGRAPHY = {
  // Page Titles
  pageTitle: 'text-2xl font-bold text-gray-900',
  pageSubtitle: 'text-sm text-gray-600',
  
  // Section Headers
  sectionTitle: 'text-lg font-semibold text-gray-900',
  sectionSubtitle: 'text-sm text-gray-600',
  
  // Card Headers
  cardTitle: 'text-base font-semibold text-gray-900',
  cardSubtitle: 'text-sm text-gray-600',
  
  // Table Headers
  tableHeader: 'text-xs font-medium text-gray-600 uppercase tracking-wider',
  
  // Body Text
  body: 'text-sm text-gray-900',
  bodySecondary: 'text-sm text-gray-600',
  bodySmall: 'text-xs text-gray-600',
  
  // Labels
  label: 'text-sm font-medium text-gray-700',
  
  // Stats
  statValue: 'text-3xl font-bold text-gray-900',
  statLabel: 'text-sm text-gray-600',
} as const;

// Spacing
export const SPACING = {
  // Page Layout
  pageContainer: 'flex-1 overflow-hidden flex flex-col bg-gray-50',
  pageHeader: 'bg-white border-b px-6 py-4',
  pageContent: 'flex-1 min-h-0 px-6 py-4',
  
  // Card Spacing
  card: 'bg-white border border-gray-200 rounded-lg p-6',
  cardCompact: 'bg-white border border-gray-200 rounded-lg p-4',
  
  // Table Spacing
  tableContainer: 'border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full',
  tableScrollArea: 'overflow-x-auto flex-1 min-h-0 overflow-y-auto',
  tableCellPadding: 'px-4 py-3',
  
  // Button Spacing
  buttonPadding: 'px-4 py-2',
  buttonPaddingSmall: 'px-3 py-1.5',
  buttonPaddingLarge: 'px-6 py-3',
  
  // Gap Utilities
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
  },
} as const;

// Icon Sizes
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

// Common Component Styles
export const COMPONENTS = {
  // Buttons
  button: {
    primary: 'bg-[#2D6EF5] hover:bg-[#2557D6] text-white',
    secondary: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
  },
  
  // Inputs
  input: 'h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent',
  
  // Badges
  badge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
  
  // Icon Buttons
  iconButton: 'p-1 text-gray-400 hover:text-[#2D6EF5] transition-colors',
  iconButtonDanger: 'p-1 text-gray-400 hover:text-red-600 transition-colors',
  
  // Links
  link: 'text-[#2D6EF5] hover:underline',
  
  // Stats Cards
  statsCard: 'bg-white border border-gray-200 rounded-lg p-4',
  statsIconContainer: 'w-10 h-10 rounded-lg flex items-center justify-center',
} as const;

// Responsive Breakpoints (informational - Tailwind handles these)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Helper Functions
export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase().replace(/\s+/g, '');
  
  const statusMap: Record<string, { bg: string; text: string }> = {
    'readyforplanning': COLORS.status.readyForPlanning,
    'inplanning': COLORS.status.inPlanning,
    'tripassigned': COLORS.status.tripAssigned,
    'intransit': COLORS.status.inTransit,
    'delivered': COLORS.status.delivered,
    'partialreturn': COLORS.status.partialReturn,
    'returned': COLORS.status.returned,
    'cancelled': COLORS.status.cancelled,
    'discarded': COLORS.status.discarded,
    'planned': COLORS.status.planned,
    'inprogress': COLORS.status.inProgress,
    'completed': COLORS.status.completed,
  };
  
  const colors = statusMap[statusLower] || { bg: COLORS.gray[100], text: COLORS.gray[700] };
  return `bg-[${colors.bg}] text-[${colors.text}] hover:bg-[${colors.bg}]`;
};

export const getOrderTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  
  if (typeLower === 'sales') {
    return `bg-[${COLORS.orderType.sales.bg}] text-[${COLORS.orderType.sales.text}] hover:bg-[${COLORS.orderType.sales.bg}]`;
  }
  if (typeLower === 'digital') {
    return `bg-[${COLORS.orderType.digital.bg}] text-[${COLORS.orderType.digital.text}] hover:bg-[${COLORS.orderType.digital.bg}]`;
  }
  
  return `bg-[${COLORS.gray[100]}] text-[${COLORS.gray[700]}] hover:bg-[${COLORS.gray[100]}]`;
};
