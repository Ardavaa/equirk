# Accessibility Features

## Overview
This application includes comprehensive accessibility features to ensure an inclusive experience for all users, including those with disabilities.

## Reduced Motion Support

### What is Reduced Motion?
The `prefers-reduced-motion` media query detects when users have requested reduced motion through their system preferences. This is particularly important for users with:
- Vestibular disorders
- Motion sensitivity
- Epilepsy or seizure disorders
- Attention disorders

### How It Works
1. **CSS Media Query**: The `src/index.css` file includes comprehensive CSS rules that disable animations when `prefers-reduced-motion: reduce` is detected
2. **JavaScript Hook**: The `useReducedMotion` hook dynamically detects user preferences and updates components accordingly
3. **Framer Motion Integration**: Animation variants are automatically adjusted to respect user preferences

### Implementation

#### CSS Level
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are reduced to minimal duration */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### React Component Level
```jsx
import { useReducedMotion, getAccessibleVariants } from '../hooks/useReducedMotion';

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      variants={getAccessibleVariants(prefersReducedMotion, normalVariants)}
      whileHover={prefersReducedMotion ? {} : "hover"}
    >
      Content
    </motion.div>
  );
};
```

## Focus Management

### Focus Indicators
- Clear, high-contrast focus indicators on all interactive elements
- 2px solid outline with the brand color (#2D6A4F)
- Sufficient contrast ratios for visibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical page flow
- No keyboard traps

## High Contrast Support

The application supports high contrast mode preferences:
- Enhanced text contrast
- Stronger border colors
- Clearer visual hierarchy

## Testing Accessibility

### Reduced Motion Testing
1. **macOS**: System Preferences → Accessibility → Display → Reduce Motion
2. **Windows**: Settings → Ease of Access → Display → Show animations
3. **Browser DevTools**: Chrome DevTools → Rendering → Emulate CSS media feature: prefers-reduced-motion

### Screen Reader Testing
- Test with NVDA (Windows)
- Test with JAWS (Windows)
- Test with VoiceOver (macOS)

## Animation Guidelines

### Do's
- Use smooth, organic easing curves (ease-out, spring)
- Keep animations brief (300-600ms)
- Provide animation controls for users
- Use meaningful transitions that aid understanding

### Don'ts
- Avoid rapid flashing or strobing effects
- Don't use motion as the only way to convey information
- Avoid parallax scrolling without alternatives
- Don't auto-play videos with sound

## Implementation Checklist

- [x] CSS reduced motion media queries
- [x] React hook for motion preferences
- [x] Framer Motion integration
- [x] Focus management
- [x] High contrast support
- [x] Keyboard navigation
- [x] Alternative text for images
- [x] Semantic HTML structure

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Framer Motion Accessibility Guide](https://www.framer.com/motion/guide-accessibility/)

## Contact
For accessibility concerns or suggestions, please contact the development team. 