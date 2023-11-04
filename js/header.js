document.addEventListener("DOMContentLoaded", function() {
    const librarySection = document.getElementById('librarySection');
    // Oculta la segunda sección al cargar la página
  
    const homeButton = document.getElementById('homeButton');
    const libraryButtonV1 = document.querySelector('.hero__btn--libraryV1');
  
    homeButton.addEventListener('click', () => {
      document.getElementById('homeSection').style.display = 'block';
      librarySection.style.display = 'none'; // Oculta la segunda sección
    });
  
    libraryButtonV1.addEventListener('click', () => {
      document.getElementById('homeSection').style.display = 'none';
      librarySection.style.display = 'block'; // Muestra la segunda sección
    });
  });
  