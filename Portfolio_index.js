document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");
  const navHeight = document.querySelector(".navbar").offsetHeight;
  const themeToggle = document.getElementById("theme-toggle");
  const revealWords = document.querySelectorAll(".reveal");

  // Burger menu
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      burger.classList.toggle("active"); // animation X
    });
  }

  // Smooth scroll
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - navHeight;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        navLinks.classList.remove("active");
        burger.classList.remove("active");
      }
    });
  });

  // Theme toggle
  if (themeToggle) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light");
      themeToggle.textContent = "☀️";
    }
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      if (document.body.classList.contains("light")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "light");
      } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // Fancy reveal animation
  if (revealWords.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          revealWords.forEach((word, i) => setTimeout(() => word.classList.add("show"), i*400));
        } else {
          revealWords.forEach(word => word.classList.remove("show"));
        }
      });
    }, { threshold: 0.5 });
    revealWords.forEach(word => observer.observe(word));
  }

  // Hero canvas background
  const canvas = document.getElementById("heroCanvas");
  if(canvas) {
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const lines = [];
    const lineCount = 80;
    for(let i=0; i<lineCount; i++){
      lines.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        length: 30+Math.random()*70,
        speed: 0.5+Math.random(),
        angle: Math.random()*Math.PI*2,
        nodeOffset: Math.random()*50
      });
    }

    function drawLines() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      lines.forEach(line=>{
        const x2 = line.x + Math.cos(line.angle)*line.length;
        const y2 = line.y + Math.sin(line.angle)*line.length;

        ctx.strokeStyle = 'rgba(0,255,255,0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(line.x,line.y);
        ctx.lineTo(x2,y2);
        ctx.stroke();

        const t = (Date.now()*0.002+line.nodeOffset)%1;
        const nodeX = line.x + Math.cos(line.angle)*line.length*t;
        const nodeY = line.y + Math.sin(line.angle)*line.length*t;
        const radius = 2+Math.sin(Date.now()*0.005+line.nodeOffset)*1.5;
        const gradient = ctx.createRadialGradient(nodeX,nodeY,0,nodeX,nodeY,radius);
        gradient.addColorStop(0,'rgba(0,255,255,0.8)');
        gradient.addColorStop(1,'rgba(0,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nodeX,nodeY,radius,0,Math.PI*2);
        ctx.fill();

        line.x += Math.cos(line.angle)*line.speed;
        line.y += Math.sin(line.angle)*line.speed;
        if(line.x<0 || line.x>canvas.width || line.y<0 || line.y>canvas.height){
          line.x = Math.random()*canvas.width;
          line.y = Math.random()*canvas.height;
          line.angle = Math.random()*Math.PI*2;
        }
      });
      requestAnimationFrame(drawLines);
    }
    drawLines();
  }

  // Accordion for project cards
  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const isExpanded = card.classList.contains('expanded');
        projectCards.forEach(c => c.classList.remove('expanded'));
        if (!isExpanded) card.classList.add('expanded');
      });
    });
  }

  // Link click handling inside project lists
  document.querySelectorAll('.project-list a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.stopPropagation();
      document.querySelectorAll('.project-list li').forEach(li => li.classList.remove('clicked'));
      const parentLi = this.closest('li');
      if (parentLi) parentLi.classList.add('clicked');
    });
  });

});
// Back to Top button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if(window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// About Me modal
const aboutCards = document.querySelectorAll('.aboutme-card');
const aboutModal = document.getElementById('aboutModal');
const aboutModalClose = document.querySelector('.about-modal-close');
const aboutModalInner = document.querySelector('.about-modal-inner');
const aboutModalText = document.getElementById('aboutModalText');
const aboutModalTitle = document.getElementById('aboutModalTitle');
const aboutTopics = document.getElementById('aboutTopics');

// Modal content
const aboutData = {
  academic: {
    topics: [
      { name: "Network Engineering", img: "server1.png", text: "Right after high school, I dove into the world of network cables and Wi-Fi signals at Network Engineering college. My first love? Flowcharts. My first crush? HTML, CSS, and JavaScript" },
      { name: "Graphic Arts", img: "letterpress.png", text: "At Graphic Arts college, I shaped the creative side of my career. I explored everything from traditional and modern printing to graphic, brand, and web design, while even sneaking in some Pascal software programming lessons (geek alert!). Combining this with my network engineering background, I became a tech-savvy designer who can talk both code and color" },
      { name: "Project Management", img: "projectmanagement3.png", text: "After juggling a few real-world project management tasks, I decided to level up my skills with a university course. Now I can manage timelines, teams, and tasks—and still keep my sanity… most of the time" },
      { name: "Software Engineering with Python", img: "python.png", text: "I dove into a university course to level up my coding skills and meet Python face-to-face. Why Python? Because whether it’s software engineering, data analysis, or data science, Python is basically the Swiss Army knife of tech—and who doesn’t love a good multitool?" },
      { name: "Web Development", img: "webdesign1.png", text: "Even though I had studied web development before, I enrolled in this university course to refresh my skills and level up with the latest frameworks and tools. Learning, learning, learning! It’s all about keeping up with the trends, sharpening my craft, and having a good excuse to dive back into code" }
    ]
  },
  professional: {
    topics: [
      { name: "Graphic Arts", img: "css.png", text: "Started as a humble printing technician, followed the path to web design. The journey was full of ink stains, tangled cables, late-night CSS battles, and the occasional “why isn’t this pixel aligned?!” moments. Each step taught me to mix creativity with technology, transforming ideas from paper sketches into interactive experiences that actually work. By the end, I wasn’t just a designer—I was a tech-savvy storyteller" },
      { name: "Online Travel Agency", img: "tickets2.png", text: "Started as a humble JavaScript troubleshooter, followed the path to the travel agency’s digital systems. Along the way, I got familiar with booking systems, CRM platforms, and payment methods, turning tech knowledge into smooth travel experiences" },
      { name: "Airport", img: "airport2.png", text: "Started as a humble airport ground operations staff, followed the path to department workforce planning and B2B project management. Along the way, I learned to coordinate people, schedules, and projects—keeping everything running on time, even when flights didn’t" },
      { name: "Digital Systems Testing", img: "digitalqa.png", text: "Started as a humble digital content reviewer, followed the path to digital system QA tester. Along the way, I learned to spot bugs, test features, and make sure everything works smoothly—turning digital chaos into reliable, user-friendly systems" },
      { name: "Prosess Architecture", img: "process.png", text: "Started as a humble QA, followed the path to process specialist. Along the way, I learned to map out workflows, write manuals, and design automations—turning complex, messy operations into smooth-running, almost magical systems. It’s the same company, but now I get to play both architect and problem-solver" }
    ]
  },
  personal: {
    topics: [
      { name: "Tennis", img: "tennis2.png", text: "Playing tennis—and yes, I’m good enough to make it look effortless… most of the time. Bonus points if I don’t hit myself with the racket" },
      { name: "Trumpet", img: "trumpet.png", text: "I’ve been playing music since I was a kid—and people have no idea how similar music composition is to software engineering. Notes, rhythms, and harmonies? Think of them as code, algorithms, and bug fixes… just with more brass and fewer semicolons" },
      { name: "Sailing", img: "sailing.png", text: "In Greece, the sea is basically your backyard—never more than 150 km away. So I sail. It’s relaxing, adventurous, and occasionally feels like trying to deploy code on a Friday, so Ahoy" },
      { name: "Hiking", img: "hiking.png", text: "Just find your way—it’s wild out there! Hiking is like real-life debugging: lots of trial and error, unexpected obstacles, and the sweet victory of finally reaching the summit" },
      { name: "Cooking", img: "cooking1.png", text: "I cook for one simple reason: to eat whatever I want, exactly the way I like it. It’s like coding—follow the recipe if you must, but the fun begins when you improvise" }
    ]
  }
};

// Open modal
aboutCards.forEach(card => {
  card.addEventListener('click', () => {
    const category = card.getAttribute('data-category');
    const categoryData = aboutData[category];

    if (categoryData) {
      aboutTopics.innerHTML = '';
      aboutModalInner.style.backgroundImage = `url(${card.querySelector('img').src})`;

      // Standard open modal text
      aboutModalTitle.textContent = card.querySelector('h3').textContent;
      aboutModalText.textContent = "Choose a topic to see more";

      categoryData.topics.forEach(topic => {
        const btn = document.createElement('button');
        btn.textContent = topic.name;
        btn.addEventListener('click', () => {
          aboutModalInner.style.backgroundImage = `url(${topic.img})`;
          aboutModalTitle.textContent = topic.name;   // ✅ display title
          aboutModalText.textContent = topic.text;    // ✅ displa text
        });
        aboutTopics.appendChild(btn);
      });

      aboutModal.style.display = 'flex';
    }
  });
});

// Close modal
aboutModalClose.addEventListener('click', () => {
  aboutModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    aboutModal.style.display = 'none';
  }
});
