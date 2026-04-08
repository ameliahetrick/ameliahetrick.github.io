/* Tippy.js */

$(function() {
  
  $('a[title]').has('img').removeAttr('title');
  
  tippy('a[title]', {
    theme: 'tippyLinkTitle',
    arrow: tippy.roundArrow,
    zIndex: 999,
    maxWidth: 165,
    animation: 'shift-away',
    duration: 500,
    
    content(reference) {
      const title = reference.getAttribute('title');
      reference.removeAttribute('title');
      return title;
    },
  });
});