/* Main JavaScript for Ride-Hailing Website */

// DOM Elements
const header = document.getElementById('header');

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Main JavaScript continues with core functionality

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate elements when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes to elements
    document.querySelectorAll('.step-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    document.querySelectorAll('.feature-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.vehicle-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.15}s`;
    });
    
    document.querySelectorAll('.testimonial-card').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.2}s`;
    });
});

// Form validation
const validateForm = (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if it doesn't exist
            let errorMessage = input.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            
            // Remove error message if it exists
            const errorMessage = input.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });
    
    return isValid;
};

// Handle form submissions
document.addEventListener('submit', (e) => {
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) {
        e.preventDefault();
        return;
    }
    
    // For demo purposes, prevent actual form submission
    if (!form.classList.contains('real-form')) {
        e.preventDefault();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.textContent = 'Form submitted successfully!';
        form.appendChild(successMessage);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            successMessage.remove();
        }, 3000);
    }
});

// Responsive navigation for bottom nav on mobile
const updateActiveNavItem = () => {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.bottom-nav-link, .nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 100 && 
            window.scrollY < sectionTop + sectionHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
};

// Update active nav item on scroll
window.addEventListener('scroll', updateActiveNavItem);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Vehicle carousel functionality
const initCarousel = (carouselSelector, autoplay = true, interval = 5000) => {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    if (items.length <= 1) return;
    
    let currentIndex = 0;
    let intervalId;
    
    const showItem = (index) => {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    };
    
    const nextItem = () => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    };
    
    const prevItem = () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    };
    
    // Initialize
    showItem(currentIndex);
    
    // Add navigation if more than one item
    if (items.length > 1) {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            prevItem();
            if (autoplay) {
                clearInterval(intervalId);
                intervalId = setInterval(nextItem, interval);
            }
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            nextItem();
            if (autoplay) {
                clearInterval(intervalId);
                intervalId = setInterval(nextItem, interval);
            }
        });
        
        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        carousel.appendChild(nav);
        
        // Add indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        items.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = i === currentIndex ? 'indicator active' : 'indicator';
            dot.addEventListener('click', () => {
                currentIndex = i;
                showItem(currentIndex);
                if (autoplay) {
                    clearInterval(intervalId);
                    intervalId = setInterval(nextItem, interval);
                }
            });
            indicators.appendChild(dot);
        });
        
        carousel.appendChild(indicators);
    }
    
    // Start autoplay if enabled
    if (autoplay && items.length > 1) {
        intervalId = setInterval(nextItem, interval);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });
        
        carousel.addEventListener('mouseleave', () => {
            intervalId = setInterval(nextItem, interval);
        });
    }
};

// Initialize testimonials carousel with automatic sliding
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialsCarousel();
    // Vehicle section is now a static grid, no longer using carousel
});

// Modern Draggable Testimonials Carousel
const initTestimonialsCarousel = () => {
    const carousel = document.querySelector('.testimonials-carousel');
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!carousel || !track || cards.length === 0) return;
    
    let currentIndex = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId;
    
    // Calculate card width including gap
    const getCardWidth = () => {
        const card = cards[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        return card.offsetWidth + gap;
    };
    
    // Set active card
    const setActiveCard = (index) => {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    };
    
    // Move to specific index
    const moveToIndex = (index) => {
        const cardWidth = getCardWidth();
        const maxIndex = cards.length - 1;
        
        // Ensure index is within bounds
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
        
        currentIndex = index;
        
        // Calculate position to center the active card
        const containerWidth = carousel.offsetWidth;
        const targetPosition = -(index * cardWidth) + (containerWidth - cardWidth) / 2;
        
        track.style.transform = `translateX(${targetPosition}px)`;
        setActiveCard(currentIndex);
        currentTranslate = targetPosition;
        prevTranslate = targetPosition;
    };
    
    // Auto-play functionality
    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying && !isDragging) {
                const nextIndex = (currentIndex + 1) % cards.length;
                moveToIndex(nextIndex);
            }
        }, 2000); // 2 seconds as requested
    };
    
    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };
    
    // Touch/Mouse event handlers
    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    };
    
    const dragStart = (event) => {
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
        
        isDragging = true;
        startPos = getPositionX(event);
        track.classList.add('dragging');
        stopAutoPlay();
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
    
    const dragMove = (event) => {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        // Apply immediate transform without transition
        track.style.transform = `translateX(${currentTranslate}px)`;
    };
    
    const dragEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        track.classList.remove('dragging');
        
        const cardWidth = getCardWidth();
        const dragThreshold = cardWidth * 0.2; // 20% of card width
        const dragDistance = currentTranslate - prevTranslate;
        
        // Determine direction and if threshold is met
        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0) {
                // Dragged right, go to previous
                moveToIndex(currentIndex - 1);
            } else {
                // Dragged left, go to next  
                moveToIndex(currentIndex + 1);
            }
        } else {
            // Snap back to current position
            moveToIndex(currentIndex);
        }
        
        // Restart autoplay after a short delay
        setTimeout(() => {
            if (isAutoPlaying) {
                startAutoPlay();
            }
        }, 3000);
    };
    
    // Mouse events
    track.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events
    track.addEventListener('touchstart', dragStart, { passive: false });
    track.addEventListener('touchmove', dragMove, { passive: false });
    track.addEventListener('touchend', dragEnd);
    
    // Prevent context menu on right click while dragging
    track.addEventListener('contextmenu', (e) => {
        if (isDragging) e.preventDefault();
    });
    
    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', () => {
        isAutoPlaying = false;
        stopAutoPlay();
    });
    
    carousel.addEventListener('mouseleave', () => {
        isAutoPlaying = true;
        startAutoPlay();
    });
    
    // Handle window resize
    const handleResize = () => {
        moveToIndex(currentIndex);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initialize
    setActiveCard(0);
    moveToIndex(0);
    startAutoPlay();
    
    // Cleanup function
    return () => {
        stopAutoPlay();
        window.removeEventListener('resize', handleResize);
        track.removeEventListener('mousedown', dragStart);
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        track.removeEventListener('touchstart', dragStart);
        track.removeEventListener('touchmove', dragMove);
        track.removeEventListener('touchend', dragEnd);
    };
};

// User dropdown menu toggle
const userMenuButton = document.querySelector('.user-menu-button');
const userMenu = document.querySelector('.user-menu');

if (userMenuButton && userMenu) {
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });
}

// Notification dropdown toggle
const notificationButton = document.querySelector('.notification-button');
const notificationDropdown = document.querySelector('.notification-dropdown');

if (notificationButton && notificationDropdown) {
    notificationButton.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (notificationDropdown && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }
    });
}

// Add touch support for mobile devices
document.addEventListener('DOMContentLoaded', () => {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// Preload critical images
const preloadImages = () => {
    const criticalImages = [
        'images/logo.svg',
        'images/hero-car.svg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Call preload function
preloadImages();

// Add CSS class for animation when elements come into view
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateOnScroll.forEach(element => {
        animateOnScrollObserver.observe(element);
    });
});

// Add CSS class for animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Footer animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const footerColumns = document.querySelectorAll('.footer-column');
    
    // Add animation class to footer columns
    footerColumns.forEach(column => {
        column.classList.add('footer-animate');
    });
    
    // Observe footer to trigger animations when in view
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                footerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe the footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footerObserver.observe(footer);
    }
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show button when user scrolls down 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicking the button
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Enhanced header scroll behavior
(() => {
  const header = document.getElementById('header');
  let lastScrollTop = 0;
  let scrollThreshold = 100;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add header-scrolled class when scrolled down
    if (scrollTop > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // Hide header when scrolling down, show when scrolling up
    if (scrollTop > scrollThreshold) {
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add('header-hidden');
      } else {
        // Scrolling up
        header.classList.remove('header-hidden');
      }
      lastScrollTop = scrollTop;
    }
  });
})();

// Animated nav indicator
(() => {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;
  
  // Create indicator element
  const indicator = document.createElement('span');
  indicator.classList.add('section-indicator');
  navList.appendChild(indicator);
  
  // Set initial position to active link
  const activeLink = navList.querySelector('.nav-link.active');
  if (activeLink) {
    setTimeout(() => {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.left = `${linkRect.left - navRect.left}px`;
    }, 100);
  } else {
    indicator.style.opacity = '0';
  }
  
  // Update indicator on hover
  const navLinks = navList.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const linkRect = link.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.left = `${linkRect.left - navRect.left}px`;
      indicator.style.opacity = '1';
    });
  });
  
  navList.addEventListener('mouseleave', () => {
    const activeLink = navList.querySelector('.nav-link.active');
    if (activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.left = `${linkRect.left - navRect.left}px`;
    } else {
      indicator.style.opacity = '0';
    }
  });
  
  // Update indicator when scrolling between sections
  window.addEventListener('scroll', () => {
    // Find the current active section
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;
    const scrollPosition = window.scrollY + 100; // Offset for header height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(currentSection)) {
          link.classList.add('active');
          
          // Update indicator position
          const linkRect = link.getBoundingClientRect();
          const navRect = navList.getBoundingClientRect();
          
          indicator.style.width = `${linkRect.width}px`;
          indicator.style.left = `${linkRect.left - navRect.left}px`;
          indicator.style.opacity = '1';
        }
      });
    }
  });
})();

// Mobile menu handling moved to MobileNavManager in navbar.js

// Enhanced navigation dropdown functionality
(() => {
  const navItems = document.querySelectorAll('.nav-item');
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  // Mouse events for dropdowns
  navItems.forEach(item => {
    const trigger = item.querySelector('.dropdown-trigger');
    const dropdown = item.querySelector('.nav-dropdown');
    
    if (trigger && dropdown) {
      // Mouse events
      item.addEventListener('mouseenter', () => {
        trigger.setAttribute('aria-expanded', 'true');
      });
      
      item.addEventListener('mouseleave', () => {
        trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

// Navigation highlighting and smooth scroll
(() => {
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      }
    });
  });

  // Add active class to navigation items based on scroll position
  const updateActiveNavigation = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-trigger), .mobile-nav-link:not(.has-submenu)');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(currentSection) && currentSection !== '') {
        link.classList.add('active');
      }
    });
  };

  // Throttled scroll handler for better performance
  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(updateActiveNavigation, 10);
  });

  // Initialize on page load
  updateActiveNavigation();
})();

// Navigation performance optimizations and utilities
(() => {
  // Preload navigation pages on hover for faster navigation
  const navLinks = document.querySelectorAll('.nav-link[href$=".html"], .nav-dropdown-link[href$=".html"]');
  const preloadedPages = new Set();
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && href.endsWith('.html') && !preloadedPages.has(href)) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'prefetch';
        linkElement.href = href;
        document.head.appendChild(linkElement);
        preloadedPages.add(href);
      }
    });
  });

  // Navigation analytics and user behavior tracking
  const trackNavigation = (action, element) => {
    // This would integrate with your analytics service
    console.log('Navigation Event:', {
      action,
      element: element.textContent.trim(),
      href: element.getAttribute('href'),
      timestamp: new Date().toISOString()
    });
  };

  // Track dropdown interactions
  document.querySelectorAll('.nav-dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      trackNavigation('dropdown_click', link);
    });
  });

  // Track main navigation clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      trackNavigation('nav_click', link);
    });
  });

  

  // Add loading states for navigation
  const addNavigationLoadingState = () => {
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    navItems.forEach(item => {
      const links = item.querySelectorAll('a[href$=".html"]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          // Add loading state
          link.classList.add('nav-loading');
          
          // Remove loading state after navigation
          setTimeout(() => {
            link.classList.remove('nav-loading');
          }, 1000);
        });
      });
    });
  };

  addNavigationLoadingState();
})();

// Back to Top Button Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Testimonials Carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonials-carousel');
    const track = carousel.querySelector('.testimonials-track');
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    const autoplayBtn = carousel.querySelector('.carousel-autoplay');
    
    let currentIndex = 0;
    let autoplayInterval;
    let isPlaying = true;

    // Clone first and last cards for infinite loop
    const firstCardClone = cards[0].cloneNode(true);
    const lastCardClone = cards[cards.length - 1].cloneNode(true);
    track.appendChild(firstCardClone);
    track.insertBefore(lastCardClone, cards[0]);

    // Update track transform
    const updateTrack = () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(track).gap);
        const offset = -(currentIndex + 1) * (cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;
    };

    // Initialize position
    updateTrack();

    // Navigation functions
    const showPrevCard = () => {
        currentIndex--;
        if (currentIndex < -1) {
            currentIndex = cards.length - 1;
            track.style.transition = 'none';
            updateTrack();
            setTimeout(() => {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                currentIndex--;
                updateTrack();
            }, 0);
        } else {
            updateTrack();
        }
    };

    const showNextCard = () => {
        currentIndex++;
        if (currentIndex > cards.length - 1) {
            currentIndex = 0;
            track.style.transition = 'none';
            updateTrack();
            setTimeout(() => {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                currentIndex++;
                updateTrack();
            }, 0);
        } else {
            updateTrack();
        }
    };

    // Event listeners
    prevBtn.addEventListener('click', showPrevCard);
    nextBtn.addEventListener('click', showNextCard);

    // Autoplay functionality
    const startAutoplay = () => {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(showNextCard, 5000);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay initially
    startAutoplay();

    // Handle window resize
    window.addEventListener('resize', updateTrack);

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevCard();
        } else if (e.key === 'ArrowRight') {
            showNextCard();
        }
    });
});


