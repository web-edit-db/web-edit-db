import { animate, easeInOut } from 'motion'

export function scrollIntoViewSmooth(element: HTMLElement, offset = 100) {
  // Use motion library for smooth scrolling
  const targetPosition = element.offsetTop - offset // Offset to center the element

  animate(window.scrollY, targetPosition, {
    duration: 0.8, // 800ms in seconds
    onUpdate: (value) => {
      window.scrollTo(0, value)
    },
    ease: easeInOut,
  })
}
