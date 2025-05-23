document.addEventListener("DOMContentLoaded", function() {
    const socialMediaLinks = document.querySelectorAll('footer a');

    socialMediaLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const url = this.href;
            
            window.location.href = url;
        });
    });
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
document.getElementById("myBtn").onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
