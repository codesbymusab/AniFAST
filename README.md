# 🎌 AniFAST

AniFAST is a full-stack anime discovery and community platform. It lets users browse and search an anime catalog, build personalized watchlists and favorites, write reviews, get tailored recommendations, and connect with other fans through forums, posts, friends, and direct messaging.

---

## 🔗 Live Link

https://ani-fast-ftwt.vercel.app

---

## 🚀 Key Features

### 📚 Anime Catalog
- Browse anime with details such as title, Japanese title, episode count, status, synopsis, rating, cover image, and studio
- Filter views for newest/currently airing titles, top-rated titles, and seasonal lineups
- Full-text style search across title, Japanese title, and genre
- Genre and tag system for categorizing anime

### 🎯 Personalized Recommendations
AniFAST generates suggestions using three complementary strategies:
1. **Watchlist-based** — anime sharing a high number of genres and tags with what's already on a user's watchlist
2. **Favorites-based** — anime with moderate genre/tag overlap with a user's favorited titles
3. **Social-based** — anime that a user's friends are watching but the user hasn't seen yet

### 👤 User Accounts & Profiles
- Sign up / authentication with hashed passwords
- Editable profile bio and avatar (profile picture index)
- Personal watchlist and favorites lists

### ⭐ Reviews & Ratings
- Submit ratings (1–10) and written reviews for any anime
- View all reviews for a title, a user's own reviews, or the most recent reviews site-wide

### 💬 Community
- Forums and discussion posts with like and comment counts
- Comment threads on posts
- Friend system with friend requests/status tracking
- Direct messaging between users

## 🛠️ Tech Stack

- **Frontend:** Next.js with TypeScript, CSS
- **Database:** Microsoft SQL Server (T-SQL)
- **Database tooling:** Raw SQL scripts and a `.bacpac` database export for easy restore

## 📂 Project Structure

```
AniFAST/
├── anifast(1)/my-app/            # Next.js + TypeScript application
├── AniFast_scripts.sql           # Full database schema, queries, indexes, and triggers
├── anifastdb.bacpac              # Database export for restoring into SQL Server / Azure SQL
└── AniFAST_project_schema_diagram.pdf   # Entity-relationship diagram of the database
```
## 📸 Screenshots

<img width="1908" height="973" alt="Screenshot 2026-06-15 150311" src="https://github.com/user-attachments/assets/d5fdf307-3db3-44eb-8595-d9cfb43f6b56" />

<img width="1908" height="971" alt="Screenshot 2026-06-15 150329" src="https://github.com/user-attachments/assets/27064b9b-9202-4135-afa5-6066c603782a" />

<img width="1912" height="971" alt="Screenshot 2026-06-15 150542" src="https://github.com/user-attachments/assets/3de15927-5f74-4cd1-affd-28755f02af4c" />


## 🗄️ Database Schema

The database (`AniFAST`) consists of the following core tables:

| Table | Purpose |
|---|---|
| `Users` | Account info, profile bio, avatar |
| `Studios` | Anime production studios |
| `Anime` | Core anime catalog entries |
| `Genres` / `Tags` | Categorization metadata |
| `AnimeGenres` / `AnimeTags` | Many-to-many links between anime and genres/tags |
| `UserAnimeList` | Per-user watch progress, status, and notes |
| `Reviews` | User ratings and written reviews |
| `Favorites` / `Watchlist` | User-curated anime lists |
| `Forums` / `Posts` / `Comments` / `Likes` | Community discussion features |
| `Friends` | Social graph between users |
| `Messages` | Direct messages between users |
| `SeasonalAnime` | Anime grouped by release season/year |
| `Trending` | Ranked trending anime |
| `Recommendations` | Stored anime-to-anime suggestions |

The schema also includes:
- **Indexes** on frequently queried columns (titles, emails, foreign keys, timestamps) for performance
- **Triggers** that automatically keep `Posts.LikeCount` and `Posts.CommentsCount` in sync with the `Likes` and `Comments` tables, and that prevent duplicate `Watchlist`/`Favorites` entries

##  📖 How to Run

### ✅ Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Microsoft SQL Server (local instance or Azure SQL)

### 1. Clone the repository
```bash
git clone https://github.com/codesbymusab/AniFAST.git
cd "AniFAST/anifast(1)/my-app"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database
Either:
- Restore `anifastdb.bacpac` into your SQL Server / Azure SQL instance, **or**
- Run `AniFast_scripts.sql` against a fresh database to create the schema, indexes, and triggers

### 4. Configure environment variables
Create a `.env.local` file in `my-app` with your database connection details, e.g.:
```
DB_SERVER=your-server.database.windows.net
DB_NAME=AniFAST
DB_USER=your-username
DB_PASSWORD=your-password
```

### 5. Run the development server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🖼️ Database Schema Diagram

See `AniFAST_project_schema_diagram.pdf` for a visual entity-relationship diagram of the full database.

## 📄 License

This project is open-source and available under the MIT License.
