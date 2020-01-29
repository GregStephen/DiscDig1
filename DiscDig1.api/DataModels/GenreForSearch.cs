using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class GenreForSearch
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int TotalAlbums { get; set; }
    }
}
