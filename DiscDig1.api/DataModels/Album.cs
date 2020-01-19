using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class Album
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public List<string> Genre { get; set; }
        public List<string> Style { get; set; }
        public string Label { get; set; }
        public DateTime YearReleased { get; set; }
        public int DiscogId { get; set; }
        public string ImgUrl { get; set; }
    }
}
