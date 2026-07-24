import { motion } from 'framer-motion'

interface TextAnimateProps {
  text: string
  className?: string
  animation?: 'blurInUp' | 'blurIn' | 'slideUp'
  by?: 'character' | 'word' | 'line'
  once?: boolean
}

export function TextAnimate({ text, className = '', animation = 'blurInUp', by = 'character', once = true }: TextAnimateProps) {
  const elements = by === 'character' ? text.split('') : text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: by === 'character' ? 0.02 : 0.05 },
    },
  }

  const getVariants = () => {
    switch (animation) {
      case 'blurInUp':
        return {
          hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
          show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 200, damping: 20 } },
        }
      case 'blurIn':
        return {
          hidden: { opacity: 0, filter: 'blur(8px)' },
          show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
        }
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
        }
      default:
        return { hidden: { opacity: 0 }, show: { opacity: 1 } }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          variants={getVariants()}
          className="inline-block whitespace-pre"
        >
          {el}{by === 'word' ? ' ' : ''}
        </motion.span>
      ))}
    </motion.div>
  )
}
