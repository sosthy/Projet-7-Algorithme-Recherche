import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

//
// Place any custom JS here
//

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new bootstrap.Popover(popover)
  })