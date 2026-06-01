'use strict';

function toggleMenu(){
    const menu = document.querySelector(".menu-links")
    const icons = document.querySelector(".hamburger-icon")
    menu.classList.toggle("open");
    icons.classList.toggle("open");
}
// ========================================
// NAIL SALON FAQ / QUESTIONNAIRE SECTION - JAVASCRIPT
// Handles click toggling, plus/minus rotation, and smooth animations
// ========================================

(function() {
    

    // Wait for the DOM to be fully loaded before running
    document.addEventListener('DOMContentLoaded', function() {
        
        // Select all FAQ question buttons/containers
        // Using the class that wraps the clickable area (the question row)
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        // If no FAQ elements found, exit silently
        if (faqQuestions.length === 0) return;

        // Function to toggle a single FAQ item
        function toggleFaqItem(questionElement) {
            // Find the parent .faq-item container
            const faqItem = questionElement.closest('.faq-item');
            if (!faqItem) return;
            
            // Find the answer panel within this FAQ item
            const answerPanel = faqItem.querySelector('.faq-answer');
            if (!answerPanel) return;
            
            // Check current state (expanded or collapsed)
            const isExpanded = answerPanel.classList.contains('active');
            
            if (!isExpanded) {
                // OPEN the answer panel
                answerPanel.classList.add('active');
                // Update aria-expanded attribute for accessibility
                questionElement.setAttribute('aria-expanded', 'true');
                // Optional: Add active class to question for styling
                questionElement.classList.add('active');
            } else {
                // CLOSE the answer panel
                answerPanel.classList.remove('active');
                // Update aria-expanded attribute
                questionElement.setAttribute('aria-expanded', 'false');
                // Remove active class
                questionElement.classList.remove('active');
            }
        }
        
        // Alternative: Accordion mode (close others when opening one)
        // Set this to 'true' if you want only one FAQ open at a time
        // Set to 'false' if you want multiple FAQs open simultaneously
        const ACCORDION_MODE = false;  // false = independent toggling (like the image shows)
        
        // Function to close all FAQ items (used only in accordion mode)
        function closeAllFaqItems(exceptElement = null) {
            const allAnswers = document.querySelectorAll('.faq-answer');
            allAnswers.forEach(answer => {
                if (answer.classList.contains('active')) {
                    answer.classList.remove('active');
                }
            });
            
            const allQuestions = document.querySelectorAll('.faq-question');
            allQuestions.forEach(question => {
                if (exceptElement && question === exceptElement) return;
                question.setAttribute('aria-expanded', 'false');
                question.classList.remove('active');
            });
        }
        
        // Function to handle accordion-style toggling
        function toggleFaqItemAccordion(questionElement) {
            const faqItem = questionElement.closest('.faq-item');
            if (!faqItem) return;
            
            const answerPanel = faqItem.querySelector('.faq-answer');
            if (!answerPanel) return;
            
            const isExpanded = answerPanel.classList.contains('active');
            
            // First close all other open FAQs
            closeAllFaqItems(questionElement);
            
            if (!isExpanded) {
                // Open the clicked one
                answerPanel.classList.add('active');
                questionElement.setAttribute('aria-expanded', 'true');
                questionElement.classList.add('active');
            }
            // If it was already open, accordion mode closes it (so it toggles off)
            // Note: In pure accordion, clicking an open item closes it
        }
        
        // Attach click event listeners to each FAQ question
        faqQuestions.forEach(question => {
            // Make sure the element is clickable
            question.style.cursor = 'pointer';
            
            // Add click event listener
            question.addEventListener('click', function(event) {
                // Prevent any default behavior that might interfere
                event.preventDefault();
                
                // Use accordion mode or independent mode based on setting
                if (ACCORDION_MODE) {
                    toggleFaqItemAccordion(this);
                } else {
                    toggleFaqItem(this);
                }
            });
            
            // Also add keyboard support for accessibility (Enter and Space keys)
            question.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (ACCORDION_MODE) {
                        toggleFaqItemAccordion(this);
                    } else {
                        toggleFaqItem(this);
                    }
                }
            });
            
            // Set initial ARIA attributes if not already set
            if (!question.hasAttribute('aria-expanded')) {
                const faqItem = question.closest('.faq-item');
                const answerPanel = faqItem ? faqItem.querySelector('.faq-answer') : null;
                const isInitiallyOpen = answerPanel ? answerPanel.classList.contains('active') : false;
                question.setAttribute('aria-expanded', isInitiallyOpen);
                if (isInitiallyOpen) {
                    question.classList.add('active');
                }
            }
            
            // Make the element focusable for keyboard users
            if (question.tabIndex === -1 || question.tabIndex === undefined) {
                question.tabIndex = 0;
            }
        });
        
        // Optional: Handle case where someone wants to open a specific FAQ from URL hash
        // Example: if URL has #faq-2, open the second FAQ
        function openFaqFromHash() {
            const hash = window.location.hash;
            if (hash && hash.includes('faq-')) {
                const index = parseInt(hash.replace('#faq-', '')) - 1;
                if (!isNaN(index) && faqQuestions[index]) {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        if (ACCORDION_MODE) {
                            closeAllFaqItems(faqQuestions[index]);
                        }
                        toggleFaqItem(faqQuestions[index]);
                        // Scroll smoothly to the FAQ
                        faqQuestions[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            }
        }
        
        // Call hash checker on load
        openFaqFromHash();
        
        // Also listen for hash changes (when user clicks anchor links)
        window.addEventListener('hashchange', openFaqFromHash);
        
        // Optional: Add CSS transition end handling for smoother animations
        // This ensures that max-height transitions don't glitch when closing
        const allAnswers = document.querySelectorAll('.faq-answer');
        allAnswers.forEach(answer => {
            answer.addEventListener('transitionend', function(event) {
                // Only handle max-height transitions
                if (event.propertyName === 'max-height') {
                    // Clean up inline styles if any were added by other scripts
                    if (!this.classList.contains('active')) {
                        this.style.maxHeight = '';
                    }
                }
            });
        });
        
        // Small fix: pre-calculate max-height for smoother opening
        // This helps browsers that don't handle max-height transitions perfectly
        function setInitialMaxHeights() {
            const answers = document.querySelectorAll('.faq-answer');
            answers.forEach(answer => {
                if (answer.classList.contains('active')) {
                    // Store the scrollHeight as max-height for smooth transition
                    const scrollHeight = answer.scrollHeight;
                    answer.style.maxHeight = scrollHeight + 'px';
                    
                    // After transition, remove inline style
                    const onTransitionEnd = function() {
                        answer.style.maxHeight = '';
                        answer.removeEventListener('transitionend', onTransitionEnd);
                    };
                    answer.addEventListener('transitionend', onTransitionEnd);
                }
            });
        }
        
        // Call this after a short delay to ensure all content is rendered
        setTimeout(setInitialMaxHeights, 50);
        
        // For dynamically loaded content (if FAQ items are added later via AJAX)
        // You can export this function to re-init the FAQ toggles
        window.reinitFaqToggles = function() {
            const newQuestions = document.querySelectorAll('.faq-question');
            newQuestions.forEach(question => {
                if (!question.hasListener) {
                    question.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (ACCORDION_MODE) {
                            toggleFaqItemAccordion(this);
                        } else {
                            toggleFaqItem(this);
                        }
                    });
                    question.hasListener = true;
                }
            });
        };
        
        // Console log confirmation (optional, can be removed)
        console.log('FAQ / Questionnaire section initialized ✓ | Accordion mode:', ACCORDION_MODE);
        
    }); // end DOMContentLoaded

})(); // end IIFE