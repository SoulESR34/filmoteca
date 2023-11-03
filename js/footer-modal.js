var footer = document.getElementById('footer');

var modal = document.getElementById('myModal');

var closeModal = document.getElementsByClassName('close')[0];

footer.onclick = function () {
  modal.style.display = 'block';
};

closeModal.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
