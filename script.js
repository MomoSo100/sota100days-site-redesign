const images = [
  "images/5I5A7953.jpg",
  "images/5I5A8052.jpg",
  "images/5I5A8086.jpg",
  "images/5I5A8096.jpg",
  "images/5I5A8115.jpg",
  "images/5I5A8126.jpg",
  "images/IMG_2051 のコピー.jpg",
  "images/IMG_3557 のコピー.jpg",
  "images/IMG_4489.JPG",
  "images/IMG_4490.JPG",
  "images/IMG_4491.JPG",
  "images/IMG_4494.JPG",
  "images/IMG_4495.JPG",
  "images/IMG_4496.JPG",
  "images/IMG_7581 2.JPG",
  "images/IMG_8906.PNG",
  "images/souta(1).jpg"
];

const thumbsContainer = document.getElementById("thumbs");
const selectedIcon = document.getElementById("selected-icon");
const selectedLabel = document.getElementById("selected-label");
const randomBtn = document.getElementById("randomBtn");

let currentIndex = 0;

function setBackground(index) {
  const imageUrl = images[index];
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  selectedIcon.src = imageUrl;
  selectedLabel.textContent = imageUrl.replace(/^images\//, "");
  document.querySelectorAll(".thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === index);
  });
  currentIndex = index;
}

function createThumbs() {
  images.forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "thumb";
    thumb.addEventListener("click", () => setBackground(index));

    const img = document.createElement("img");
    img.src = src;
    img.alt = `背景候補 ${index + 1}`;

    thumb.appendChild(img);
    thumbsContainer.appendChild(thumb);
  });
}

function randomBackground() {
  const nextIndex = Math.floor(Math.random() * images.length);
  setBackground(nextIndex);
}

createThumbs();
setBackground(0);
randomBtn.addEventListener("click", randomBackground);
