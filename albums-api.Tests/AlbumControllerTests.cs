using Xunit;
using albums_api.Controllers;
using Microsoft.AspNetCore.Mvc;
using albums_api.Models;
using System.Collections.Generic;

namespace albums_api.Tests
{
    public class AlbumControllerTests
    {
        [Fact]
        public void Get_ReturnsAllAlbums()
        {
            // Arrange
            var controller = new AlbumController();

            // Act
            var result = controller.Get() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var albums = result.Value as List<Album>;
            Assert.NotNull(albums);
            Assert.Equal(6, albums.Count);
        }
    }
}
