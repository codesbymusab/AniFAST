-- Anime Recommendation Database Schema

Create Database AniFAST;

GO

Use AniFast;

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(255) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255),
    JoinDate DATETIME DEFAULT GETDATE(),
    Bio TEXT
);

CREATE TABLE Studios (
    StudioID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    Founded DATE,
    Website VARCHAR(255)
);

CREATE TABLE Anime (
    AnimeID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    JapaneseTitle VARCHAR(255),
    Type VARCHAR(50) NOT NULL,
    Episodes INT,
    Status VARCHAR(50),
    ReleaseDate DATE,
    Synopsis TEXT,
    Rating FLOAT,
    CoverImage VARCHAR(255),
    StudioID INT FOREIGN KEY REFERENCES Studios(StudioID)
);

CREATE TABLE Genres (
    GenreID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Tags (
    TagID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE AnimeGenres (
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    GenreID INT NOT NULL FOREIGN KEY REFERENCES Genres(GenreID),
    PRIMARY KEY (AnimeID, GenreID)
);

CREATE TABLE AnimeTags (
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    TagID INT NOT NULL FOREIGN KEY REFERENCES Tags(TagID),
    PRIMARY KEY (AnimeID, TagID)
);

CREATE TABLE UserAnimeList (
    ListID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    Status VARCHAR(50),
    Score INT,
    Progress INT,
    StartDate DATE,
    FinishDate DATE,
    Notes TEXT
);

CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 10),
    ReviewText TEXT,
    Timestamp DATETIME DEFAULT GETDATE()
);

CREATE TABLE Favorites (
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    PRIMARY KEY (UserID, AnimeID)
);

CREATE TABLE Watchlist (
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    PRIMARY KEY (UserID, AnimeID)
);

CREATE TABLE Forums (
    ForumID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    CreatedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Posts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    ForumID INT NOT NULL FOREIGN KEY REFERENCES Forums(ForumID),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Content TEXT NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE()
);

CREATE TABLE Friends (
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    FriendID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Status VARCHAR(50) NOT NULL,
    PRIMARY KEY (UserID, FriendID)
);

CREATE TABLE Messages (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    SenderID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    ReceiverID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Content TEXT NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE()
);

CREATE TABLE SeasonalAnime (
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    Season VARCHAR(50) NOT NULL,
    Year INT NOT NULL,
    PRIMARY KEY (AnimeID, Season, Year)
);

CREATE TABLE Trending (
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    Rank INT NOT NULL,
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Recommendations (
    RecID INT PRIMARY KEY IDENTITY(1,1),
    AnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    SuggestedAnimeID INT NOT NULL FOREIGN KEY REFERENCES Anime(AnimeID),
    Reason TEXT,
    Upvotes INT DEFAULT 0,
    Downvotes INT DEFAULT 0
);


--------------------------------------------------------------------------------

-- Consolidated SQL queries with comments explaining their purpose.
-- Replace placeholders (e.g., @email, @AnimeID, @limit) with actual bindings

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
-- 1. USER MANAGEMENT
--------------------------------------------------------------------------------

-- 1.1 Insert a new user (Sign-up)
-- Purpose: Create a new user record and return its auto-generated UserID.
-- Usage: Bind @email, @username, @password before executing.
INSERT INTO USERS (Email, Username, PasswordHash)
OUTPUT inserted.UserID
VALUES (@email, @username, @password);
GO

-- 1.2 Fetch user profile by email
-- Purpose: Retrieve a user's basic info (username, email, bio, pfp index).
-- Usage: Bind @email before executing.
SELECT
  Username    AS name,
  Email       AS email,
  Bio         AS bio,
  PfpNum      AS pfpNum
FROM Users
WHERE Email = @email;
GO

-- 1.3 Update user bio
-- Purpose: Overwrite the Bio field for a given user.
-- Usage: Bind @email, @bio before executing.
UPDATE Users
SET Bio = @bio
WHERE Email = @email;
GO

-- 1.4 Fetch user's profile picture index (PfpNum)
-- Purpose: Look up which avatar number a user currently has.
-- Usage: Bind @email before executing.
SELECT PfpNum
FROM Users
WHERE Email = @email;
GO

-- 1.5 Update user's profile picture index (PfpNum)
-- Purpose: Change which avatar number (PfpNum) a user is using.
-- Usage: Bind @email, @pfpNum before executing.
UPDATE Users
SET PfpNum = @pfpNum
WHERE Email = @email;
GO

--------------------------------------------------------------------------------
-- 2. ANIME CATALOG & SEARCH
--------------------------------------------------------------------------------

-- 2.1 List top N anime (default, unfiltered)
-- Purpose: Retrieve up to N anime entries in arbitrary order.
-- Usage: Bind @limit before executing.
SELECT TOP (@limit)
  AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage
FROM Anime;
GO

-- 2.2 List newest or currently releasing anime
-- Purpose: Fetch up to N anime released in the last 6 months or still "RELEASING".
-- Usage: Bind @limit before executing.
SELECT TOP (@limit)
  AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage
FROM Anime
WHERE ReleaseDate >= DATEADD(month, -6, GETDATE())
   OR Status = 'RELEASING';
GO

-- 2.3 List top-rated anime
-- Purpose: Retrieve up to N anime entries sorted by rating (highest first).
-- Usage: Bind @limit before executing.
SELECT TOP (@limit)
  AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage
FROM Anime
ORDER BY Rating DESC;
GO

-- 2.4 Get detailed info for a single anime (by ID)
-- Purpose: Return an anime's full details—including studio, comma-separated lists of genres and tags.
-- Usage: Bind @AnimeID before executing.
SELECT
  A.AnimeID,
  A.Title,
  A.JapaneseTitle,
  A.CoverImage,
  A.Synopsis,
  A.Rating,
  A.Episodes,
  CAST(A.ReleaseDate AS NVARCHAR(MAX)) AS ReleaseDate,
  A.Status,
  S.Name      AS Studio,
  S.Website,
  (
    SELECT STRING_AGG(Name, ', ')
    FROM (
      SELECT DISTINCT G.Name
      FROM AnimeGenres AG
      INNER JOIN Genres G ON AG.GenreID = G.GenreID
      WHERE AG.AnimeID = A.AnimeID
    ) AS UniqueGenres
  ) AS Genres,
  (
    SELECT STRING_AGG(Name, ', ')
    FROM (
      SELECT DISTINCT T.Name
      FROM AnimeTags AT
      INNER JOIN Tags T ON AT.TagID = T.TagID
      WHERE AT.AnimeID = A.AnimeID
    ) AS UniqueTags
  ) AS Tags
FROM Anime AS A
JOIN Studios AS S ON A.StudioID = S.StudioID
WHERE A.AnimeID = @AnimeID;
GO

-- 2.5 Search anime by title, Japanese title, or genre name
-- Purpose: Find anime matching the search term, sorted by rating.
-- Usage: Bind @searchTerm (e.g., '%naruto%') before executing.
SELECT DISTINCT
  a.AnimeID,
  a.Title,
  a.JapaneseTitle,
  a.Synopsis,
  a.CoverImage,
  a.Episodes,
  a.Status,
  a.Rating,
  a.ReleaseDate,
  a.Type,
  (
    SELECT STRING_AGG(g.Name, ', ')
    FROM AnimeGenres ag
    JOIN Genres g ON ag.GenreID = g.GenreID
    WHERE ag.AnimeID = a.AnimeID
  ) AS Genres
FROM Anime a
LEFT JOIN AnimeGenres ag ON a.AnimeID = ag.AnimeID
LEFT JOIN Genres g ON ag.GenreID = g.GenreID
WHERE a.Title        LIKE @searchTerm
   OR a.JapaneseTitle LIKE @searchTerm
   OR g.Name         LIKE @searchTerm
ORDER BY a.Rating DESC;
GO

--------------------------------------------------------------------------------
-- 3. PERSONALIZED RECOMMENDATIONS
--------------------------------------------------------------------------------

-- 3.1 Recommendation Type 1 (Based on user's watchlist: high genre & tag overlap)
-- Purpose: From anime not yet in a user's watchlist, pick the top 6 with ≥6 matching genres and ≥6 matching tags.
-- Usage: Bind @email before executing.
SELECT TOP 6
  FA.AnimeID,
  FA.Title,
  FA.Episodes,
  FA.Status,
  FA.Rating,
  FA.CoverImage,
  FA.Name,
  FA.GenreMatchCount,
  FA.TagMatchCount
FROM (
  SELECT
    A.AnimeID,
    A.Title,
    A.Episodes,
    A.Status,
    A.Rating,
    A.CoverImage,
    S.Name,
    COUNT(DISTINCT AG.GenreID) AS GenreMatchCount,
    COUNT(DISTINCT AT.TagID)   AS TagMatchCount
  FROM Anime AS A
  JOIN Studios AS S ON A.StudioID = S.StudioID
  LEFT JOIN Watchlist AS W
    ON A.AnimeID = W.AnimeID
   AND W.Email = @email
  JOIN AnimeGenres AG ON A.AnimeID = AG.AnimeID
  JOIN AnimeTags AT   ON A.AnimeID = AT.AnimeID
  WHERE EXISTS (
    SELECT 1
    FROM AnimeGenres
    WHERE AnimeID IN (
      SELECT AnimeID
      FROM Watchlist
      WHERE Email = @email
    )
      AND GenreID = AG.GenreID
  )
    AND EXISTS (
      SELECT 1
      FROM AnimeTags
      WHERE AnimeID IN (
        SELECT AnimeID
        FROM Watchlist
        WHERE Email = @email
      )
        AND TagID = AT.TagID
    )
    AND W.AnimeID IS NULL
  GROUP BY
    A.AnimeID,
    A.Title,
    A.Episodes,
    A.Status,
    A.Rating,
    A.CoverImage,
    S.Name
) AS FA
WHERE FA.GenreMatchCount >= 6
  AND FA.TagMatchCount   >= 6
ORDER BY (FA.GenreMatchCount * 2 + FA.TagMatchCount * 1.5) DESC;
GO

-- 3.2 Recommendation Type 2 (Based on user's favorites: moderate genre & tag overlap)
-- Purpose: From anime not yet favorited by a user, pick the top 6 with ≥3 matching genres and ≥3 matching tags.
-- Usage: Bind @email before executing.
SELECT TOP 6
  A.AnimeID,
  A.Title,
  A.Episodes,
  A.Status,
  A.Rating,
  A.CoverImage,
  S.Name,
  COUNT(DISTINCT G.GenreID) AS GenreMatchCount,
  COUNT(DISTINCT T.TagID)   AS TagMatchCount
FROM Anime AS A
JOIN Studios AS S ON A.StudioID = S.StudioID
LEFT JOIN Favorites AS F
  ON A.AnimeID = F.AnimeID
 AND F.Email   = @email
JOIN AnimeGenres AG ON A.AnimeID = AG.AnimeID
JOIN AnimeTags AT   ON A.AnimeID = AT.AnimeID
JOIN Genres G       ON AG.GenreID = G.GenreID
JOIN Tags T         ON AT.TagID   = T.TagID
WHERE G.GenreID IN (
  SELECT GenreID
  FROM AnimeGenres
  WHERE AnimeID IN (
    SELECT AnimeID
    FROM Favorites
    WHERE Email = @email
  )
)
  AND T.TagID IN (
    SELECT TagID
    FROM AnimeTags
    WHERE AnimeID IN (
      SELECT AnimeID
      FROM Favorites
      WHERE Email = @email
    )
  )
  AND F.AnimeID IS NULL
GROUP BY
  A.AnimeID,
  A.Title,
  A.Episodes,
  A.Status,
  A.Rating,
  A.CoverImage,
  S.Name
HAVING COUNT(DISTINCT G.GenreID) >= 3
   AND COUNT(DISTINCT T.TagID)   >= 3
ORDER BY (COUNT(DISTINCT G.GenreID) * 2 + COUNT(DISTINCT T.TagID) * 1.5) DESC;
GO

-- 3.3 Recommendation Type 3 (Based on friends' watchlists, excluding user's own)
-- Purpose: Suggest all anime that any friend of the user has on their watchlist, but which the user has not yet watched.
-- Usage: Bind @email before executing.
SELECT
  A.AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage,
  S.Name
FROM Users AS U
JOIN Watchlist AS W ON W.Email = U.Email
JOIN Anime AS A     ON A.AnimeID = W.AnimeID
JOIN Studios AS S    ON A.StudioID = S.StudioID
WHERE W.Email IN (
  SELECT FriendEmail
  FROM Friends
  WHERE UserEmail = @email
)
  AND A.AnimeID NOT IN (
    SELECT A.AnimeID
    FROM Users AS U2
    JOIN Watchlist AS W2 ON W2.Email = U2.Email
    JOIN Anime AS A2     ON A2.AnimeID = W2.AnimeID
    WHERE W2.Email = @email
  );
GO

--------------------------------------------------------------------------------
-- 4. WATCHLIST & FAVORITES
--------------------------------------------------------------------------------

-- 4.1 Fetch all anime on a user's watchlist
-- Purpose: List anime details that a user has added to their watchlist.
-- Usage: Bind @email before executing.
SELECT
  A.AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage,
  S.Name
FROM Users AS U
JOIN Watchlist AS W ON W.Email = U.Email
JOIN Anime AS A     ON A.AnimeID = W.AnimeID
JOIN Studios AS S    ON A.StudioID = S.StudioID
WHERE W.Email = @email;
GO

-- 4.2 Fetch all anime in a user's favorites
-- Purpose: List anime details that a user has marked as favorite.
-- Usage: Bind @email before executing.
SELECT
  A.AnimeID,
  Title,
  Episodes,
  Status,
  Rating,
  CoverImage,
  S.Name
FROM Users AS U
JOIN Favorites AS F ON F.Email = U.Email
JOIN Anime AS A      ON A.AnimeID = F.AnimeID
JOIN Studios AS S     ON A.StudioID = S.StudioID
WHERE F.Email = @email;
GO

-- 4.3 Add an anime to user's favorites
-- Purpose: Insert a new row into the Favorites table linking a user and an anime.
-- Usage: Bind @AnimeId, @userEmail before executing.
INSERT INTO Favorites (AnimeId, Email)
VALUES (@AnimeId, @userEmail);
GO

--------------------------------------------------------------------------------
-- 5. REVIEWS
--------------------------------------------------------------------------------

-- 5.1 Create a new review
-- Purpose: Insert a user's review for a given anime (including avatar index, rating, content, date).
-- Usage: Bind @AnimeId, @UserEmail, @Avatar, @Rating, @Content, @ReviewDate before executing.
INSERT INTO Reviews (
  AnimeId,
  UserEmail,
  Avatar,
  Rating,
  Content,
  ReviewDate
)
VALUES (
  @AnimeId,
  @UserEmail,
  @Avatar,
  @Rating,
  @Content,
  @ReviewDate
);
GO

-- 5.2 Fetch reviews written by a specific user (limit 4)
-- Purpose: Return up to 4 reviews that a particular user has written, including anime title and reviewer username.
-- Usage: Bind @email before executing.
SELECT TOP 4
  U.Username,
  A.Title,
  R.*
FROM Reviews AS R
JOIN Anime AS A ON A.AnimeID = R.AnimeID
JOIN Users AS U ON U.Email   = R.UserEmail
WHERE UserEmail = @email;
GO

-- 5.3 Fetch the most recent 6 reviews across all users
-- Purpose: Return up to 6 of the latest reviews, including author and anime title.
-- Usage: No parameters needed, returns globally latest 6 reviews.
SELECT TOP 6
  U.Username,
  A.Title,
  R.*
FROM Reviews AS R
JOIN Anime AS A ON A.AnimeID = R.AnimeID
JOIN Users AS U ON U.Email   = R.UserEmail;
GO

-- 5.4 Fetch all reviews for a specific anime
-- Purpose: Return every review for one anime, along with each reviewer's username.
-- Usage: Bind @AnimeID before executing.
SELECT
  U.Username,
  R.*
FROM Reviews AS R
JOIN Users AS U ON U.Email = R.UserEmail
WHERE AnimeID = @AnimeID;
GO

--------------------------------------------------------------------------------
-- 6. POSTS, COMMENTS & LIKES
--------------------------------------------------------------------------------

-- 6.1 POSTS

-- 6.1.1 List latest posts (with comment count and user info)
-- Purpose: Retrieve up to N most recent posts, including author username, avatar, and number of comments.
-- Usage: Bind @limit before executing.
SELECT TOP (@limit)
  p.PostID,
  p.Email,
  p.Title,
  p.Content,
  p.LikeCount,
  p.Timestamp,
  u.Username,
  u.PfpNum,
  (
    SELECT COUNT(*)
    FROM Comments c
    WHERE c.PostID = p.PostID
  ) AS CommentCount
FROM Posts p
INNER JOIN Users u
  ON p.Email = u.Email
ORDER BY p.Timestamp DESC;
GO

-- 6.1.2 Create a new post
-- Purpose: Insert a new post record (initial LikeCount = 0, timestamp now) and return its PostID.
-- Usage: Bind @email, @title, @content, @timestamp before executing.
INSERT INTO Posts (
  Email,
  Title,
  Content,
  LikeCount,
  Timestamp
)
VALUES (
  @email,
  @title,
  @content,
  0,
  @timestamp
);
SELECT SCOPE_IDENTITY() AS PostID;
GO

-- 6.1.3 Increment a post’s like count by 1 and return updated count
-- Purpose: Add one to the LikeCount of a given post, then fetch the updated count.
-- Usage: Bind @postId before executing.
UPDATE Posts
SET LikeCount = LikeCount + 1
WHERE PostID = @postId;

SELECT LikeCount
FROM Posts
WHERE PostID = @postId;
GO

-- 6.2 COMMENTS

-- 6.2.1 Fetch all comments for a given post (ordered oldest → newest)
-- Purpose: Return every comment on a specific post, along with the commenter’s username and avatar index.
-- Usage: Bind @postId before executing.
SELECT
  c.CommentID,
  c.Content,
  c.Timestamp,
  c.Email,
  u.Username,
  u.PfpNum
FROM Comments c
INNER JOIN Users u
  ON c.Email = u.Email
WHERE c.PostID = @postId
ORDER BY c.Timestamp ASC;
GO

-- 6.2.2 Create a new comment on a post
-- Purpose: Insert a comment into Comments (returning its new CommentID).
-- Usage: Bind @postId, @email, @content, @timestamp before executing.
INSERT INTO Comments (
  PostID,
  Email,
  Content,
  Timestamp
)
VALUES (
  @postId,
  @email,
  @content,
  @timestamp
);
SELECT SCOPE_IDENTITY() AS CommentID;
GO

-- 6.3 LIKES

-- 6.3.1 Check if a user has already liked a post
-- Purpose: Determine whether a specific (post, user) pair exists in Likes.
-- Usage: Bind @postId, @email before executing.
SELECT 1 AS hasLiked
FROM Likes
WHERE PostID = @postId
  AND Email  = @email;
GO

-- 6.3.2 Toggle like: check existence, then DELETE or INSERT accordingly.
-- Step A: Check existing like
-- Purpose: See if the user has already liked the post.
-- Usage: Bind @postId, @email before executing.
SELECT 1
FROM Likes
WHERE PostID = @postId
  AND Email  = @email;
GO

-- Step B1: Remove existing like
-- Purpose: If a like exists, delete that record.
-- Usage: Bind @postId, @email before executing.
DELETE FROM Likes
WHERE PostID = @postId
  AND Email  = @email;
GO

-- Step B2: Add new like
-- Purpose: If no like exists, insert a new (post, user, timestamp) record.
-- Usage: Bind @postId, @email, @timestamp before executing.
INSERT INTO Likes (PostID, Email, Timestamp)
VALUES (@postId, @email, @timestamp);
GO

-- 6.3.3 Update a post’s LikeCount after toggling
-- Purpose: Recompute how many rows in Likes reference this post and store the result in the Posts record.
-- Usage: Bind @postId before executing, then bind @likeCount with the result before executing the UPDATE.
SELECT COUNT(*) AS LikeCount
FROM Likes
WHERE PostID = @postId;

-- Next, bind @likeCount = (value from previous SELECT) and run below:
UPDATE Posts
SET LikeCount = @likeCount
WHERE PostID = @postId;
GO

--------------------------------------------------------------------------------
-- 7. FRIENDS (SOCIAL GRAPH)
--------------------------------------------------------------------------------

-- 7.1 Fetch all friends for a given user
-- Purpose: List each friend’s user ID, username, avatar index, and friendship status for a particular user.
-- Usage: Bind @userEmail before executing.
SELECT
  U.UserID,
  U.Username,
  U.PfpNum,
  F.STATUS
FROM Friends AS F
JOIN Users   AS U ON F.FriendEmail = U.Email
WHERE F.UserEmail = @userEmail;
GO

--------------------------------------------------------------------------------
-- 8. USER-SPECIFIC POSTS
--------------------------------------------------------------------------------

-- 8.1 Fetch posts authored by a single user
-- Purpose: Return every post created by a particular email address, including comment counts, sorted newest first.
-- Usage: Bind @email before executing.
SELECT
  p.PostID    AS id,
  p.Title     AS title,
  p.Content   AS content,
  p.LikeCount AS likes,
  p.Timestamp AS timestamp,
  u.Username  AS username,
  u.PfpNum    AS pfpNum,
  (
    SELECT COUNT(*)
    FROM Comments c
    WHERE c.PostID = p.PostID
  ) AS comments
FROM Posts p
INNER JOIN Users u
  ON p.Email = u.Email
WHERE p.Email = @email
ORDER BY p.Timestamp DESC;
GO

-- 8.2 Create a new post on behalf of a user
-- Purpose: Insert a new post record (identical to 6.1.2), returning only PostID (no user lookup).
-- Usage: Bind @email, @title, @content, @timestamp before executing.
INSERT INTO Posts (
  Email,
  Title,
  Content,
  LikeCount,
  Timestamp
)
VALUES (
  @email,
  @title,
  @content,
  0,
  @timestamp
);
SELECT SCOPE_IDENTITY() AS id;
GO



