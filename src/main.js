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

function updateCounter() {
  const activeSlide = document.querySelector('.slide.active')
  if (activeSlide && counterCurrent) {
    const index = Array.from(slides).indexOf(activeSlide)
    counterCurrent.textContent = String(index + 1).padStart(2, '0')
  }
}

const observer = new MutationObserver(() => {
  updateCounter()
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

const pauseBtn = document.getElementById('pause-btn')
if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (carousel.isPlaying) {
        startProgress()
      } else {
        stopProgress()
      }
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

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    stopProgress()
  }
  if (e.code === 'Space') {
    setTimeout(() => {
      carousel.isPlaying ? startProgress() : stopProgress()
    }, 0)
  }
})

updateCounter()

export default carousel
