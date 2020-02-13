using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class DashboardData
    {
        public TopGenre TopGenre { get; set; }
        public TopArtist TopArtist { get; set; } 
        public TopDecade TopDecade { get; set; }
    }
}
