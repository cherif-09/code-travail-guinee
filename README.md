# Code du Travail — République de Guinée

Plateforme de consultation du Code du travail guinéen : recherche par numéro d'article
ou par mot-clé, texte officiel, explication en langage clair et conseil RH pour chaque
article, plus des synthèses thématiques.

Site **statique** (HTML + JSON), sans base de données ni serveur applicatif : il peut
être hébergé gratuitement et mis à jour quand vous voulez.

---

## 1. Structure du projet

```
index.html            → la page (recherche, affichage, navigation) — à ne pas modifier en principe
data/
  articles.json       → le texte officiel des 509 articles (change rarement)
  explanations.json   → les explications + conseils RH (c'est ici que vous corrigez/ajoutez)
  themes.json         → les synthèses thématiques
README.md             → ce fichier
```

Le contenu est **séparé du code** : pour mettre à jour, vous touchez seulement aux
fichiers du dossier `data/`, jamais au `index.html`.

---

## 2. Mettre à jour le contenu

### Corriger une explication ou un conseil RH
Ouvrez `data/explanations.json`. Chaque article y est repéré par son numéro :

```json
"172.6": {
  "e": "Texte de l'explication en langage clair…",
  "r": "Texte du conseil RH…"
}
```

- `"e"` = explication, `"r"` = conseil RH.
- Modifiez le texte entre les guillemets, enregistrez, redéployez (voir §3).
- Attention : gardez les guillemets `"` et la virgule à la fin de chaque bloc.
  Pour un guillemet à l'intérieur d'un texte, écrivez `\"`.

### Ajouter / corriger un thème (synthèse)
Ouvrez `data/themes.json` (c'est une liste). Copiez un bloc existant et adaptez :
`label` (nom du thème), `q` (recherche associée), `match` (mots déclencheurs),
`title`, `body` (paragraphes) et `refs` (numéros d'articles clés).

### Vérifier que le JSON est valide
Un JSON mal formé empêche la page de charger. Collez le fichier sur
https://jsonlint.com pour vérifier avant de redéployer.

### Tester en local (facultatif)
Le site doit être servi par un serveur web (pas ouvert par double-clic).
Dans le dossier, lancez :
```
python3 -m http.server 8000
```
puis ouvrez http://localhost:8000 dans votre navigateur.

---

## 3. Déploiement — GitHub + Vercel (recommandé)

### A. Mettre le projet sur GitHub (une seule fois)
1. Créez un compte sur https://github.com puis un **nouveau dépôt** (repository),
   par ex. `code-travail-guinee` (public).
2. Envoyez-y ce dossier. En ligne de commande, depuis le dossier :
   ```
   git init
   git add .
   git commit -m "Version initiale"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/code-travail-guinee.git
   git push -u origin main
   ```
   (Ou utilisez le bouton « Add file → Upload files » sur github.com pour glisser
   `index.html` et le dossier `data/`.)

### B. Publier avec Vercel (une seule fois)
1. Créez un compte sur https://vercel.com avec votre compte GitHub.
2. **Add New → Project** → importez le dépôt `code-travail-guinee`.
3. Framework Preset : **Other** (aucun). Laissez le reste vide → **Deploy**.
4. En ~1 minute, vous obtenez une URL publique du type
   `https://code-travail-guinee.vercel.app` — à partager largement.

### C. Mises à jour (à chaque fois, quand vous voulez)
Modifiez un fichier de `data/`, puis :
```
git add .
git commit -m "Mise à jour des explications"
git push
```
Vercel redéploie **automatiquement** en moins d'une minute. C'est tout.

> Alternative sans Git : sur **Netlify** (https://app.netlify.com), onglet
> « Deploys », vous pouvez **glisser-déposer** le dossier du site pour publier,
> et re-déposer le dossier à jour à chaque modification.

---

## 4. Nom de domaine (optionnel)

Pour une adresse professionnelle (ex. `codedutravail.gn` ou `.org`) :
achetez le domaine (Namecheap, Gandi… ou un registrar `.gn`), puis dans Vercel
→ **Settings → Domains → Add**, et suivez les instructions DNS. Le domaine
pointera sur votre site sans rien changer d'autre.

---

## 5. Avertissement à conserver

La plateforme est un **outil pédagogique et documentaire**. Les explications et
conseils RH sont des reformulations destinées à faciliter la compréhension ; ils ne
remplacent pas le texte officiel du Code du travail ni l'avis d'un juriste. Ce
rappel figure déjà en bas de la page d'accueil — gardez-le.
