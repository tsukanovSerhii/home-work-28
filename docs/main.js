import SwipeCarousel from './carousel/index.js'

const carouselConfig = {
  containerId: '#carousel',
  slideId: '.slide',
  interval: 5000,
  isPlaying: true
}

const carousel = new SwipeCarousel(carouselConfig)
carousel.init()

const progressFill = document.getElementById('progress-fill')
const counterCurrent = document.getElementById('counter-current')
const counterTotal = document.getElementById('counter-total')
const slides = document.querySelectorAll('.slide')
const thumbnails = document.querySelectorAll('.thumbnail')
const thumbnailStrip = document.getElementById('thumbnail-strip')
const fabLike = document.getElementById('fab-like')
const likeCount = document.getElementById('like-count')
const toast = document.getElementById('toast')
const toastMessage = document.getElementById('toast-message')
const fullscreenBtn = document.getElementById('fullscreen-btn')
const themeBtn = document.getElementById('theme-btn')
const preloader = document.getElementById('preloader')

if (counterTotal) {
  counterTotal.textContent = String(slides.length).padStart(2, '0')
}

let progressInterval = null
let progressValue = 0
const PROGRESS_STEP = 50

function startProgress() {
  stopProgress()
  progressValue = 0
  if (progressFill) progressFill.style.width = '0%'

  progressInterval = setInterval(() => {
    progressValue += PROGRESS_STEP
    const percent = Math.min((progressValue / carouselConfig.interval) * 100, 100)
    if (progressFill) progressFill.style.width = `${percent}%`
  }, PROGRESS_STEP)
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  progressValue = 0
  if (progressFill) progressFill.style.width = '0%'
}

function getActiveIndex() {
  const activeSlide = document.querySelector('.slide.active')
  if (activeSlide) {
    return Array.from(slides).indexOf(activeSlide)
  }
  return 0
}

function updateCounter() {
  const index = getActiveIndex()
  if (counterCurrent) {
    counterCurrent.textContent = String(index + 1).padStart(2, '0')
  }
}

function updateThumbnails() {
  const index = getActiveIndex()
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index)
  })
}

const observer = new MutationObserver(() => {
  updateCounter()
  updateThumbnails()
  if (carousel.isPlaying) {
    startProgress()
  }
})

slides.forEach(slide => {
  observer.observe(slide, {
    attributes: true,
    attributeFilter: ['class']
  })
})

thumbnails.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const index = parseInt(thumb.dataset.index, 10)
    const indicators = document.querySelectorAll('.indicator')
    if (indicators[index]) {
      indicators[index].click()
    }
  })
})

if (thumbnailStrip) {
  setTimeout(() => thumbnailStrip.classList.add('visible'), 800)
}

const pauseBtn = document.getElementById('pause-btn')
if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    setTimeout(() => {
      carousel.isPlaying ? startProgress() : stopProgress()
    }, 0)
  })
}

if (carousel.isPlaying) {
  startProgress()
}

const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')

if (prevBtn) prevBtn.addEventListener('click', () => stopProgress())
if (nextBtn) nextBtn.addEventListener('click', () => stopProgress())

const likes = {}

if (fabLike) {
  fabLike.addEventListener('click', () => {
    const index = getActiveIndex()
    likes[index] = !likes[index]

    if (likes[index]) {
      fabLike.classList.add('liked')
      fabLike.querySelector('i').className = 'fas fa-heart'
      showToast('Added to favorites ❤️')
    } else {
      fabLike.classList.remove('liked')
      fabLike.querySelector('i').className = 'far fa-heart'
      showToast('Removed from favorites')
    }

    const totalLikes = Object.values(likes).filter(Boolean).length
    if (likeCount) likeCount.textContent = totalLikes
  })
}

function updateLikeState() {
  const index = getActiveIndex()
  if (fabLike) {
    if (likes[index]) {
      fabLike.classList.add('liked')
      fabLike.querySelector('i').className = 'fas fa-heart'
    } else {
      fabLike.classList.remove('liked')
      fabLike.querySelector('i').className = 'far fa-heart'
    }
  }
}

const likeObserver = new MutationObserver(updateLikeState)
slides.forEach(slide => {
  likeObserver.observe(slide, { attributes: true, attributeFilter: ['class'] })
})

function showToast(message) {
  if (!toast || !toastMessage) return
  toastMessage.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2500)
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      fullscreenBtn.querySelector('i').className = 'fas fa-compress'
      showToast('Fullscreen mode')
    } else {
      document.exitFullscreen()
      fullscreenBtn.querySelector('i').className = 'fas fa-expand'
      showToast('Exited fullscreen')
    }
  })
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme')
    const isLight = document.body.classList.contains('light-theme')
    themeBtn.querySelector('i').className = isLight ? 'fas fa-sun' : 'fas fa-moon'
    showToast(isLight ? 'Light theme' : 'Dark theme')
  })
}

let idleTimer = null
const IDLE_TIMEOUT = 4000

function resetIdle() {
  document.body.classList.remove('idle')
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    document.body.classList.add('idle')
  }, IDLE_TIMEOUT)
}

document.addEventListener('mousemove', resetIdle)
document.addEventListener('mousedown', resetIdle)
document.addEventListener('touchstart', resetIdle)
resetIdle()

document.addEventListener('keydown', (e) => {
  resetIdle()

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    stopProgress()
  }
  if (e.code === 'Space') {
    setTimeout(() => {
      carousel.isPlaying ? startProgress() : stopProgress()
    }, 0)
  }
  if (e.code === 'KeyF') {
    fullscreenBtn?.click()
  }
  if (e.code === 'KeyL') {
    fabLike?.click()
  }
})

window.addEventListener('load', () => {
  setTimeout(() => {
    if (preloader) preloader.classList.add('hidden')
  }, 1200)
})

function initParticles() {
  const canvas = document.createElement('canvas')
  canvas.classList.add('particles-canvas')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const particles = []
  const PARTICLE_COUNT = 35

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.speedX
      p.y += p.speedY

      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(124, 92, 252, ${p.opacity})`
      ctx.fill()
    })

    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(124, 92, 252, ${0.06 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })

    requestAnimationFrame(animate)
  }

  animate()
}

initParticles()

updateCounter()
updateThumbnails()

export default carousel
