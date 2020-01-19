using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DTOS
{
    public class NewAlbumDTO
    {
        public string Title { get; set; }
        public string ImgUrl { get; set; }
        public string Label { get; set; }
        public string Artist { get; set; }
        public DateTime ReleaseYear { get; set; }
        public int DiscogId { get; set; }
        public List<string> Genre { get; set; }
        public List<string> Style { get; set; }
    }
}
