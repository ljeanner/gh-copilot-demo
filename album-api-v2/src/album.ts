export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  coverUrl: string;
}

export const albums: Album[] = [
  {
    id: 1,
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    id: 2,
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"
  },
  {
    id: 3,
    title: "Back in Black",
    artist: "AC/DC",
    year: 1980,
    coverUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ACDC_Back_in_Black.png"
  }
];
