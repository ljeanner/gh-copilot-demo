using System;
using System.Collections.Generic;
namespace albums_api.Models
{
    public record Album(int Id, string Title, Artist Artist, double Price, string Image_url)
    {
        public static List<Album> GetAll()
        {
            var albums = new List<Album>(){
                new Album(1, "You, Me and an App Id", new Artist("Daprize", new DateTime(1980, 5, 12), "Paris"), 10.99, "https://aka.ms/albums-daprlogo"),
                new Album(2, "Seven Revision Army", new Artist("The Blue-Green Stripes", new DateTime(1975, 8, 23), "London"), 13.99, "https://aka.ms/albums-containerappslogo"),
                new Album(3, "Scale It Up", new Artist("KEDA Club", new DateTime(1990, 2, 14), "Berlin"), 13.99, "https://aka.ms/albums-kedalogo"),
                new Album(4, "Lost in Translation", new Artist("MegaDNS", new DateTime(1985, 11, 30), "Tokyo"), 12.99,"https://aka.ms/albums-envoylogo"),
                new Album(5, "Lock Down Your Love", new Artist("V is for VNET", new DateTime(1978, 7, 9), "New York"), 12.99, "https://aka.ms/albums-vnetlogo"),
                new Album(6, "Sweet Container O' Mine", new Artist("Guns N Probeses", new DateTime(1982, 3, 21), "Los Angeles"), 14.99, "https://aka.ms/albums-containerappslogo")
            };
            return albums;
        }
    }
}
