/**
 * destination.js
 * Reads ?dest=<id> from the URL, fetches data.json,
 * and renders the destination page dynamically.
 */

(function () {
    const params = new URLSearchParams(window.location.search);
    const destId = params.get('dest');

    if (!destId) {
        window.location.href = 'destinations.html';
        return;
    }

    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            const dest = data.destinations.find(d => d.id === destId);
            if (!dest) {
                window.location.href = 'destinations.html';
                return;
            }
            renderPage(dest);
        })
        .catch(() => {
            window.location.href = 'destinations.html';
        });

    function renderPage(dest) {
        // --- Title & Meta ---
        document.title = `${dest.name} Tour Packages — WE PLAN TRIPS`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', `Explore ${dest.name} tour packages by WE PLAN TRIPS. ${dest.subtitle}.`);

        // --- Hero ---
        const heroBg = document.querySelector('.page-hero__bg');
        if (heroBg) heroBg.style.backgroundImage = `url('${dest.image}')`;

        const heroLabel = document.querySelector('.page-hero__label');
        if (heroLabel) heroLabel.textContent = dest.country;

        const heroTitle = document.querySelector('.page-hero__title');
        if (heroTitle) heroTitle.textContent = dest.name;

        const heroSubtitle = document.querySelector('.page-hero__subtitle');
        if (heroSubtitle) heroSubtitle.textContent = dest.subtitle;

        // --- Breadcrumb ---
        const bcDest = document.querySelector('.breadcrumb__current');
        if (bcDest) bcDest.textContent = dest.name;

        // --- Overview ---
        const overviewTitle = document.querySelector('.dest-overview__title');
        if (overviewTitle) overviewTitle.innerHTML = `Explore <span>${dest.name}</span>`;

        const overviewText = document.querySelector('.dest-overview__text');
        if (overviewText) overviewText.textContent = dest.description;

        const overviewImg = document.querySelector('.dest-overview__img');
        if (overviewImg) {
            overviewImg.src = dest.image;
            overviewImg.alt = dest.name;
        }

        const tagsContainer = document.querySelector('.dest-overview__highlights');
        if (tagsContainer) {
            tagsContainer.innerHTML = dest.tags
                .map(tag => `<span class="dest-overview__tag">${tag}</span>`)
                .join('');
        }

        // --- Packages section heading ---
        const pkgTitle = document.querySelector('.tour-packages .section-title');
        if (pkgTitle) pkgTitle.innerHTML = `${dest.name} <span>Packages</span>`;

        const pkgSubtitle = document.querySelector('.tour-packages .section-subtitle');
        if (pkgSubtitle) pkgSubtitle.textContent = `Browse our curated ${dest.name} experiences`;

        // --- Package cards ---
        const grid = document.querySelector('.tour-packages__grid');
        if (!grid) return;

        if (!dest.packages || dest.packages.length === 0) {
            grid.innerHTML = `
        <div class="pkg-coming-soon">
          <div class="pkg-coming-soon__icon">🌍</div>
          <h3>Packages Coming Soon</h3>
          <p>We are curating exclusive ${dest.name} travel experiences. Get in touch to express interest and be the first to know when packages become available.</p>
          <a href="index.html#contact" class="btn-primary">Enquire About ${dest.name}</a>
        </div>`;
            return;
        }

        grid.innerHTML = dest.packages.map(pkg => `
      <div class="tour-card">
        <div class="tour-card__img-wrap">
          <img src="${dest.image}" alt="${pkg.name}" class="tour-card__img" loading="lazy">
          <span class="tour-card__duration">${pkg.duration}</span>
        </div>
        <div class="tour-card__body">
          <h3 class="tour-card__name">${pkg.name}</h3>
          <div class="tour-card__highlights">
            ${pkg.highlights.map(h => `<span class="tour-card__highlight">${h}</span>`).join('')}
          </div>
          <div class="tour-card__footer">
            <div><span class="tour-card__price-label">Enquire for Price</span></div>
            <a href="index.html#contact" class="tour-card__cta">Enquire Now</a>
          </div>
        </div>
      </div>`).join('');
    }
})();
