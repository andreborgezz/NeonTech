// Criar um Intersection Observer para detectar quando os elementos estão visíveis
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove e readiciona a classe para reiniciar a animação
            entry.target.classList.remove('animate');
            void entry.target.offsetWidth; // Força um reflow
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1 // Dispara quando pelo menos 10% do elemento está visível
});

// Função para reiniciar animações
const resetAnimation = (element) => {
    element.style.animation = 'none';
    void element.offsetWidth; // Força um reflow
    element.style.animation = null;
};

// Função para atualizar a posição do efeito de luz
const updateLightEffect = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
};

// Função para controlar o header durante o scroll
const handleScroll = () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

// Função para scroll suave ao topo
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Função para scroll suave ao clicar em links
const smoothScroll = (e) => {
    if (e.target.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(e.target.hash);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona o listener para o scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Adiciona smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Adiciona o click listener no logo para voltar ao topo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', scrollToTop);
    }

    // Seleciona o container e seus cards
    const container = document.querySelector('.container');
    if (container) {
        // Observa o container para reiniciar animações quando ele entrar na view
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resetAnimation(container);
                    // Reinicia animação dos cards
                    const cards = container.querySelectorAll('.card');
                    cards.forEach(card => {
                        resetAnimation(card);
                    });
                }
            });
        }, {
            threshold: 0.1
        });

        containerObserver.observe(container);

        // Adiciona os event listeners para o efeito de luz
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            // Atualiza a posição da luz quando o mouse se move sobre o card
            card.addEventListener('mousemove', (e) => {
                updateLightEffect(e, card);
            });

            // Remove a luz quando o mouse sai do card
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', '-100px');
                card.style.setProperty('--mouse-y', '-100px');
            });
        });
    }
});
