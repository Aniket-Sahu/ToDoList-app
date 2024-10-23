var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const port = 3000;
const saltRounds = 10;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../backend/views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
db.connect();
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.use(express.static(path.join(__dirname, '../../React App/build')));
app.get('/toDoList', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../../React App/build/index.html'));
    }
    else {
        res.redirect('/login');
    }
});
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/home");
    });
});
app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home.ejs");
    }
    else {
        res.redirect("/login");
    }
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/toDoList",
    failureRedirect: "/",
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.username;
    const password = req.body.password;
    try {
        const checkResult = yield db.query("SELECT * FROM users WHERE username = $1", [user]);
        if (checkResult.rows.length > 0) {
            res.redirect("/login");
        }
        else {
            bcrypt.hash(password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.error("Error hashing password:", err);
                }
                else {
                    const result = yield db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [user, hash]);
                    const newUser = result.rows[0];
                    req.login(newUser, (err) => {
                        if (err) {
                            console.error("Error during login:", err);
                        }
                        else {
                            res.redirect("/login");
                        }
                    });
                }
            }));
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
app.get("/api/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user.id;
    try {
        const result = yield db.query("SELECT * FROM data WHERE user_id = $1", [userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching notes" });
    }
}));
app.post("/api/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, type } = req.body;
    const userId = req.user.id;
    if (!title || !content || !type) {
        res.status(400).json({ error: "Title, content, and type are required." });
        return;
    }
    try {
        const result = yield db.query("INSERT INTO data (title, content, type, user_id) VALUES ($1, $2, $3, $4) RETURNING *", [title, content, type, userId]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Failed to add note." });
    }
}));
app.delete("/api/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const noteId = parseInt(req.params.id, 10);
    try {
        yield db.query("DELETE FROM data WHERE id = $1 AND user_id = $2", [noteId, req.user.id]);
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting note" });
    }
}));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../React App/build/index.html'));
});
passport.use(new LocalStrategy((username, password, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashedPassword = user.password;
            if (storedHashedPassword) {
                bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                    }
                    else if (valid) {
                        return cb(null, user);
                    }
                    else {
                        return cb(null, false);
                    }
                });
            }
            else {
                return cb(null, false);
            }
        }
        else {
            return cb(null, false);
        }
    }
    catch (err) {
        console.log(err);
        return cb(err);
    }
})));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = result.rows[0];
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map