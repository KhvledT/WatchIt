import type { PropsWithChildren } from 'react'
import { useEffect, useRef, useState } from 'react'

function HorizontalScroll({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateShadows = () => {
    const el = ref.current
    if (!el) return
    const epsilon = 8
    setCanLeft(el.scrollLeft > epsilon)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - epsilon)
  }

  const scrollByAmount = (amount: number) => {
    ref.current?.scrollBy({ left: amount, behavior: 'smooth' })
    // defer update to after scroll settles a bit
    setTimeout(updateShadows, 200)
  }

  useEffect(() => {
    updateShadows()
    const el = ref.current
    if (!el) return
    const onScroll = () => updateShadows()
    el.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => updateShadows()
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>, dir: 'left' | 'right') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollByAmount(dir === 'left' ? -400 : 400)
    }
  }
  return (
    <div className="relative">
      <div
        ref={ref}
        className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory scroll-p-3"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex gap-3 min-w-full w-max">
          {children}
        </div>
      </div>
      {/* Clickable shadow overlays with arrows */}
      <div
        aria-label="Scroll left"
        role="button"
        tabIndex={0}
        onClick={() => scrollByAmount(-400)}
        onKeyDown={(e) => onKey(e, 'left')}
        className={`hidden ${canLeft ? 'md:flex' : 'md:hidden'} absolute inset-y-0 left-0 w-24 z-10 cursor-pointer items-center justify-start bg-gradient-to-r from-slate-900/95 to-transparent hover:from-slate-900 transition-colors`}
      >
        <span className="ml-2 text-4xl leading-none text-slate-200/80">‹</span>
      </div>
      <div
        aria-label="Scroll right"
        role="button"
        tabIndex={0}
        onClick={() => scrollByAmount(400)}
        onKeyDown={(e) => onKey(e, 'right')}
        className={`hidden ${canRight ? 'md:flex' : 'md:hidden'} absolute inset-y-0 right-0 w-24 z-10 cursor-pointer items-center justify-end bg-gradient-to-l from-slate-900/95 to-transparent hover:from-slate-900 transition-colors`}
      >
        <span className="mr-2 text-4xl leading-none text-slate-200/80">›</span>
      </div>
    </div>
  )
}

export default HorizontalScroll


