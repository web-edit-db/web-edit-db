import { animate, easeInOut } from 'motion'

export function scrollIntoViewSmooth(
  element: HTMLElement,
  offset = 100,
  scrollContainer: HTMLElement | null = null,
) {
  // Use motion library for smooth scrolling
  const targetPosition = element.offsetTop - offset // Offset to center the element

  animate(scrollContainer ? scrollContainer.scrollTop : window.scrollY, targetPosition, {
    duration: 0.8, // 800ms in seconds
    onUpdate: (value) => {
      if (scrollContainer) {
        scrollContainer.scrollTo(0, value)
      } else {
        window.scrollTo(0, value)
      }
    },
    ease: easeInOut,
  })
}
