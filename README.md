# SkillSync

**SkillSync** is a web application that connects clients and freelancers.  
Clients can create projects, while freelancers can browse available projects and submit bids.  
The platform facilitates project management from creation through completion.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/afanfondu/skill-sync.git
cd skill-sync
```

### 2. Backend Setup

```bash
cd api

# Install dependencies
npm install

# Copy the environment file
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration:

```env
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = ""
DB_NAME = skillsync
JWT_SECRET = secret-key
```

### 3. Database Setup

```bash
# Generate initial migrations
npm run migration:generate -- db/migrations/initial-migrations

# Run migrations to create database schema
npm run migration:run
```

### 4. Start the Backend

```bash
npm run start:dev
```

The API server will be available at: [http://localhost:3000](http://localhost:3000)

---

### 5. Frontend Setup

```bash
cd ../app

# Install dependencies
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will be available at: [http://localhost:5173](http://localhost:5173)

---

## 📘 Usage

- Register as either a **client** or **freelancer**
- **Clients** can create new projects with details, budget, and deadlines
- **Freelancers** can browse projects and submit bids
- **Clients** can accept bids and track project progress
- Once completed, clients can mark projects as **complete**
