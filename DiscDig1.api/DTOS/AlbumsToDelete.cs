using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class AlbumsToDelete
    {
        public Guid CollectionId { get; set; }
        public List<Guid> DeleteTheseAlbums { get; set; }
    }
}
