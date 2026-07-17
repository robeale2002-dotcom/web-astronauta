const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

if (year) year.textContent = new Date().getFullYear();

const closeMenu = () => {
  if (!toggle || !nav) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
  nav.classList.remove("is-open");
  document.body.style.overflow = "";
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    nav.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = isOpen ? "" : "hidden";
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("video[autoplay]").forEach((video) => {
  if (reduceMotion) {
    video.pause();
    return;
  }

  video.play().catch(() => {
    video.setAttribute("controls", "");
  });
});

const videoModal = document.querySelector("[data-video-modal]");
const videoModalPanel = videoModal?.querySelector("[role='dialog']");
const videoModalTitle = videoModal?.querySelector("[data-modal-title]");
const videoModalDescription = videoModal?.querySelector("[data-modal-description]");
const videoStatus = videoModal?.querySelector("[data-video-status]");
const modalPlayer = videoModal?.querySelector("[data-modal-player]");
let videoModalTrigger = null;

const closeVideoModal = () => {
  if (!videoModal) return;
  videoModal.hidden = true;
  document.body.style.overflow = "";
  if (videoStatus) videoStatus.textContent = "";
  if (modalPlayer) {
    modalPlayer.pause();
    modalPlayer.removeAttribute("src");
    modalPlayer.hidden = true;
  }
  videoModalTrigger?.focus();
};

document.querySelectorAll("[data-open-video]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!videoModal || !videoModalTitle || !videoModalDescription) return;
    videoModalTrigger = trigger;
    videoModalTitle.textContent = trigger.dataset.videoTitle || "Vídeo de viaje";
    videoModalDescription.textContent =
      trigger.dataset.videoDescription || "Descubre una nueva forma de mirar España.";
    if (modalPlayer) {
      const source = trigger.dataset.videoSrc;
      if (source) {
        modalPlayer.src = source;
        modalPlayer.hidden = false;
        modalPlayer.load();
      } else {
        modalPlayer.hidden = true;
      }
    }
    videoModal.hidden = false;
    document.body.style.overflow = "hidden";
    videoModalPanel?.focus();
  });
});

videoModal?.querySelectorAll("[data-close-video]").forEach((control) => {
  control.addEventListener("click", closeVideoModal);
});

videoModal?.querySelector("[data-watch-video]")?.addEventListener("click", () => {
  if (videoStatus) {
    videoStatus.textContent =
      "Estructura preparada: el episodio estará disponible próximamente.";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal && !videoModal.hidden) closeVideoModal();
});
