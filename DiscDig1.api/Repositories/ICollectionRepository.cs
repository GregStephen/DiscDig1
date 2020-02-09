using DiscDig1.DataModels;
using DiscDig1.DTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface ICollectionRepository
    {
        bool addMainCollectionForNewUser(Guid newUserId);
        bool AddNewAlbumToMainCollection(AlbumToCollectionDTO albumToCollectionDTO);
        AlbumCollection GetUsersMainCollection(Guid userId);
        AlbumCollection GetUsersCollectionById(Guid id);
        AlbumCollection SearchThruCollection(string term, Guid id, string[] searchGenres, int perPage, int currentPage, string sortBy, string direction);
        List<AlbumCollection> GetAllCollectionsByUserId(Guid userId);
        bool DeleteTheseAlbumsFromTheCollection(AlbumsToDelete albumsToDelete);
        bool AddNewSubcollection(NewSubDTO newSubDTO);
        IEnumerable<SubCollectionsInfo> GetUsersSubCollections(Guid userId);
        bool AddAlbumsToSubcollection(AddToSubcollectionDTO addToSubcollection);
        bool DeleteThisSubcollection(Guid id);
        bool ChangeSubCollectionName(ChangeSubNameDTO changeSubNameDTO);
        bool DeleteAllUsersCollections(Guid userId);
    }
}
