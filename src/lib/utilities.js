import gsap from 'gsap'

export function roundToNearestThousand(value) {
    return Math.round(value / 1000) * 1000
}
export function roundToNearestWhole(value) {
    return Math.round(value)
}

export function generateUserId() {
    return "user"+ Math.random().toString(36).substring(2, 9)
}

export function watchClick(element, element2, main) {
    element.addEventListener('click', (event) => {
        if (!element.querySelector('a').contains(event.target)) {
            element2.style.display= 'flex'
            gsap.from(element2, {
                autoAlpha: 0,
                y: '10vh',
                duration: 1,
                ease: 'power1.out'
            })
            main.classList.add('blurred')
        }
    })
}

export function closePopup(doc, element, element2, main) {
    doc.addEventListener('click', (event) => {
        if (event.target !== element2 && !element2.contains(event.target) && !element.contains(event.target)) {
            element2.style.display = 'none';
            main.classList.remove('blurred')
        }
    })

    doc.addEventListener('keydown', (event) =>{
        if(event.key==='Escape' && element2.style.display == 'flex') {
            element2.style.display = 'none'
            main.classList.remove('blurred')
        }
    })
}

export function enableCard(card) {
    card.style.display = 'block'
}