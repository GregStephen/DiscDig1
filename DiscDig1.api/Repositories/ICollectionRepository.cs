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
        bool DeleteTheseAlbumsFromTheCollection(AlbumsToDelete albumsToDelete);
        bool AddNewSubcollection(NewSubDTO newSubDTO);
        IEnumerable<SubCollectionsInfo> GetUsersSubCollections(Guid userId);
    }
}
