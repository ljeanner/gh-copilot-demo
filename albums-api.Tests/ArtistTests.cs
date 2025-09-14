using Xunit;
using albums_api.Models;
using System;

namespace albums_api.Tests
{
    public class ArtistTests
    {
        [Fact]
        public void Artist_Properties_AreSetCorrectly()
        {
            var birthdate = new DateTime(1990, 1, 1);
            var artist = new Artist("Test Artist", birthdate, "Test City");

            Assert.Equal("Test Artist", artist.Name);
            Assert.Equal(birthdate, artist.Birthdate);
            Assert.Equal("Test City", artist.BirthPlace);
        }
    }
}
