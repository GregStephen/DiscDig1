using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class AlbumCollection
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int NumberInCollection { get; set; }
        public List<Album> Albums { get; set; }
    }
}
