import express, { Request, Response } from "express";
import { albums, Album } from "./album";

const app = express();
app.use(express.json());
const PORT = 3000;

// GET /albums - liste tous les albums
app.get("/albums", (req: Request, res: Response) => {
  res.json(albums);
});

// GET /albums/:id - récupère un album par id
app.get("/albums/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const album = albums.find(a => a.id === id);
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

// POST /albums - ajoute un nouvel album
app.post("/albums", (req: Request, res: Response) => {
  const { title, artist, year, coverUrl } = req.body;
  if (!title || !artist || !year || !coverUrl) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const id = albums.length ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  const newAlbum: Album = { id, title, artist, year, coverUrl };
  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

// PUT /albums/:id - modifie un album
app.put("/albums/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Album not found" });
  const { title, artist, year, coverUrl } = req.body;
  if (!title || !artist || !year || !coverUrl) {
    return res.status(400).json({ error: "Missing fields" });
  }
  albums[index] = { id, title, artist, year, coverUrl };
  res.json(albums[index]);
});

// DELETE /albums/:id - supprime un album
app.delete("/albums/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Album not found" });
  const deleted = albums.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`Album API v2 running on port ${PORT}`);
});
