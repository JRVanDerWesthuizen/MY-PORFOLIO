// Three.js Background Animation
let scene, camera, renderer, stars, starGeo;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background

    starGeo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < 6000; i++) {
        // Random positions for stars
        positions.push(Math.random() * 600 - 300);
        positions.push(Math.random() * 600 - 300);
        positions.push(Math.random() * 600 - 300);

        // Random colors (subtle variations of blue/purple/white)
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.6, 0.7, 0.5 + Math.random() * 0.2); // HSL for blue/purple range
        colors.push(color.r, color.g, color.b);

        // Random sizes for twinkling effect
        sizes.push(Math.random() * 1.5 + 0.5);
    }

    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    starGeo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    animateThreeJS();
}

function animateThreeJS() {
    // Animate stars
    stars.rotation.y += 0.0005; // Subtle rotation
    stars.rotation.x += 0.0001;

    renderer.render(scene, camera);
    requestAnimationFrame(animateThreeJS);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Formspree Integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const form = event.target;
            const formData = new FormData(form);

            // Display loading message
            formMessages.innerHTML = '<span class="text-blue-400"><i class="fas fa-spinner fa-spin mr-2"></i>Sending message...</span>';
            formMessages.classList.remove('text-green-500', 'text-red-500');

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree's API response
                    }
                });

                if (response.ok) {
                    formMessages.innerHTML = '<span class="text-green-500"><i class="fas fa-check-circle mr-2"></i>Message sent successfully! I will get back to you soon.</span>';
                    form.reset(); // Clear form fields
                } else {
                    const data = await response.json();
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        formMessages.innerHTML = `<span class="text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>${data["errors"].map(error => error["message"]).join(", ")}</span>`;
                    } else {
                        formMessages.innerHTML = '<span class="text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>Oops! There was an error sending your message. Please try again later.</span>';
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formMessages.innerHTML = '<span class="text-red-500"><i class="fas fa-exclamation-triangle mr-2"></i>Network error. Please check your internet connection and try again.</span>';
            }
        });
    }
});


// Initialize Three.js on window load
window.onload = function() {
    initThreeJS();

    // Intersection Observer for scroll animations
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
};
