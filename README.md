# מיון מאכלים לקטגוריות 🧑‍🌾

משחק גרירה אינטראקטיבי בעברית לילדים — עזרו לחקלאי למיין את המאכלים לקבוצות השונות!

## 🎮 איך משחקים?

גררו את המאכלים מסביב למדף אל תוך המדף המתאים:

| קטגוריה | דוגמאות |
|---------|---------|
| 🍎 **פירות וירקות** | עגבנייה, בננה, גזר, תפוח |
| 🧀 **מוצרי חלב** | חמאה, גבינה, חלב, שמנת |
| 🍞 **מאפים** | לחם, קרואסון, עוגייה, שושנת קינמון |

- ✅ מיון נכון — צליל הצלחה + סימן V
- ❌ מיון שגוי — צליל שגיאה + הפריט חוזר למקומו
- 🎉 סיום — מחיאות כפיים וקונפטי!

## 🛠️ טכנולוגיות

- HTML5 / CSS3 / JavaScript (Vanilla)
- [interact.js](https://interactjs.io/) — גרירה ושחרור עם תמיכה במגע
- Web Audio API — צלילי משחק
- עיצוב רספונסיבי עם יחידות `vmin`
- RTL מלא בעברית עם גופן [Heebo](https://fonts.google.com/specimen/Heebo)

## 🚀 התקנה מקומית

```bash
git clone https://github.com/DavidShermann/food-sorting-game.git
cd food-sorting-game
python3 -m http.server 8080
```

פתחו בדפדפן: `http://localhost:8080`

## 🌐 שחקו אונליין

**[https://davidshermann.github.io/food-sorting-game/](https://davidshermann.github.io/food-sorting-game/)**

## 📁 מבנה הפרויקט

```
food-sorting-game/
├── index.html              # דף המשחק
├── game-config.json        # הגדרות קטגוריות ופריטים
├── css/style.css           # עיצוב ואנימציות
├── js/
│   ├── game.js             # לוגיקת המשחק
│   ├── drag-drop.js        # גרירה ושחרור (interact.js)
│   └── audio.js            # מנהל צלילים
└── assets/
    ├── shelf/              # תמונת המדף
    ├── items/              # תמונות המאכלים
    ├── categories/         # תמונות הקטגוריות
    ├── sounds/             # צלילי מחיאות כפיים
    └── ui/                 # אייקון V
```

## ⚙️ התאמה אישית

ערכו את `game-config.json` כדי לשנות קטגוריות, פריטים ותמונות — ללא שינוי קוד.

## 📄 רישיון

MIT
