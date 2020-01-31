using DiscDig1.DataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface IGenreRepository
    {
        IEnumerable<GenreForSearch> GetAllGenresForSearch();
        IEnumerable<GenreForSearch> GetAlbumsInCategories(string regex, Guid id);
        bool AddGenreToAlbum(Guid albumId, string genreName);
        List<string> GetListOfGenreNamesForAlbum(Guid albumId);
        IEnumerable<GenreForSearch> GetTotalForEachGenreInCollection(Guid collectionId, Guid genreId);
    }
}
