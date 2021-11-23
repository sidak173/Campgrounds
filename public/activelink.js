const alllinks = document.getElementsByClassName('nav-link');


for (let link of alllinks) {
    if (link.href == window.location.href) {
        link.classList.add('active')
        break;
    }
}