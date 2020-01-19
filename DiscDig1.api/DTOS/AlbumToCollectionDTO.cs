using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class AlbumToCollectionDTO
    {
        public NewAlbumDTO NewAlbum { get; set; }
        public Guid UserId { get; set; }
    }
}
