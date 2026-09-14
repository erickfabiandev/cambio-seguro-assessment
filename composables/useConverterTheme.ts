import { tv } from 'tailwind-variants';

export const currencyRowStyles = tv({
  slots: {
    base: 'flex items-stretch rounded-md border overflow-hidden bg-surface transition-colors min-w-[16rem] max-w-full',
    currencyZone: 'flex items-center px-4 min-w-[6rem] text-sm font-sans font-normal rounded-l-lg',
    amountZone: 'flex flex-1 flex-col justify-center items-end px-4 py-1 text-right rounded-r-lg'
  },
  variants: {
    role:{
      origin:{
        currencyZone: 'bg-surface-subtle text-brand-secondary',
      },
      destination:{
        currencyZone: 'bg-surface-subtle text-brand-secondary',
      }
    },
    state:{
      idle: {
        base: 'border-brand-secondary',
      },
      error: {
        base: 'border-danger-500',
      },
      loading: {
        base: 'border-brand-secondary opacity-80',
      }
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

export const swapButtonStyles = tv({
  base: [
    'flex items-center justify-center h-11 w-11 rounded-pill bg-brand-600 text-white shadow-card',
    'transition-transform duration-200 hover:bg-brand-700 active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ')
})

export const confirmButtonStyles = tv({
  base: [
    'w-full rounded-2xl py-3.5 font-semibold text-white transition-colors',
    'flex items-center justify-center gap-2'
  ].join(' '),
  variants: {
    tone: {
      idle: 'bg-brand-600 hover:bg-brand-700',
      loading: 'bg-brand-500 cursor-wait',
      success: 'bg-emerald-600 hover:bg-emerald-700',
      disabled: 'bg-brand-300 cursor-not-allowed'
    }
  },
  defaultVariants: {
    tone: 'idle'
  }
})

export const bannerStyles = tv({
  base: 'flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm',
  variants: {
    tone: {
      error: 'border-danger-500/30 bg-danger-50 text-danger-600',
      info: 'border-brand-400/30 bg-brand-50 text-brand-700'
    }
  },
  defaultVariants: {
    tone: 'error'
  }
})

export const cardStyles = tv({
  base: 'w-full desktop:max-w-sm desktop:rounded-card border border-surface-border bg-surface px-8 py-6 shadow-card',
  variants: {
    error: {
      true: 'h-auto',
      false: 'h-[310px]',
    },
  },
  defaultVariants: {
    error: false,
  },
})

export const tabsStyles = tv({
  slots: {
    list: 'flex justify-around border-b border-surface-accent',
    tab: 'flex flex-col items-center text-center text-xs transition-colors',
    label: 'block',
    value: 'block border-b-1 pb-2 tabular-nums font-medium'
  },
  variants: {
    active: {
      true: {
        tab: 'text-ink-accent border-b border-ink-accent',
      },
      false: {
        tab: 'text-ink-soft',
      }
    }
  },
  defaultVariants: {
    active: false
  }
})

export const textHeaderStyles = tv({
  slots: {
    content: [
      'flex flex-col',
      'items-center',
      'justify-center',
      'max-w-3xs',
      'text-white',
      'gap-2',
      'py-6',
      'desktop:items-start',
      'desktop:max-w-sm',
      'desktop:text-left',
      'text-center',
      'm-0 leading-none'
    ],

    title: [
      'text-[24px]',
      'font-medium',
      'desktop:text-[48px]',
    ],

    subtitle: [
      'text-[14px]',
      'max-w-[200px]',
      'desktop:text-[24px]',
      'desktop:max-w-full',
    ],
  },
})