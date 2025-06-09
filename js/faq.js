// FAQ Page Javascript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize FAQ items
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.querySelector('#faq-search-input');
  const faqCategories = document.querySelectorAll('.faq-category');
  const faqNotFound = document.querySelector('.faq-not-found');
  
  // Add animation for FAQ items on load
  faqItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index);
  });
  
  // Add animation for help options on load
  const helpOptions = document.querySelectorAll('.help-option');
  helpOptions.forEach((option, index) => {
    setTimeout(() => {
      option.style.opacity = '1';
      option.style.transform = 'translateY(0)';
    }, 800 + (200 * index));  // Start after FAQ items with additional delay
  });
  
  // FAQ Item Click Handler
  faqItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.closest('.faq-question')) {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            otherAnswer.style.maxHeight = null;
            const otherArrow = otherItem.querySelector('.faq-arrow');
            if (otherArrow) otherArrow.style.transform = 'rotate(0)';
          }
        });
        
        // Toggle current item
        this.classList.toggle('active');
        const answer = this.querySelector('.faq-answer');
        const arrow = this.querySelector('.faq-arrow');
        
        if (this.classList.contains('active')) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (arrow) {
            arrow.style.transform = 'rotate(90deg)';
          }
        } else {
          answer.style.maxHeight = null;
          if (arrow) {
            arrow.style.transform = 'rotate(0)';
          }
        }
      }
    });
  });
  
  // Filter FAQs by category
  if (faqCategories) {
    faqCategories.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        // Update active button
        faqCategories.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter FAQ items
        let hasVisibleItems = false;
        
        faqItems.forEach((item) => {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            hasVisibleItems = true;
          } else {
            item.style.display = 'none';
          }
        });
        
        // Show/hide not found message
        if (faqNotFound) {
          faqNotFound.style.display = hasVisibleItems ? 'none' : 'block';
        }
      });
    });
  }
  
  // Search functionality
  if (faqSearchInput) {
    let searchTimeout;
    
    faqSearchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const searchText = this.value.toLowerCase().trim();
      
      // Reset category filters when searching
      if (faqCategories) {
        faqCategories.forEach((btn) => btn.classList.remove('active'));
        const allCategoryBtn = document.querySelector('.faq-category[data-category="all"]');
        if (allCategoryBtn) allCategoryBtn.classList.add('active');
      }
      
      searchTimeout = setTimeout(() => {
        let hasResults = false;
        
        faqItems.forEach((item) => {
          const question = item.querySelector('.faq-question').textContent.toLowerCase();
          const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
          
          if (question.includes(searchText) || answer.includes(searchText)) {
            item.style.display = 'block';
            hasResults = true;
          } else {
            item.style.display = 'none';
          }
        });
        
        // Show/hide not found message
        if (faqNotFound) {
          faqNotFound.style.display = hasResults ? 'none' : 'block';
        }
      }, 300);
    });
  }
  
  // FAQ Search Functionality
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      let matchFound = false;
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = 'block';
          matchFound = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide not found message
      if (faqNotFound) {
        faqNotFound.style.display = matchFound ? 'none' : 'block';
      }
    });
  }
  
  // FAQ Category Filtering
  if (faqCategories.length > 0) {
    faqCategories.forEach(category => {
      category.addEventListener('click', function() {
        // Update active category
        faqCategories.forEach(cat => cat.classList.remove('active'));
        this.classList.add('active');
        
        const categoryFilter = this.getAttribute('data-category');
        let matchFound = false;
        
        faqItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (categoryFilter === 'all' || itemCategory === categoryFilter) {
            item.style.display = 'block';
            matchFound = true;
          } else {
            item.style.display = 'none';
          }
        });
        
        // Show/hide not found message
        if (faqNotFound) {
          faqNotFound.style.display = matchFound ? 'none' : 'block';
        }
      });
    });
  }
  
  // Add animation for FAQ items
  faqItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index);
  });
});
