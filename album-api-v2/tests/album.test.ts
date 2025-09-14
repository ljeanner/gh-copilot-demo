import request from 'supertest';
import express, { Request, Response } from 'express';
import { albums, Album } from '../src/album';
import '../src/index';

const app = express();
app.use(express.json());

// Reprise des routes pour les tests
app.get('/albums', (req: Request, res: Response) => res.json(albums));
app.get('/albums/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const album = albums.find(a => a.id === id);
  if (!album) return res.status(404).json({ error: 'Album not found' });
  res.json(album);
});
app.post('/albums', (req: Request, res: Response) => {
  const { title, artist, year, coverUrl } = req.body;
  if (!title || !artist || !year || !coverUrl) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const id = albums.length ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  const newAlbum: Album = { id, title, artist, year, coverUrl };
  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});
app.put('/albums/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Album not found' });
  const { title, artist, year, coverUrl } = req.body;
  if (!title || !artist || !year || !coverUrl) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  albums[index] = { id, title, artist, year, coverUrl };
  res.json(albums[index]);
});
app.delete('/albums/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Album not found' });
  const deleted = albums.splice(index, 1);
  res.json(deleted[0]);
});

describe('Album API v2', () => {
  it('GET /albums should return all albums', async () => {
    const res = await request(app).get('/albums');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /albums/:id should return one album', async () => {
    const res = await request(app).get('/albums/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Abbey Road');
  });

  it('POST /albums should add an album', async () => {
    const newAlbum = {
      title: 'Test Album',
      artist: 'Test Artist',
      year: 2022,
      coverUrl: 'http://test.com/cover.jpg'
    };
    const res = await request(app).post('/albums').send(newAlbum);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Album');
  });

  it('PUT /albums/:id should update an album', async () => {
    const update = {
      title: 'Updated Album',
      artist: 'Updated Artist',
      year: 2023,
      coverUrl: 'http://test.com/updated.jpg'
    };
    const res = await request(app).put('/albums/1').send(update);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Album');
  });

  it('DELETE /albums/:id should delete an album', async () => {
    const res = await request(app).delete('/albums/2');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
  });
});
