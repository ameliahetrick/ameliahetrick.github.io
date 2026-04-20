/* Tippy.js */

$(function() {

  /* calculate maxWidth */
  var computedStyle = getComputedStyle(document.documentElement);
  var bookWidth = parseInt(computedStyle.getPropertyValue('--book-width'), 10);
  var paddingSize = parseInt(computedStyle.getPropertyValue('--padding-size'), 10);
  var borderSize = parseInt(computedStyle.getPropertyValue('--border-size'), 10);
  var max = (bookWidth) + 2*(paddingSize) + 2*(borderSize);
  
  tippy('img[alt]', {
    theme: 'tippyImgAlt',
    arrow: tippy.roundArrow,
    zIndex: 999,
    maxWidth: max,
    animation: 'shift-away',
    duration: [500,500],
    offset: [0,10],
    
    content(reference) {
      const title = reference.getAttribute('alt');
      reference.removeAttribute('alt');
      return title;
    },
    
    onUntrigger(instance) {
      instance.setProps({theme: 'tippyLinkTitle'});
    },
  });
  
  
  /* when user hovers over image, take average color of
   * image and set as tooltip background color 
   *
   * https://stackoverflow.com/a/47604126
   * https://stackoverflow.com/a/33710822
   * https://stackoverflow.com/a/4070010
   */
   
  var image = document.createElement('img');
  image.crossOrigin = 'Anonymous';
  
  var boxes = $('.gr_grid_container img');
  
  $(boxes).on('mouseenter', function() {
    image.src = $(this).attr('src');
    $(boxes).removeClass('img_default');
    $(this).addClass('img_hover');
    $(boxes).not($(this)).addClass('img_sibling_hover');
    
    image.onload = function() {
      var rgbRaw = getAverageRGB(image);
      var rgb = 'rgb(' + rgbRaw.r + ',' + rgbRaw.g + ',' + rgbRaw.b + ')';
      $('.tippy-box[data-theme~="tippyImgAlt"]').css('backgroundColor', rgb);
      $('.tippy-box[data-theme~="tippyImgAlt"] .tippy-svg-arrow').css('fill', rgb);
      
      $('.tippy-box[data-theme~="tippyImgAlt"]').each(function() {
        $(this).css('color', isDark(rgbRaw.r, rgbRaw.g, rgbRaw.b) ? 'black' : 'white');
      });
    }
    
    /* pick appropriate text color for tooltip:
     * black text for light background, 
     * white text for dark background
     *
     * https://stackoverflow.com/a/6750718
     * https://stackoverflow.com/a/46470178
     * https://harthur.github.io/brain/
     */
    function isDark(r, g, b) {
      return ((r * 299)
          + (g * 587)
          + (b * 114))/1000
            >= 186;
    }
    
  }).on('mouseleave', function() {
    $(boxes).removeClass('img_sibling_hover');
    $(this).removeClass('img_hover');
    $(boxes).addClass('img_default');
  });;
});


/* calculate average color for image 
 *
 * https://stackoverflow.com/a/2541680
 */
function getAverageRGB(imgEl) {

  var blockSize = 25,
    defaultRGB = {r:0, g:0, b:0},
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data, width, height,
    i = -4,
    length,
    rgb = {r:0, g:0, b:0},
    count = 0;
    
  if (!context) {
    return defaultRGB;
  }
  
  height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  
  context.drawImage(imgEl, 0, 0);
  
  try {
    data = context.getImageData(0, 0, width, height);
  } catch(e) {
    return defaultRGB;
  }
  
  length = data.data.length;
  
  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
  }
  
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);
  
  return rgb;
}