using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class DiscDigPagination
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalAlbums { get; set; }
        public int PerPage { get; set; }
    }
}
