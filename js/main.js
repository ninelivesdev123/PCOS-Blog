// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.querySelector('.mobile-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      toggle.textContent = navLinks.classList.contains('active') ? '\u2715' : '\u2630';
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        toggle.textContent = '\u2630';
      });
    });
  }

  // Set active nav link based on current page
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Newsletter form handler
  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = this.querySelector('input');
      if (input && input.value) {
        alert('Vielen Dank! Du wirst ab sofort unseren Newsletter erhalten.');
        input.value = '';
      }
    });
  }

  // ========== Portionsrechner ==========
  initPortionsrechner();

  // ========== Wochenplan Generator ==========
  initWochenplan();
});

// ========== PORTIONSRECHNER ==========
function initPortionsrechner() {
  var container = document.querySelector('.ingredient-list');
  if (!container) return;

  // Find the recipe-meta-grid to get base portions
  var metaGrid = document.querySelector('.recipe-meta-grid');
  if (!metaGrid) return;

  var portionenItem = null;
  var metaItems = metaGrid.querySelectorAll('.recipe-meta-item');
  metaItems.forEach(function(item) {
    var label = item.querySelector('.label');
    if (label && label.textContent.trim().toLowerCase() === 'portionen') {
      portionenItem = item;
    }
  });
  if (!portionenItem) return;

  var basePortions = parseInt(portionenItem.querySelector('.value').textContent) || 2;

  // Parse all ingredient amounts
  var ingredientLists = document.querySelectorAll('.ingredient-list ul');
  var originalIngredients = [];
  ingredientLists.forEach(function(list) {
    var items = list.querySelectorAll('li');
    items.forEach(function(li) {
      originalIngredients.push(li.textContent.trim());
    });
  });

  // Create portion adjuster UI
  var adjuster = document.createElement('div');
  adjuster.className = 'portion-adjuster';
  adjuster.innerHTML =
    '<div class="portion-control">' +
      '<span class="portion-label">Portionen anpassen:</span>' +
      '<button class="portion-btn portion-minus" aria-label="Weniger Portionen">-</button>' +
      '<span class="portion-count">' + basePortions + '</span>' +
      '<button class="portion-btn portion-plus" aria-label="Mehr Portionen">+</button>' +
    '</div>';

  // Insert before first ingredient list
  container.parentNode.insertBefore(adjuster, container);

  var currentPortions = basePortions;
  var countDisplay = adjuster.querySelector('.portion-count');
  var minusBtn = adjuster.querySelector('.portion-minus');
  var plusBtn = adjuster.querySelector('.portion-plus');

  minusBtn.addEventListener('click', function() {
    if (currentPortions > 1) {
      currentPortions--;
      updatePortions();
    }
  });

  plusBtn.addEventListener('click', function() {
    if (currentPortions < 20) {
      currentPortions++;
      updatePortions();
    }
  });

  function updatePortions() {
    countDisplay.textContent = currentPortions;
    portionenItem.querySelector('.value').textContent = currentPortions;

    var factor = currentPortions / basePortions;
    var idx = 0;
    ingredientLists.forEach(function(list) {
      var items = list.querySelectorAll('li');
      items.forEach(function(li) {
        li.textContent = scaleIngredient(originalIngredients[idx], factor);
        idx++;
      });
    });

    // Update calories if present
    metaItems.forEach(function(item) {
      var label = item.querySelector('.label');
      var value = item.querySelector('.value');
      if (!label || !value) return;
      var labelText = label.textContent.trim().toLowerCase();
      if (labelText === 'kalorien' || labelText === 'protein' || labelText === 'ballaststoffe' || labelText === 'kohlenhydrate') {
        var origValue = value.getAttribute('data-orig');
        if (!origValue) {
          origValue = value.textContent;
          value.setAttribute('data-orig', origValue);
        }
        var num = parseFloat(origValue.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (!isNaN(num)) {
          var scaled = Math.round(num * factor);
          value.textContent = origValue.replace(/[\d.,]+/, scaled);
        }
      }
    });
  }

  function scaleIngredient(text, factor) {
    // Match numbers at the start (including fractions like 1/2)
    return text.replace(/^([\d.,\/]+)/, function(match) {
      if (match.indexOf('/') !== -1) {
        var parts = match.split('/');
        var num = parseFloat(parts[0]) / parseFloat(parts[1]);
        var scaled = num * factor;
        return formatNumber(scaled);
      }
      var n = parseFloat(match.replace(',', '.'));
      if (isNaN(n)) return match;
      var scaled = n * factor;
      return formatNumber(scaled);
    });
  }

  function formatNumber(n) {
    if (n === Math.floor(n)) return String(n);
    return n.toFixed(1).replace('.', ',').replace(',0', '');
  }
}

// ========== WOCHENPLAN GENERATOR ==========
var ALL_RECIPES = {
  fruehstueck: [
    { name: "Overnight Oats mit Zimt und Äpfeln", url: "rezepte/overnight-oats.html", kcal: 350, zeit: "10 Min." },
    { name: "Rührei mit Avocado und Tomaten", url: "rezepte/ruehrei-avocado.html", kcal: 380, zeit: "15 Min." },
    { name: "Griechischer Joghurt mit Granola", url: "rezepte/joghurt-granola.html", kcal: 340, zeit: "10 Min." },
    { name: "Haferflocken-Bananen-Pancakes", url: "rezepte/haferflocken-pancakes.html", kcal: 370, zeit: "20 Min." },
    { name: "Spinat-Feta-Omelett", url: "rezepte/spinat-omelett.html", kcal: 360, zeit: "15 Min." },
    { name: "Quinoa-Frühstücksbrei mit Beeren", url: "rezepte/quinoa-fruehstueck.html", kcal: 330, zeit: "20 Min." },
    { name: "Grüne Smoothie Bowl mit Matcha", url: "rezepte/smoothie-bowl.html", kcal: 300, zeit: "10 Min." },
    { name: "Vollkorn-Avocado-Toast mit Ei", url: "rezepte/avocado-toast.html", kcal: 390, zeit: "10 Min." },
    { name: "Beeren-Chia-Pudding mit Walnüssen", url: "rezepte/chia-pudding.html", kcal: 380, zeit: "10 Min." },
    { name: "Buchweizen-Pfannkuchen mit Blaubeeren", url: "rezepte/buchweizen-pfannkuchen.html", kcal: 400, zeit: "20 Min." }
  ],
  mittagessen: [
    { name: "Anti-entzündliche Kurkuma-Bowl", url: "rezepte/kurkuma-bowl.html", kcal: 450, zeit: "30 Min." },
    { name: "Hähnchen-Gemüse-Wok mit Ingwer", url: "rezepte/haehnchen-wok.html", kcal: 420, zeit: "25 Min." },
    { name: "Mediterraner Kichererbsen-Salat", url: "rezepte/kichererbsen-salat.html", kcal: 380, zeit: "15 Min." },
    { name: "Quinoa-Taboulé mit frischen Kräutern", url: "rezepte/quinoa-taboule.html", kcal: 350, zeit: "20 Min." },
    { name: "Süßkartoffel-Kokos-Curry", url: "rezepte/suesskartoffel-curry.html", kcal: 440, zeit: "35 Min." },
    { name: "Thunfisch-Avocado-Bowl", url: "rezepte/thunfisch-bowl.html", kcal: 410, zeit: "15 Min." },
    { name: "Bunte Gemüse-Frittata", url: "rezepte/gemuese-frittata.html", kcal: 370, zeit: "25 Min." },
    { name: "Rote-Bete-Hummus-Wrap", url: "rezepte/hummus-wrap.html", kcal: 390, zeit: "15 Min." },
    { name: "Blumenkohl-Reis-Bowl mit Erdnuss-Sauce", url: "rezepte/blumenkohl-reis.html", kcal: 360, zeit: "25 Min." },
    { name: "Linsensuppe mit Kurkuma und Ingwer", url: "rezepte/linsensuppe.html", kcal: 320, zeit: "30 Min." }
  ],
  abendessen: [
    { name: "Lachs mit Brokkoli und Süßkartoffel", url: "rezepte/lachs-brokkoli.html", kcal: 520, zeit: "35 Min." },
    { name: "Zucchini-Nudeln mit Pesto", url: "rezepte/zucchini-nudeln.html", kcal: 350, zeit: "15 Min." },
    { name: "Putenbrust mit grünem Spargel", url: "rezepte/putenbrust-spargel.html", kcal: 380, zeit: "25 Min." },
    { name: "Garnelen mit Pak Choi und Sesam", url: "rezepte/garnelen-pak-choi.html", kcal: 350, zeit: "20 Min." },
    { name: "Low-Carb Auberginen-Lasagne", url: "rezepte/auberginen-lasagne.html", kcal: 420, zeit: "50 Min." },
    { name: "Hähnchen-Brokkoli-Auflauf", url: "rezepte/haehnchen-auflauf.html", kcal: 440, zeit: "40 Min." },
    { name: "Gefüllte Paprika mit Quinoa und Feta", url: "rezepte/gefuellte-paprika.html", kcal: 400, zeit: "40 Min." },
    { name: "Kabeljau mit Zitronen-Kräuter-Kruste", url: "rezepte/kabeljau-kraeuter.html", kcal: 370, zeit: "30 Min." },
    { name: "Kürbis-Risotto mit Blumenkohlreis", url: "rezepte/kuerbis-risotto.html", kcal: 360, zeit: "35 Min." },
    { name: "Rinderstreifen mit Paprika und Brokkoli", url: "rezepte/rinderstreifen-paprika.html", kcal: 430, zeit: "25 Min." }
  ],
  snacks: [
    { name: "Grüner Smoothie mit Spinat und Avocado", url: "rezepte/gruener-smoothie.html", kcal: 280, zeit: "5 Min." },
    { name: "Energie-Bällchen mit Datteln und Kakao", url: "rezepte/energie-baellchen.html", kcal: 180, zeit: "15 Min." },
    { name: "Würzig geröstete Kichererbsen", url: "rezepte/geroestete-kichererbsen.html", kcal: 160, zeit: "30 Min." },
    { name: "Golden Milk - Kurkuma-Latte", url: "rezepte/golden-milk.html", kcal: 120, zeit: "5 Min." },
    { name: "Guacamole mit bunten Gemüsesticks", url: "rezepte/guacamole.html", kcal: 200, zeit: "10 Min." },
    { name: "Mandel-Kokos-Riegel ohne Zucker", url: "rezepte/mandel-kokos-riegel.html", kcal: 190, zeit: "20 Min." },
    { name: "Anti-Entzündungs-Tee", url: "rezepte/anti-entzuendungs-tee.html", kcal: 15, zeit: "10 Min." }
  ]
};

var WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

function initWochenplan() {
  var container = document.getElementById('wochenplan-app');
  if (!container) return;

  var generateBtn = container.querySelector('#generate-plan');
  var planOutput = container.querySelector('#plan-output');
  var printBtn = container.querySelector('#print-plan');
  var prefVegan = container.querySelector('#pref-vegetarisch');
  var prefSchnell = container.querySelector('#pref-schnell');

  if (generateBtn) {
    generateBtn.addEventListener('click', function() {
      generatePlan(planOutput, prefVegan, prefSchnell);
      if (printBtn) printBtn.style.display = 'inline-flex';
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', function() {
      printPlan();
    });
  }
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

function pickRandom(arr, count) {
  var shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function isVegetarisch(recipe) {
  var meat = ['Hähnchen', 'Putenbrust', 'Garnelen', 'Lachs', 'Thunfisch', 'Kabeljau', 'Rinderstreifen', 'Rührei'];
  for (var i = 0; i < meat.length; i++) {
    if (recipe.name.indexOf(meat[i]) !== -1) return false;
  }
  return true;
}

function isSchnell(recipe) {
  var zeit = parseInt(recipe.zeit);
  return zeit <= 20;
}

function generatePlan(output, prefVegan, prefSchnell) {
  var filterVeg = prefVegan && prefVegan.checked;
  var filterSchnell = prefSchnell && prefSchnell.checked;

  var fruehstueck = ALL_RECIPES.fruehstueck.slice();
  var mittagessen = ALL_RECIPES.mittagessen.slice();
  var abendessen = ALL_RECIPES.abendessen.slice();
  var snacks = ALL_RECIPES.snacks.slice();

  if (filterVeg) {
    fruehstueck = fruehstueck.filter(isVegetarisch);
    mittagessen = mittagessen.filter(isVegetarisch);
    abendessen = abendessen.filter(isVegetarisch);
    snacks = snacks.filter(isVegetarisch);
  }

  if (filterSchnell) {
    fruehstueck = fruehstueck.filter(isSchnell);
    mittagessen = mittagessen.filter(isSchnell);
    abendessen = abendessen.filter(isSchnell);
    snacks = snacks.filter(isSchnell);
  }

  var f = pickRandom(fruehstueck, 7);
  var m = pickRandom(mittagessen, 7);
  var a = pickRandom(abendessen, 7);
  var s = pickRandom(snacks, 7);

  var html = '<div class="plan-grid">';
  var totalKcal = 0;

  for (var i = 0; i < 7; i++) {
    var dayKcal = 0;
    var fr = f[i % f.length];
    var mi = m[i % m.length];
    var ab = a[i % a.length];
    var sn = s[i % s.length];
    dayKcal = fr.kcal + mi.kcal + ab.kcal + sn.kcal;
    totalKcal += dayKcal;

    html += '<div class="plan-day">';
    html += '<div class="plan-day-header">' + WOCHENTAGE[i] + '</div>';
    html += '<div class="plan-meal"><span class="plan-meal-label">Frühstück</span>';
    html += '<a href="' + fr.url + '">' + fr.name + '</a>';
    html += '<span class="plan-meal-meta">' + fr.kcal + ' kcal · ' + fr.zeit + '</span></div>';
    html += '<div class="plan-meal"><span class="plan-meal-label">Mittagessen</span>';
    html += '<a href="' + mi.url + '">' + mi.name + '</a>';
    html += '<span class="plan-meal-meta">' + mi.kcal + ' kcal · ' + mi.zeit + '</span></div>';
    html += '<div class="plan-meal"><span class="plan-meal-label">Abendessen</span>';
    html += '<a href="' + ab.url + '">' + ab.name + '</a>';
    html += '<span class="plan-meal-meta">' + ab.kcal + ' kcal · ' + ab.zeit + '</span></div>';
    html += '<div class="plan-meal"><span class="plan-meal-label">Snack</span>';
    html += '<a href="' + sn.url + '">' + sn.name + '</a>';
    html += '<span class="plan-meal-meta">' + sn.kcal + ' kcal · ' + sn.zeit + '</span></div>';
    html += '<div class="plan-day-total">~' + dayKcal + ' kcal</div>';
    html += '</div>';
  }

  html += '</div>';
  html += '<div class="plan-summary">Wochendurchschnitt: ~' + Math.round(totalKcal / 7) + ' kcal/Tag</div>';

  output.innerHTML = html;
}

function printPlan() {
  var planContent = document.getElementById('plan-output');
  if (!planContent) return;
  var printWindow = window.open('', '_blank');
  printWindow.document.write('<!DOCTYPE html><html><head><title>PCOS Wochenplan</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body{font-family:Inter,sans-serif;padding:2rem;color:#1e1b4b}');
  printWindow.document.write('h1{text-align:center;color:#7c3aed;margin-bottom:1.5rem}');
  printWindow.document.write('.plan-grid{display:grid;grid-template-columns:1fr;gap:1rem}');
  printWindow.document.write('.plan-day{border:1px solid #e5e7eb;border-radius:8px;padding:1rem;page-break-inside:avoid}');
  printWindow.document.write('.plan-day-header{font-weight:700;font-size:1.1rem;color:#7c3aed;margin-bottom:0.5rem;border-bottom:2px solid #ede9fe;padding-bottom:0.5rem}');
  printWindow.document.write('.plan-meal{padding:0.3rem 0;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline}');
  printWindow.document.write('.plan-meal-label{font-weight:600;min-width:100px;font-size:0.85rem;color:#6b7280}');
  printWindow.document.write('.plan-meal a{color:#1e1b4b;text-decoration:none;font-weight:500}');
  printWindow.document.write('.plan-meal-meta{font-size:0.8rem;color:#9ca3af}');
  printWindow.document.write('.plan-day-total{text-align:right;font-weight:600;font-size:0.9rem;color:#7c3aed;margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid #e5e7eb}');
  printWindow.document.write('.plan-summary{text-align:center;font-weight:600;margin-top:1rem;color:#7c3aed}');
  printWindow.document.write('</style></head><body>');
  printWindow.document.write('<h1>Mein PCOS Wochenplan</h1>');
  printWindow.document.write(planContent.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
