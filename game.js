var listeCouleurs = ["rouge", "bleu", "jaune", "vert"];

var fichierSon = {
  rouge: "red",
  bleu: "blue",
  jaune: "yellow",
  vert: "green",
  wrong: "wrong"
};

var sequenceJeu = [];
var sequenceJoueur = [];
var jeuLance = false;
var joueurActif = false;
var niveau = 0;

document.addEventListener("keydown", function () {
  if (!jeuLance) {
    jeuLance = true;
    prochainNiveau();
  }
});

document.querySelectorAll(".tuile").forEach(function (tuile) {
  tuile.addEventListener("click", function () {
    if (!jeuLance) {
      jeuLance = true;
      prochainNiveau();
      return;
    }
    if (!joueurActif) return;

    var couleur = this.id;
    sequenceJoueur.push(couleur);
    jouerSon(couleur);
    animerClic(couleur);
    verifier(sequenceJoueur.length - 1);
  });
});

function verifier(index) {
  if (sequenceJeu[index] !== sequenceJoueur[index]) {
    joueurActif = false;
    jouerSon("wrong");
    document.body.classList.add("perdu");
    document.getElementById("statut").textContent = "Raté ! Appuie sur une touche pour recommencer";
    document.getElementById("statut").className = "perdu";
    setTimeout(function () {
      document.body.classList.remove("perdu");
    }, 600);
    resetJeu();
    return;
  }

  if (sequenceJoueur.length === sequenceJeu.length) {
    joueurActif = false;
    document.getElementById("statut").textContent = "Bravo ! Niveau " + niveau + " réussi";
    document.getElementById("statut").className = "bravo";
    setTimeout(prochainNiveau, 1000);
  } else {
    document.getElementById("statut").textContent = "Continue... " + sequenceJoueur.length + " / " + sequenceJeu.length;
  }
}

function prochainNiveau() {
  sequenceJoueur = [];
  niveau++;

  var index = Math.floor(Math.random() * listeCouleurs.length);
  sequenceJeu.push(listeCouleurs[index]);

  joueurActif = false;
  bloquerTuiles(true);
  document.getElementById("statut").textContent = "Niveau " + niveau + " - Simon joue...";
  document.getElementById("statut").className = "simon";

  jouerSequence();
}

function jouerSequence() {
  var delai = 750;
  if (niveau > 4) delai = 620;
  if (niveau > 8) delai = 500;

  var i = 0;

  setTimeout(function jouerEtape() {
    if (i >= sequenceJeu.length) {
      setTimeout(function () {
        joueurActif = true;
        bloquerTuiles(false);
        document.getElementById("statut").textContent = "À toi ! Répète les " + sequenceJeu.length + " couleurs";
        document.getElementById("statut").className = "joueur";
      }, 400);
      return;
    }
    flasherTuile(sequenceJeu[i]);
    jouerSon(sequenceJeu[i]);
    i++;
    setTimeout(jouerEtape, delai);
  }, 500);
}

function flasherTuile(couleur) {
  var tuile = document.getElementById(couleur);
  tuile.classList.add("illumine");
  setTimeout(function () {
    tuile.classList.remove("illumine");
  }, 450);
}

function animerClic(couleur) {
  var tuile = document.getElementById(couleur);
  tuile.classList.add("actif");
  setTimeout(function () {
    tuile.classList.remove("actif");
  }, 150);
}

function jouerSon(couleur) {
  var audio = new Audio("sounds/" + fichierSon[couleur] + ".mp3");
  audio.play();
}

function bloquerTuiles(bloquer) {
  var tuiles = document.querySelectorAll(".tuile");
  for (var i = 0; i < tuiles.length; i++) {
    if (bloquer) {
      tuiles[i].classList.add("bloquee");
    } else {
      tuiles[i].classList.remove("bloquee");
    }
  }
}

function resetJeu() {
  niveau = 0;
  sequenceJeu = [];
  sequenceJoueur = [];
  jeuLance = false;
  joueurActif = false;
  bloquerTuiles(false);
}
