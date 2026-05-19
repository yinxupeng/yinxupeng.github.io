document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    // 轮播功能
    initCarousel();

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgress.forEach(progress => {
                    const width = progress.style.width;
                    progress.style.width = '0';
                    setTimeout(() => {
                        progress.style.width = width;
                    }, 100);
                });
                observer.disconnect();
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert('感谢你的留言！我会尽快回复你。');
                contactForm.reset();
            } else {
                alert('请填写完整的信息');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.getElementById(targetId.substring(1));
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (!track || !prevBtn || !nextBtn || !indicatorsContainer) return;
    
    const cards = track.querySelectorAll('.work-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    
    // 获取当前可见卡片数量
    function getVisibleCards() {
        return window.innerWidth >= 992 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
    }
    
    // 获取卡片宽度（包含gap）
    function getCardWidth() {
        if (cards.length === 0) return 0;
        const card = cards[0];
        const style = window.getComputedStyle(card);
        return card.offsetWidth + parseFloat(style.marginRight) || 24;
    }
    
    // 创建指示器
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const visibleCards = getVisibleCards();
        for (let i = 0; i <= totalCards - visibleCards; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.dataset.index = i;
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    createIndicators();
    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
    
    function updatePosition() {
        const cardWidth = getCardWidth();
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        indicators.forEach((ind, idx) => {
            ind.classList.toggle('active', idx === currentIndex);
        });
        
        // 禁用/启用按钮
        const visibleCards = getVisibleCards();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalCards - visibleCards;
        
        // 按钮透明度
        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        nextBtn.style.opacity = currentIndex >= totalCards - visibleCards ? '0.4' : '1';
    }
    
    function goToSlide(index) {
        const visibleCards = getVisibleCards();
        if (index < 0 || index > totalCards - visibleCards) return;
        currentIndex = index;
        updatePosition();
    }
    
    function nextSlide() {
        const visibleCards = getVisibleCards();
        if (currentIndex < totalCards - visibleCards) {
            currentIndex++;
            updatePosition();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updatePosition();
        }
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // 触摸滑动
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
    
    // 响应式更新
    window.addEventListener('resize', () => {
        const visibleCards = getVisibleCards();
        createIndicators();
        // 更新当前索引以适应新布局
        currentIndex = Math.min(currentIndex, totalCards - visibleCards);
        updatePosition();
    });
    
    // 自动播放
    let autoplayInterval = setInterval(() => {
        const visibleCards = getVisibleCards();
        if (currentIndex < totalCards - visibleCards) {
            nextSlide();
        } else {
            currentIndex = 0;
            updatePosition();
        }
    }, 4000);
    
    // 鼠标悬停时停止自动播放
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            const visibleCards = getVisibleCards();
            if (currentIndex < totalCards - visibleCards) {
                nextSlide();
            } else {
                currentIndex = 0;
                updatePosition();
            }
        }, 4000);
    });
}