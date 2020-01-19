using DiscDig1.DTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public interface IAlbumRepository
    {
        Guid GetAlbumIdByDiscogId(int discogId);
        Guid AddNewAlbumToDatabase(NewAlbumDTO newAlbumDTO);
    }
}
